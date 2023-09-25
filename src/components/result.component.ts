import roundToNearestMinutes from "date-fns/roundToNearestMinutes";
import { Corner } from "../enums/corner.enum";
import { FightEventType } from "../enums/fight-event-type.enum";
import { Method } from "../enums/method.enum";
import { Fight } from "../models/fight";
import { FightCard } from "../models/fightCard";
import { FightStats, Scorecard } from "../models/fightStats";
import { Opponent } from "../models/opponent";
import { Result } from "../models/result";
import { CLASS_NAMES, IMAGES, INDEXES, PATHS, POINTS } from "../utilities/constants";
import { appendItemToList, clearElement, hideElement, selectElementByClass, selectElementsByClass, showElement } from "../utilities/helpers";
import { Component } from "./component";

export class ResultComponent extends Component{
    fightCard: FightCard;
    opponent: Opponent;
    yourTotalPoints: number = POINTS.INITIAL;
    opponentTotalPoints: number = POINTS.INITIAL;

    constructor(fightCard: FightCard){
        super();
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.RESULT);
        this.fightCard = fightCard;
        this.hidePlayAgain();
    }

    addResult(finalResult: Result, fightIndex: number){
        let resultItem: HTMLElement; 
        let resultFightDiv: HTMLElement;
        let resultPickDiv: HTMLElement;

        let fight: Fight = this.fightCard.fights[fightIndex]
        fight.finalResult = finalResult;
        resultItem = appendItemToList(this.container, fightIndex, CLASS_NAMES.ITEMS.RESULT, CLASS_NAMES.LISTS.RESULT, CLASS_NAMES.TEMPLATES.RESULT);
        resultFightDiv = selectElementByClass(resultItem, CLASS_NAMES.DIVS.RESULT_FIGHT);
        this.renderFightInformation(resultFightDiv, fight);
        resultPickDiv = selectElementByClass(resultItem, CLASS_NAMES.DIVS.RESULT_PICK);
        
        fight.opponentPick = this.opponent.getPick(finalResult, fight.rules);
        this.addPointsFromFight(resultPickDiv, fight);
    }
    
    addPointsFromFight(resultPickDiv: HTMLElement, fight: Fight) {
        let yourPointsByHits = this.getPointsByHits(fight.finalResult, fight.yourPick);
        let opponentPointsByHits = this.getPointsByHits(fight.finalResult, fight.opponentPick);
        this.renderPicks(resultPickDiv, fight.yourPick, fight.opponentPick, yourPointsByHits, opponentPointsByHits);

        fight.yourPoints = yourPointsByHits.reduce((prev, curr) => prev + curr, 0);
        fight.opponentPoints = opponentPointsByHits.reduce((prev, curr) => prev + curr, 0);
        this.yourTotalPoints += fight.yourPoints;
        this.opponentTotalPoints += fight.opponentPoints;
        this.renderTotalPoints(this.yourTotalPoints, this.opponentTotalPoints);
    }

    setOpponent(opponent: Opponent) {
        this.opponent = new Opponent(opponent.id, opponent. name, opponent.difficulty, opponent.pictureSrc);
    }

    getOpponentPoints(): number {
        return this.opponentTotalPoints;
    }
    
    getYourPoints(): number {
        return this.yourTotalPoints;
    }

    getResultFromFinish(fightStats: FightStats, currentRound: number): Result{
        let result: Result = null;

        if(fightStats.redCorner.damage >= 100){
            result = {
                winner: Corner.Blue,
                method: fightStats.blueCorner.lastEvent.type === FightEventType.SubmissionAttempt ? Method.Submission : Method.KO_TKO,
                round: currentRound,
            }
        }
        else if(fightStats.blueCorner.damage >= 100){
            result = {
                winner: Corner.Red,
                method: fightStats.redCorner.lastEvent.type === FightEventType.SubmissionAttempt ? Method.Submission : Method.KO_TKO,
                round: currentRound,
            }
        }

        return result;
    }

    getResultFromScorecards(scorecards: Scorecard[]): Result{
        let result: Result;
        let redCornerPoints: number = 0;
        let blueCornerPoints: number = 0;

        scorecards.forEach((scorecard, index) => {
            if(index !== 0){
                redCornerPoints += scorecard.redCorner.roundPoints;
                blueCornerPoints += scorecard.blueCorner.roundPoints;
            }
        });
        result = {
            method: Method.Decision,
            winner: redCornerPoints > blueCornerPoints ? Corner.Red : Corner.Blue,
            round: 0,
        }
        return result;
    }

    getPointsByHits(finalResult: Result, pick: Result) {
        let points: number[] = [0,0,0];
        if(finalResult.winner === pick.winner){
            points[0] = 10;
            if(finalResult.method === pick.method)
                points[1] = 5;
            if((finalResult.method !== Method.Decision) && (finalResult.round === pick.round))
                points[2] = 5;
        }          
        return points;
    }

    resetResultList(){
        this.hidePlayAgain();
        this.resetTotalPoints();
        clearElement(this.container, CLASS_NAMES.LISTS.RESULT, CLASS_NAMES.ITEMS.RESULT);
    }

    resetTotalPoints() {
        this.yourTotalPoints = POINTS.INITIAL;
        this.opponentTotalPoints = POINTS.INITIAL;
        this.renderTotalPoints(this.yourTotalPoints, this.opponentTotalPoints);
    }

    renderTotalPoints(yourPoints: number, opponentPoints: number) {
        let yourFightCardPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_FIGHCARD_POINTS);
        let opponentFightCardPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.OPPONENT_FIGHCARD_POINTS);
        yourFightCardPointsLabel.innerHTML = yourPoints.toString();
        opponentFightCardPointsLabel.innerHTML = opponentPoints.toString();
    }

    private renderPicks(resultPickDiv: HTMLElement, yourPick: Result, opponentPick: Result, yourPoints: number[], opponentPoints: number[]) {
        let winnerLabels = selectElementsByClass(resultPickDiv, CLASS_NAMES.LABELS.WINNER);
        let methodLabels = selectElementsByClass(resultPickDiv, CLASS_NAMES.LABELS.METHOD);
        let roundLabels = selectElementsByClass(resultPickDiv, CLASS_NAMES.LABELS.ROUND);

        let yourWinnerPointsLabel = selectElementByClass(resultPickDiv, CLASS_NAMES.LABELS.YOUR_WINNER_POINTS);
        let oppWinnerPointsLabel = selectElementByClass(resultPickDiv, CLASS_NAMES.LABELS.OPPONENT_WINNER_POINTS);
        let yourMethodPointsLabel = selectElementByClass(resultPickDiv, CLASS_NAMES.LABELS.YOUR_METHOD_POINTS);
        let oppMethodPointsLabel = selectElementByClass(resultPickDiv, CLASS_NAMES.LABELS.OPPONENT_METHOD_POINTS);
        let yourRoundPointsLabel = selectElementByClass(resultPickDiv, CLASS_NAMES.LABELS.YOUR_ROUND_POINTS);
        let oppRoundPointsLabel = selectElementByClass(resultPickDiv, CLASS_NAMES.LABELS.OPPONENT_ROUND_POINTS);
        let totalPointsLabels = selectElementsByClass(resultPickDiv, CLASS_NAMES.LABELS.TOTAL_POINTS);

        winnerLabels[INDEXES.PLAYERS.YOUR].innerHTML = yourPick.winner;
        winnerLabels[INDEXES.PLAYERS.OPPONENT].innerHTML = opponentPick.winner;
        this.fillPointsFromHits(yourPoints[INDEXES.HITS.WINNER], yourWinnerPointsLabel, winnerLabels[INDEXES.PLAYERS.YOUR]);
        this.fillPointsFromHits(opponentPoints[INDEXES.HITS.WINNER], oppWinnerPointsLabel, winnerLabels[INDEXES.PLAYERS.OPPONENT]);
        methodLabels[INDEXES.PLAYERS.YOUR].innerHTML = yourPick.method;
        methodLabels[INDEXES.PLAYERS.OPPONENT].innerHTML = opponentPick.method;
        this.fillPointsFromHits(yourPoints[INDEXES.HITS.METHOD], yourMethodPointsLabel, methodLabels[INDEXES.PLAYERS.YOUR]);
        this.fillPointsFromHits(opponentPoints[INDEXES.HITS.METHOD], oppMethodPointsLabel, methodLabels[INDEXES.PLAYERS.OPPONENT]);
        if(yourPick.method === Method.Decision){
            roundLabels[INDEXES.PLAYERS.YOUR].innerHTML = ` `;
            hideElement(yourRoundPointsLabel);
        }
        else{
            roundLabels[INDEXES.PLAYERS.YOUR].innerHTML = yourPick.round.toString();
            this.fillPointsFromHits(yourPoints[INDEXES.HITS.ROUND], yourRoundPointsLabel, roundLabels[INDEXES.PLAYERS.YOUR]);
        }
        if(opponentPick.method === Method.Decision){
            roundLabels[INDEXES.PLAYERS.OPPONENT].innerHTML = ` `;
            hideElement(oppRoundPointsLabel);
        }
        else{
            roundLabels[INDEXES.PLAYERS.OPPONENT].innerHTML = opponentPick.round.toString();
            this.fillPointsFromHits(opponentPoints[INDEXES.HITS.ROUND], oppRoundPointsLabel, roundLabels[INDEXES.PLAYERS.OPPONENT]);
        }

        let yourTotalPoints = yourPoints.reduce((prev, curr) => prev + curr ,0);
        let opponentTotalPoints = opponentPoints.reduce((prev, curr) => prev + curr ,0);
        totalPointsLabels[INDEXES.PLAYERS.YOUR].innerHTML = `${yourTotalPoints}`;
        totalPointsLabels[INDEXES.PLAYERS.OPPONENT].innerHTML = `${opponentTotalPoints}`;
    }

    private fillPointsFromHits(points: number, pointsLabel: HTMLElement, textLabel: HTMLElement) {
        if (points !== 0) {
            pointsLabel.innerHTML = `+${points} `;
            pointsLabel.classList.add(CLASS_NAMES.ICONS.CHECK_SQUARE);
            pointsLabel.classList.add(CLASS_NAMES.STYLES.GREEN_TEXT);
            textLabel.classList.add(CLASS_NAMES.STYLES.GREEN_TEXT);
        }
        else {
            pointsLabel.innerHTML = ` ${points} `;
            pointsLabel.classList.add(CLASS_NAMES.ICONS.X_SQUARE);
            pointsLabel.classList.add(CLASS_NAMES.STYLES.RED_TEXT);
            textLabel.classList.add(CLASS_NAMES.STYLES.RED_TEXT);
        }
    }

    private renderFightInformation(fightItem: HTMLElement, fight: Fight) {
        let rulesLabel = selectElementByClass(fightItem, CLASS_NAMES.LABELS.RULES);
        let weightclassLabel = selectElementByClass(fightItem, CLASS_NAMES.LABELS.WEIGHTCLASS);
        let redCornerImg = selectElementByClass(fightItem, CLASS_NAMES.IMAGES.RED_CORNER) as HTMLImageElement;
        let blueCornerImg = selectElementByClass(fightItem, CLASS_NAMES.IMAGES.BLUE_CORNER) as HTMLImageElement;
        let redCornerLabel = selectElementByClass(fightItem, CLASS_NAMES.LABELS.RED_CORNER);
        let blueCornerLabel = selectElementByClass(fightItem, CLASS_NAMES.LABELS.BLUE_CORNER);
        let redCornerOddLabel = selectElementByClass(fightItem, CLASS_NAMES.LABELS.RED_CORNER_ODD);
        let blueCornerOddLabel = selectElementByClass(fightItem, CLASS_NAMES.LABELS.BLUE_CORNER_ODD);

        let winnerList: HTMLElement;
        if(fight.finalResult.winner === Corner.Red)
            winnerList = selectElementByClass(fightItem, CLASS_NAMES.LISTS.RED_CORNER_WINNER);
        else
            winnerList = selectElementByClass(fightItem, CLASS_NAMES.LISTS.BLUE_CORNER_WINNER);
        let winnerImg = selectElementByClass(winnerList, CLASS_NAMES.IMAGES.WINNER) as HTMLImageElement;
        let methodImg = selectElementByClass(winnerList, CLASS_NAMES.IMAGES.METHOD) as HTMLImageElement;
        let roundImg = selectElementByClass(winnerList, CLASS_NAMES.IMAGES.ROUND) as HTMLImageElement;
        let methodLabel = selectElementByClass(winnerList, CLASS_NAMES.LABELS.METHOD);
        let roundLabel = selectElementByClass(winnerList, CLASS_NAMES.LABELS.ROUND);
        let roundDiv = selectElementByClass(winnerList, CLASS_NAMES.DIVS.ROUND);

        rulesLabel.innerHTML = fight.rules;
        weightclassLabel.innerHTML = fight.redCorner.weightclass;
        redCornerImg.src = `${PATHS.IMAGES.FIGHTERS + fight.redCorner.pictureSrc}`;
        blueCornerImg.src = `${PATHS.IMAGES.FIGHTERS + fight.blueCorner.pictureSrc}`;
        redCornerLabel.innerHTML = fight.redCorner.name;
        blueCornerLabel.innerHTML = fight.blueCorner.name;
        if (fight.favourite === Corner.Red) {
            redCornerOddLabel.innerHTML = "Favourite";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            blueCornerOddLabel.innerHTML = "Underdog";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        else {
            blueCornerOddLabel.innerHTML = "Favourite";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            redCornerOddLabel.innerHTML = "Underdog";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }

        showElement(winnerList);
        winnerImg.src = `${PATHS.IMAGES.ICONS + IMAGES.WINNER}`
        switch(fight.finalResult.method){
            case Method.Decision:
                methodImg.src = `${PATHS.IMAGES.ICONS + IMAGES.DECISION}`
                hideElement(roundDiv);
                break;
            case Method.KO_TKO:
                methodImg.src = `${PATHS.IMAGES.ICONS + IMAGES.KO}`
                break;
            case Method.Submission:
                methodImg.src = `${PATHS.IMAGES.ICONS + IMAGES.SUBMISSION}`
                break;
        }
        methodLabel.innerText = fight.finalResult.method;
        roundImg.src = `${PATHS.IMAGES.ICONS + IMAGES.ROUND}`
        roundLabel.innerText = fight.finalResult.round.toString();
    }

    hidePlayAgain() {
        let playAgainButton = selectElementByClass(this.container, CLASS_NAMES.BUTTONS.PLAY_AGAIN);
        hideElement(playAgainButton);
    }

    showPlayAgain() {
        let playAgainButton = selectElementByClass(this.container, CLASS_NAMES.BUTTONS.PLAY_AGAIN);
        showElement(playAgainButton);
    }
}


