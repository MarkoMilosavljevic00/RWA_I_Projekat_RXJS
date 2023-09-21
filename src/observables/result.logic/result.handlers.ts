import { Subject } from "rxjs";
import { ResultComponent } from "../../components/result.component";
import { Corner, mapCornerToKey } from "../../enums/corner.enum";
import { FightEventType } from "../../enums/fight-event-type.enum";
import { Method } from "../../enums/method.enum";
import { Fight } from "../../models/fight";
import { FightStats, Scorecard } from "../../models/fightStats";
import { Opponent } from "../../models/opponent";
import { Result } from "../../models/result";
import { getResultObs } from "./result.observables";

export function getResultsHandler(result: ResultComponent, opponent: Opponent){
    let endOfFight$ = getResultObs(result);

    endOfFight$.subscribe(([fightStats, scorecards, indexOfFight, currentRound]: [FightStats, Scorecard[], number, number]) => {
        let finalResult: Result;
        finalResult = result.getResultFromFinish(fightStats, currentRound);
        if(!finalResult)
            finalResult = result.getResultFromScorecards(scorecards);

        result.addResult(finalResult, indexOfFight, opponent);
    });

    return endOfFight$;
}

