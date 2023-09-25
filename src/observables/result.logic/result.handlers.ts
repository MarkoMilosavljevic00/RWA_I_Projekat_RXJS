import { Subject } from "rxjs";
import { AppComponent } from "../../components/app.component";
import { LiveComponent } from "../../components/live.component";
import { ResultComponent } from "../../components/result.component";
import { Corner, mapCornerToKey } from "../../enums/corner.enum";
import { FightEventType } from "../../enums/fight-event-type.enum";
import { Method } from "../../enums/method.enum";
import { Fight } from "../../models/fight";
import { FightStats, Scorecard } from "../../models/fightStats";
import { Opponent } from "../../models/opponent";
import { Result } from "../../models/result";
import { showDefeat, showDraw, showVictory } from "../../utilities/helpers";
import { getFightCardIsOverObs, getResultObs } from "./result.observables";

export function getResultsHandler(result: ResultComponent){
    let endOfFight$ = getResultObs();
    endOfFight$.subscribe(([fightStats, scorecards, indexOfFight, currentRound]: [FightStats, Scorecard[], number, number]) => {
        let finalResult: Result;
        finalResult = result.getResultFromFinish(fightStats, currentRound);
        if(!finalResult)
            finalResult = result.getResultFromScorecards(scorecards);
            
        result.addResult(finalResult, indexOfFight);
        
    });

    return endOfFight$;
}

export function fightCardIsOverHandler(result: ResultComponent, app: AppComponent){
    let endOfFightCard$ = getFightCardIsOverObs();

    endOfFightCard$.subscribe(() => {
        console.log(result.getYourPoints(), result.getOpponentPoints());
        let yourPoints = result.getYourPoints();
        let opponentPoints = result.getOpponentPoints();

        if(yourPoints > opponentPoints)
            showVictory();
        else if(yourPoints < opponentPoints)
            showDefeat();
        else
            showDraw();

        app.addToYourPoints(yourPoints);
        app.addToOpponentPoints(opponentPoints);
        result.showPlayAgain();
    });

    return endOfFightCard$;
}

