import { concatMap, fromEvent, interval, map, Observable, range, switchMap, withLatestFrom, zip, takeUntil, filter, timer, race, mapTo, tap, Subject, take, finalize } from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { ResultComponent } from "../../components/result.component";
import { mapCornerToKey } from "../../enums/corner.enum";
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

export function getFightTickObs(): Observable<number>{
    return interval(TIME.SECOND_DURATION);
}

export function getFightEventObs(live: LiveComponent): Observable<FightEvent | null>{
    return interval(TIME.EVENT_FREQ)
        .pipe(
            map(() => 
                Math.random() < PROBABILITY.EVENT_HAPPEN 
                ? live.generateEvent() // razmisli da li ce biti deo live-a ili ovde direktno logika za generisanje
                : null
            ),
        )
}

export function getCheckForFinishObs(live: LiveComponent){
    return getFightEventObs(live)
        .pipe(
            filter((fightEvent: FightEvent) =>
                fightEvent && (
                live.fightStats[mapCornerToKey(fightEvent.attacker)].damage >= DAMAGE.MAX || 
                live.fightStats[mapCornerToKey(fightEvent.defender)].damage >= DAMAGE.MAX // proveriti da li ovde treba +
                )
            ),
            tap(() => console.log("NOKAUT"))
        );
}

export function getFightTimerObs(live: LiveComponent){
    return timer(TIME.SECOND_DURATION * TIME.SECONDS_IN_MINUTE * mapRulesToRoundDuration(live.fight.rules) * mapRulesToNumberOfRounds(live.fight.rules))
        .pipe(
            tap(() => console.log("GOTOV TIMER")),
        );
}

export function getResultsObs(){
    return new Subject<string>()
}

export function getFightEndObs(live: LiveComponent){
    const fightTimer$ = getFightTimerObs(live);
    const checkForFinish$ = getCheckForFinishObs(live);
    const fightEndOb$ = getResultsObs();

    return race(fightTimer$, checkForFinish$)
        .pipe();
}

export function getFightLiveObs(live: LiveComponent){
    const fightTick$ = getFightTickObs();
    const fightEvent$ = getFightEventObs(live);
    const fightEnd$ = getFightEndObs(live);
    

    return zip(fightTick$, fightEvent$)
        .pipe(
            takeUntil(fightEnd$),
        );
}

export function getStartFightsObs(picker: PickerComponent, live: LiveComponent, endOfFight$: Subject<[FightStats, Scorecard[], number, number]>, endOfFightCard$: Subject<FightCard>){
    let addFightClick$ = getAddFightObs(picker);
    return fromEvent(picker.getElement(CLASS_NAMES.BUTTONS.START_FIGHTS), "click")
        .pipe(
            withLatestFrom(addFightClick$),
            map(([_, fightCard]: [Event, FightCard]) => fightCard),
            switchMap((fightCard) => range(0 ,fightCard.fights.length)
                .pipe(
                    concatMap((numberOfFight: number) => {
                        console.log(numberOfFight);
                        live.setFight(fightCard.fights[numberOfFight]);
                        return zip(getFightTickObs(), getFightEventObs(live))
                            .pipe(
                                map(([_, fightEvent]: [number, FightEvent]) => [fightEvent,fightCard.fights[numberOfFight].rules]),
                                takeUntil(getFightEndObs(live)),
                                finalize(() => {
                                    endOfFight$.next([live.fightStats, live.scorecards, numberOfFight , live.round]);
                                }),
                            )
                    }),
                    finalize(() => {
                        endOfFightCard$.next(fightCard);
                    }
            )),
        )
    );
}