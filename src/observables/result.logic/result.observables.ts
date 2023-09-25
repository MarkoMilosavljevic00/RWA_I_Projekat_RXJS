import { filter, interval, map, Subject, tap } from "rxjs";
import { ResultComponent } from "../../components/result.component";
import { Fight } from "../../models/fight";
import { FightStats, Scorecard } from "../../models/fightStats";
import { Result } from "../../models/result";
import { TIME } from "../../utilities/constants";

export function getResultObs(): Subject<[FightStats, Scorecard[], number, number]>{
    return new Subject<[FightStats, Scorecard[], number, number]>();
}

export function getFightCardIsOverObs(): Subject<boolean>{
    return new Subject<boolean>();
}