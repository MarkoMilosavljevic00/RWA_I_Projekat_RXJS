import {
    combineLatest,
    take,
    concatMap,
    fromEvent,
    interval,
    map,
    merge,
    Observable,
    range,
    startWith,
    switchMap,
    tap,
    withLatestFrom,
    zip,
    takeUntil,
    Subject,
    filter,
} from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { Corner } from "../../enums/corner.enum";
import { Message } from "../../enums/message.enum";
import { Method } from "../../enums/method.enum";
import { FightCard } from "../../models/fightCard";
import { Fighter } from "../../models/fighter";
import { FightStats, Scorecard } from "../../models/fightStats";
import { CLASS_NAMES } from "../../utilities/constants";
import { showError } from "../../utilities/helpers";
import { getFightersByRulesAndWeightclass } from "../api.service";
import { getFightCardLiveObs } from "../live.logic/live.observables";

export function getChangeRulesObs(picker: PickerComponent) {
    return fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RULES), "change");
}

export function getChangeMethodObs(picker: PickerComponent) {
    return fromEvent(picker.getElement(CLASS_NAMES.SELECTS.METHOD), "change").pipe(
        map((eventChange: Event) => {
            let select = eventChange.target as HTMLSelectElement;
            return select.value as Method;
        })
    );
}

export function getChangeFightInfoObs(picker: PickerComponent): Observable<Fighter[]> {
    let changeRule$ = getChangeRulesObs(picker);
    let changeWeightclasse$ = fromEvent(
        picker.getElement(CLASS_NAMES.SELECTS.WEIGHTCLASS),
        "change"
    );

    return combineLatest([changeRule$, changeWeightclasse$]).pipe(
        switchMap(() => {
            let rules = picker.getRules();
            let weightclass = picker.getWeightclass();
            return getFightersByRulesAndWeightclass(rules, weightclass);
        }),
        startWith([new Fighter()])
    );
}

export function getChangeFighterObs(picker: PickerComponent): Observable<[Fighter, Corner]> {
    let changeFightInfoOb$ = getChangeFightInfoObs(picker);
    let changeFighter$ = merge(
        fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RED_CORNER), "change"),
        fromEvent(picker.getElement(CLASS_NAMES.SELECTS.BLUE_CORNER), "change")
    );

    return changeFighter$.pipe(
        withLatestFrom(changeFightInfoOb$),
        map(([eventChange, fighters]: [Event, Fighter[]]) => {
            let select = eventChange.target as HTMLSelectElement;
            let id = select.value;
            let selectedFighter: Fighter = fighters.find((fighter) => fighter.id.toString() === id);
            let fighter = new Fighter(selectedFighter);
            if (select.classList.contains(CLASS_NAMES.SELECTS.RED_CORNER))
                return [fighter, Corner.Red];
            else return [fighter, Corner.Blue];
        })
    );
}

export function getAddFightObs(picker: PickerComponent): Observable<FightCard> {
    return fromEvent(picker.getElement(CLASS_NAMES.BUTTONS.ADD_FIGHT), "click").pipe(
        map(() => {
            let fight = picker.getFightInfo();
            picker.addFight(fight);
            return picker.getFightCard();
        })
    );
}

export function getUndoObs(picker: PickerComponent) {
    return fromEvent(picker.getElement(CLASS_NAMES.BUTTONS.UNDO), "click").pipe(
        map(() => {
            if (!picker.checkIsFightCardEmpty()) {
                picker.removeFight();
            }
            return picker.getFightCard();
        })
    );
}

export function getCollectFightsObs(picker: PickerComponent) {
    let addFightClick$ = getAddFightObs(picker);
    let undoClick$ = getUndoObs(picker);
    return merge(addFightClick$, undoClick$).pipe(tap(() => picker.renderUndoButton()));
}

export function getStartFightsObs(
    live: LiveComponent,
    picker: PickerComponent,
    endOfFight$: Subject<[FightStats, Scorecard[], number, number]>,
    endOfFightCard$: Subject<boolean>
) {
    return fromEvent(
        picker.getElement(CLASS_NAMES.BUTTONS.START_FIGHTS),
        "click"
    ).pipe(
        withLatestFrom(getCollectFightsObs(picker)),
        map(([_, fightCard]: [Event, FightCard]) => fightCard),
        tap((fightCard) => {
            if (fightCard.fights.length === 0)
                showError(Message.EmptyFightcard);
        }),
        filter((fightCard) => fightCard.fights.length > 0),
        switchMap((fightCard) =>
            getFightCardLiveObs(live, fightCard, endOfFight$, endOfFightCard$)
        )
    );
}
