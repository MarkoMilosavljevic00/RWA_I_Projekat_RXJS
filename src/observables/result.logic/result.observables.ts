import { filter, interval, map, Subject, tap } from "rxjs";
import { FightStats, Scorecard } from "../../models/fightStats";

export function getEndOfFightObs(): Subject<[FightStats, Scorecard[], number, number]> {
    return new Subject<[FightStats, Scorecard[], number, number]>();
}

export function getEndOfFightCardObs(): Subject<boolean> {
    return new Subject<boolean>();
}
