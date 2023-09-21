import { map, Subject } from "rxjs";
import { ResultComponent } from "../../components/result.component";
import { Fight } from "../../models/fight";
import { FightStats, Scorecard } from "../../models/fightStats";
import { Result } from "../../models/result";

export function getResultObs(resultComponent: ResultComponent): Subject<[FightStats, Scorecard[], number, number]>{
    return new Subject<[FightStats, Scorecard[], number, number]>();
}