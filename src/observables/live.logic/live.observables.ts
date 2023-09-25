import {
    concatMap,
    fromEvent,
    interval,
    map,
    Observable,
    range,
    switchMap,
    withLatestFrom,
    zip,
    takeUntil,
    filter,
    timer,
    race,
    mapTo,
    tap,
    Subject,
    take,
    finalize,
    merge,
} from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { Message } from "../../enums/message.enum";
import { Fight } from "../../models/fight";
import { FightCard } from "../../models/fightCard";
import { FightEvent } from "../../models/fightEvent";
import { FightStats, Scorecard } from "../../models/fightStats";
import { CLASS_NAMES, RULES, TIME } from "../../utilities/constants";
import { showError } from "../../utilities/helpers";
import { getCollectFightsObs } from "../picker.logic/picker.observables";

export function getFightTickObs(
    live: LiveComponent
): Observable<{ round: number; secondsElapsed: number }> {
    return interval(TIME.TICK_DURATION).pipe(
        map(() => live.tickSecond(live.fight.rules))
    );
}

export function getFightEventObs(
    live: LiveComponent
): Observable<FightEvent | null> {
    return interval(TIME.TICK_DURATION).pipe(
        map(() => {
            let random = Math.random();
            if (random < live.getFightEventProbability())
                return live.generateEvent();
            else 
                return null;
        })
    );
}

export function getCheckForFinishObs(live: LiveComponent) {
    return interval(TIME.TICK_DURATION).pipe(
        filter(() => live.checkForFinish()),
    );
}

export function getFightTimerObs(live: LiveComponent) {
    return timer(
        TIME.TICK_DURATION *
            TIME.TICKS_IN_MINUTE *
            RULES.ROUND_DURATION_IN_MINUTES[live.fight.rules] *
            RULES.NUMBER_OF_ROUNDS[live.fight.rules]
    );
}

export function getFightEndObs(live: LiveComponent) {
    const fightTimer$ = getFightTimerObs(live);
    const checkForFinish$ = getCheckForFinishObs(live);

    return race(fightTimer$, checkForFinish$);
}

export function getFightCardLiveObs(
    live: LiveComponent,
    fightCard: FightCard,
    endOfFight$: Subject<[FightStats, Scorecard[], number, number]>,
    endOfFightCard$: Subject<boolean>
) {
    return range(0, fightCard.fights.length).pipe(
        concatMap((indexOfFight: number) => {
            let fight = fightCard.fights[indexOfFight];
            return getFightLiveObs(live, fight, indexOfFight, endOfFight$);
        }),
        finalize(() => {
            endOfFightCard$.next(true);
        })
    );
}

export function getFightLiveObs(
    live: LiveComponent,
    fight: Fight,
    indexOfFight: number,
    endOfFight$: Subject<[FightStats, Scorecard[], number, number]>
) {
    live.setFight(fight);
    return zip(getFightTickObs(live), getFightEventObs(live))
        .pipe(
            takeUntil(getFightEndObs(live)),
            finalize(() => {
                if (!live.checkForFinish()) 
                    live.getWinnerOfRound();
                endOfFight$.next([live.fightStats, live.scorecards, indexOfFight, live.round]);
            })
    );
}
