import { combineLatest, fromEvent, map, merge, Observable, startWith, switchMap, withLatestFrom } from "rxjs";
import { PickerComponent } from "../../components/picker.component";
import { Corner } from "../../enums/corner.enum";
import { Fighter } from "../../models/fighter";
import { CLASS_NAMES } from "../../utilities/constants";
import { getFightersByRulesAndWeightclass } from "../api.service";

export function getChangeRulesObs(picker: PickerComponent) {
    return fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RULES), "change")
}

export function getChangeFightInfoObs(picker: PickerComponent): Observable<Fighter[]> {
    let changeRule$ = fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RULES), "change");
    let changeWeightclasse$ = fromEvent(picker.getElement(CLASS_NAMES.SELECTS.WEIGHTCLASS), "change");

    return combineLatest([changeRule$, changeWeightclasse$])
        .pipe(
            switchMap(() => {
                let rules = picker.getRules();
                let weightclass = picker.getWeightclass();
                return getFightersByRulesAndWeightclass(rules, weightclass);
            }),
            startWith(([new Fighter()]))
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
            let selectedFighter: Fighter = fighters.find(fighter => fighter.id.toString() === id);
            let fighter = new Fighter(selectedFighter);
            if (select.classList.contains(CLASS_NAMES.SELECTS.RED_CORNER))
                return [fighter, Corner.RedCorner];
            else
                return [fighter, Corner.BlueCorner];
        })
    );
}