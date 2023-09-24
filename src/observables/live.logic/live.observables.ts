import { concatMap, fromEvent, interval, map, Observable, range, switchMap, withLatestFrom, zip, takeUntil, filter, timer, race, mapTo, tap, Subject, take, finalize } from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { ResultComponent } from "../../components/result.component";
import { Corner, mapCornerToKey } from "../../enums/corner.enum";
import { FightEventType } from "../../enums/fight-event-type.enum";
import { Method } from "../../enums/method.enum";
import { mapRulesToNumberOfRounds, mapRulesToRoundDuration } from "../../enums/rules.enum";
import { Fight } from "../../models/fight";
import { FightCard } from "../../models/fightCard";
import { FightEvent } from "../../models/fightEvent";
import { FightStats, Scorecard } from "../../models/fightStats";
import { Result } from "../../models/result";
import { CLASS_NAMES, DAMAGE, KEYS, PROBABILITY, RULES, TIME } from "../../utilities/constants";
import { mapNumberToIndex } from "../../utilities/helpers";
import { getAddFightObs } from "../picker.logic/picker.observables";

export function getFightTickObs(live: LiveComponent): Observable<{round: number,secondsElapsed: number}>{
    return interval(TIME.TICK_DURATION)
        .pipe(
            map(() => live.tickSecond(live.fight.rules)),
        );
}

export function getFightEventObs(live: LiveComponent): Observable<FightEvent | null>{
    return interval(TIME.TICK_DURATION)
        .pipe(
            map(() => {
                let random = Math.random();
                //console.log(`Random: ${random} < ${live.getFightEventProbability()},Tacnost:  ${random < live.getFightEventProbability()}`);
                if(random < live.getFightEventProbability()) 
                    return live.generateEvent();
                else
                    return null
            }
            ),
        )
}

export function getCheckForFinishObs(live: LiveComponent){
    return interval(TIME.TICK_DURATION)
        .pipe(
            filter(() => live.checkForFinish()),
            tap(() => console.log("NOKAUT"))
        );
}

export function getFightTimerObs(live: LiveComponent){
    return timer(TIME.TICK_DURATION * TIME.TICKS_IN_MINUTE * RULES.ROUND_DURATION_IN_MINUTES[live.fight.rules] * RULES.NUMBER_OF_ROUNDS[live.fight.rules])
        .pipe(
            tap(() => console.log("GOTOV TIMER")),
        );
}

export function getFightEndObs(live: LiveComponent){
    const fightTimer$ = getFightTimerObs(live);
    const checkForFinish$ = getCheckForFinishObs(live);

    return race(fightTimer$, checkForFinish$)
        .pipe();
}

export function getFightCardLiveObs(live: LiveComponent, fightCard: FightCard, endOfFight$: Subject<[FightStats, Scorecard[], number, number]>){
    return range(0 ,fightCard.fights.length)
                .pipe(
                    concatMap((indexOfFight: number) => {
                        let fight = fightCard.fights[indexOfFight];
                        return getFightLiveObs(live, fight, indexOfFight, endOfFight$);
                    }),
            );
}

export function getFightLiveObs(live: LiveComponent, fight: Fight, indexOfFight: number, endOfFight$: Subject<[FightStats, Scorecard[], number, number]>){
    live.setFight(fight);
    return zip(getFightTickObs(live), getFightEventObs(live))
        .pipe(
            map(([time, fightEvent]: [{}, FightEvent]) => {
                //console.log("Fight event unutar obs-a", fightEvent)
                return [time, fightEvent]
            }),
            takeUntil(getFightEndObs(live)),
            finalize(() => {
                if(!live.checkForFinish())
                    live.getWinnerOfRound();
                endOfFight$.next([live.fightStats, live.scorecards, indexOfFight , live.round]);
            }),
        )
}

export function getStartFightsObs(picker: PickerComponent, live: LiveComponent, endOfFight$: Subject<[FightStats, Scorecard[], number, number]>, endOfFightCard$: Subject<FightCard>){
    let addFightClick$ = getAddFightObs(picker);
    return fromEvent(picker.getElement(CLASS_NAMES.BUTTONS.START_FIGHTS), "click")
        .pipe(
            withLatestFrom(addFightClick$),
            map(([_, fightCard]: [Event, FightCard]) => fightCard),
            switchMap((fightCard) => getFightCardLiveObs(live, fightCard, endOfFight$)),
    );
}