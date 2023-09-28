import { AppComponent } from "../../components/app.component";
import { ResultComponent } from "../../components/result.component";
import { FightStats, Scorecard } from "../../models/fightStats";
import { Result } from "../../models/result";
import { CLASS_NAMES } from "../../utilities/constants";
import { showDefeat, showDraw, showVictory } from "../../utilities/helpers";
import { getEndOfFightCardObs, getEndOfFightObs } from "./result.observables";

export function getResultsHandler(result: ResultComponent) {
    let endOfFight$ = getEndOfFightObs();
    endOfFight$.subscribe(
        ([fightStats, scorecards, indexOfFight, currentRound]: [
            FightStats,
            Scorecard[],
            number,
            number
        ]) => {
            let finalResult: Result;
            finalResult = result.getResultFromFinish(fightStats, currentRound);
            if (!finalResult) 
                finalResult = result.getResultFromScorecards(scorecards);
            result.addResult(finalResult, indexOfFight);
        }
    );
    return endOfFight$;
}

export function endOfFightcardHandler(result: ResultComponent, app: AppComponent) {
    let endOfFightcard$ = getEndOfFightCardObs();
    endOfFightcard$.subscribe(() => {
        let yourPoints = result.getYourPoints();
        let opponentPoints = result.getOpponentPoints();

        if (yourPoints > opponentPoints)
            showVictory();
        else if (yourPoints < opponentPoints) 
            showDefeat();
        else 
            showDraw();

        app.addToYourPoints(yourPoints);
        app.addToOpponentPoints(opponentPoints);
        result.showElement(CLASS_NAMES.BUTTONS.PLAY_AGAIN);
    });
    return endOfFightcard$;
}
