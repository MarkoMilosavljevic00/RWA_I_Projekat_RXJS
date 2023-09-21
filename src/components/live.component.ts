import { Corner, CornerKey, mapCornerToKey } from "../enums/corner.enum";
import { FightEventType, PunchType, TakedownType } from "../enums/fight-event-type.enum";
import { Method } from "../enums/method.enum";
import { Position } from "../enums/position.enum";
import { mapRulesToNumberOfRounds } from "../enums/rules.enum";
import { Fight } from "../models/fight";
import { Fighter } from "../models/fighter";
import { FightEvent } from "../models/fightEvent";
import { FightStats, Scorecard } from "../models/fightStats";
import { Result } from "../models/result";
import {  CLASS_NAMES, DAMAGE, IMAGES, INDEXES, PATHS, POINTS, TIME } from "../utilities/constants";
import { fillProgressBars, getPercentageStrings, selectElementByClass, selectElementsByClass } from "../utilities/helpers";
import { Component } from "./component";

export class LiveComponent extends Component{
    fight: Fight;
    position: Position;
    round: number;
    secondsElapsed: number;
    fightStats: FightStats;
    scorecards: Scorecard[];

    get minutes(): string{
        return Math.floor(this.secondsElapsed / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    }

    get seconds(): string{
        return (this.secondsElapsed % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    }
    
    constructor(){
        super();
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.LIVE);
        this.resetRounds();
        this.resetTime();
    }

    getScorecards(): Scorecard[] {
        return this.scorecards;
    }

    setFight(fight: Fight){
        let numberOfRounds = mapRulesToNumberOfRounds(fight.rules);

        this.fight = fight;
        this.setFighters(fight.redCorner, fight.blueCorner);
        this.resetTime();
        this.resetRounds();
        this.resetFightStats(numberOfRounds);
        this.position = Position.Standup;

        let rulesLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.RULES);
        rulesLabel.innerHTML = fight.rules;
        let weightclassLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.WEIGHTCLASS);
        weightclassLabel.innerHTML = fight.redCorner.weightclass;

        let liveListDiv = selectElementByClass(this.container, CLASS_NAMES.LISTS.LIVE); 
        for(let roundIndex = 1; roundIndex <= numberOfRounds; roundIndex++){
            let roundTempDiv = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.LIVE.ROUND);
            let roundDiv = roundTempDiv.cloneNode(true) as HTMLElement;
            roundDiv.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
            roundDiv.classList.remove(CLASS_NAMES.TEMPLATES.LIVE.ROUND);
            let roundHeader = roundDiv.children[0] as HTMLElement;
            let roundBody = roundDiv.children[1] as HTMLElement;
            roundHeader.innerHTML = `${roundIndex.toString()}. Round`;
            roundBody.classList.add(`${CLASS_NAMES.ITEMS.ROUND + roundIndex}`);
            liveListDiv.appendChild(roundDiv);
        }
    }

    setFighters(redCorner: Fighter, blueCorner: Fighter) {
        let redCornerImg: HTMLImageElement;
        let redCornerNameLabel: HTMLLabelElement; 
        let blueCornerImg: HTMLImageElement;
        let blueCornerWinnerLabel: HTMLLabelElement; 

        redCornerImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.RED_CORNER) as HTMLImageElement;
        redCornerNameLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.RED_CORNER) as HTMLLabelElement;
        blueCornerImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.BLUE_CORNER) as HTMLImageElement;
        blueCornerWinnerLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.BLUE_CORNER) as HTMLLabelElement;

        redCornerImg.src =`${PATHS.IMAGES.FIGHTERS + redCorner.pictureSrc}` ;
        redCornerNameLabel.innerHTML = redCorner.name;
        blueCornerImg.src =`${PATHS.IMAGES.FIGHTERS + blueCorner.pictureSrc}` ;
        blueCornerWinnerLabel.innerHTML = blueCorner.name;

        fillProgressBars(this.container, CLASS_NAMES.PROGRESS_BARS.RED_CORNER_SKILLS, redCorner.striking, redCorner.grappling, redCorner.overall);
        fillProgressBars(this.container, CLASS_NAMES.PROGRESS_BARS.BLUE_CORNER_SKILLS, blueCorner.striking, blueCorner.grappling, blueCorner.overall);
    }

    addFightEvent(event: FightEvent, round: number = this.round){
        let attackerKey = mapCornerToKey(event.attacker);
        let defenderKey = mapCornerToKey(event.defender);

        this.fightStats[attackerKey].lastEvent = event;
        
        this.fightStats[defenderKey].damage += event.damage;
        if(this.fightStats[defenderKey].damage >= 100)
            this.fightStats[defenderKey].damage = 100;
        this.fightStats[attackerKey].damage += event.energySpent;
        if(this.fightStats[attackerKey].damage >= 100)
        this.fightStats[attackerKey].damage = 100;
        this.renderDamage();

        this.scorecards[round][attackerKey].damage += event.energySpent;
        if(this.scorecards[round][attackerKey].damage >= 100)
            this.scorecards[round][attackerKey].damage = 100;
        this.scorecards[round][defenderKey].damage += event.damage;
        if(this.scorecards[round][defenderKey].damage >= 100)
            this.scorecards[round][defenderKey].damage = 100;

        this.renderEvent(event, round);
        switch (event.eventType) {
            case FightEventType.Punch:
            case FightEventType.Kick:
                this.fightStats[attackerKey].significantStrikes++;
                this.scorecards[round][attackerKey].significantStrikes++;
                this.renderSignificantStrikes();
                break;
            case FightEventType.Takedown:
                this.fightStats[attackerKey].takedowns++;
                this.scorecards[round][attackerKey].takedowns++;
                this.changePosition(Position.Ground);
                this.renderTakedowns();
                break;
            case FightEventType.SubmissionAttempt:
                this.fightStats[attackerKey].submissionAttempts++;
                this.scorecards[round][attackerKey].submissionAttempts++;
                this.renderSubmissionAttempts();
                break;
            case FightEventType.GettingUp:
                this.changePosition(Position.Standup);
                break;
        }
    }

    changePosition(position?: Position, round: number = this.round){
        if(position){
           this.position = position 
        }
        else{
            this.position = this.position === Position.Standup ? Position.Ground : Position.Standup;
        }
        this.renderPosition(round);
    }

    generateEvent(): FightEvent {
        if(Math.random() < 0.5)
            return {
                attacker: Corner.RedCorner,
                defender: Corner.BlueCorner,
                damage: 5,
                energySpent: 1,
                eventType: FightEventType.Takedown,
                eventSubType: TakedownType.Suplex
            }
        else
            return {
                attacker: Corner.BlueCorner,
                defender: Corner.RedCorner,
                damage: 5,
                energySpent: 1,
                eventType: FightEventType.GettingUp,
            }
    }

    checkForFinish(fightEvent: FightEvent): Result {
        let result: Result;
        let keyAttacker = mapCornerToKey(fightEvent.attacker);
        let keyDefender = mapCornerToKey(fightEvent.defender);

        if(this.fightStats[keyAttacker].damage + fightEvent.energySpent >= DAMAGE.MAX)
            result.winner = fightEvent.defender;
        else if(this.fightStats[keyDefender].damage + fightEvent.damage >= DAMAGE.MAX)
            result.winner = fightEvent.attacker;
        else
            return null;

        switch(fightEvent.eventType){
            case FightEventType.SubmissionAttempt:
            result.method = Method.Submission;
                break;
            default:
            result.method = Method.KO_TKO;
                break;
        }

        result.round = this.round;

        return result;
    }

    getWinnerOfRound(round: number = this.round){
        let redCornerDamage: number;
        let blueCornerDamage: number;
        let redCornerSignificantStrikes: number;
        let blueCornerSignificantStrikes: number;
        let redCornerSubmissionAttempts: number;
        let blueCornerSubmissionAttempts: number;
        let redCornerTakedowns: number;
        let blueCornerTakedowns: number;

        redCornerDamage = this.scorecards[round].redCorner.damage;
        blueCornerDamage = this.scorecards[round].blueCorner.damage;
        redCornerSignificantStrikes = this.scorecards[round].redCorner.significantStrikes;
        blueCornerSignificantStrikes = this.scorecards[round].blueCorner.significantStrikes;
        redCornerSubmissionAttempts = this.scorecards[round].redCorner.submissionAttempts;
        blueCornerSubmissionAttempts = this.scorecards[round].blueCorner.submissionAttempts;
        redCornerTakedowns = this.scorecards[round].redCorner.takedowns;
        blueCornerTakedowns = this.scorecards[round].blueCorner.takedowns;

        if(redCornerDamage < blueCornerDamage){
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            if(blueCornerDamage > 20 && redCornerDamage < 2*blueCornerDamage)
                this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.CONVICING_LOSER;
            else
                this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        }
        else if(blueCornerDamage < redCornerDamage){
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
            if(redCornerDamage > 20 && blueCornerDamage < 2*redCornerDamage)
                this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.CONVICING_LOSER;
            else
                this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
        }
        else if(redCornerSignificantStrikes > blueCornerSignificantStrikes){
                this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
                this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        }
        else if(redCornerSignificantStrikes < blueCornerSignificantStrikes){
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
        }
        else if(redCornerSubmissionAttempts > blueCornerSubmissionAttempts){
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        }
        else if(redCornerSubmissionAttempts < blueCornerSubmissionAttempts){
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
        }
        else if(redCornerTakedowns > blueCornerTakedowns){
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        }
        else if(redCornerTakedowns < blueCornerTakedowns){
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
        }
        this.renderWinner(Method.Decision, round)
    }

    resetFightStats(numberOfRounds: number) {
        this.fightStats = {
            redCorner: {
                damage: 0,
                significantStrikes: 0,
                submissionAttempts: 0,
                takedowns: 0,
            },
            blueCorner: {
                damage: 0,
                significantStrikes: 0,
                submissionAttempts: 0,
                takedowns: 0,
            }
        };
        this.renderFightStats();

        this.scorecards = [];
        this.scorecards.push(null);
        for(let i=0; i < numberOfRounds; i++){
            let round = {
                redCorner: {
                    damage: 0,
                    significantStrikes: 0,
                    submissionAttempts: 0,
                    takedowns: 0,
                },
                blueCorner: {
                    damage: 0,
                    significantStrikes: 0,
                    submissionAttempts: 0,
                    takedowns: 0,
                }
            };
            this.scorecards.push(round);
        }
    }

    resetRounds() {
        this.round = 1;
        this.renderRound();
    }

    resetTime() {
        this.secondsElapsed = 0;
        this.renderTime();
    }

    addSecond(seconds: number = 1){
        this.secondsElapsed += seconds;
        this.renderTime();
    }
    
    addRound(){
        this.round++;
        this.renderRound();
        this.resetTime();
    }

    renderWinner(method: Method, round: number = this.round) {
        let roundItem: HTMLElement;
        let winnerItemTemplate: HTMLElement;
        let winnerItem: HTMLElement;
        let winnerLabel: HTMLElement
        let winnerInfo: HTMLElement;

        roundItem = selectElementByClass(this.container, CLASS_NAMES.ITEMS.ROUND + round);
        winnerItemTemplate = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.LIVE.INFO_ROUND_WINNER_EVENT);
        winnerItem = winnerItemTemplate.cloneNode(true) as HTMLElement;
        winnerLabel = selectElementByClass(winnerItem, CLASS_NAMES.LABELS.WINNER);
        winnerInfo = selectElementByClass(winnerItem, CLASS_NAMES.LABELS.WIN_INFO_LABEL);

        if(this.scorecards[round].redCorner.roundPoints > this.scorecards[round].blueCorner.roundPoints){
            winnerLabel.innerHTML = Corner.RedCorner;
            winnerLabel.classList.add(CLASS_NAMES.STYLES.RED_TEXT);
        }
        else{
            winnerLabel.innerHTML = Corner.BlueCorner;
            winnerLabel.classList.add(CLASS_NAMES.STYLES.BLUE_TEXT);
        }
        switch (method) {
            case Method.Decision:
                winnerInfo.innerHTML = `${this.scorecards[round].redCorner.roundPoints} - ${this.scorecards[round].blueCorner.roundPoints}`;       
                break;
            case Method.KO_TKO:
                winnerInfo.innerHTML = Method.KO_TKO;       
                break;
            case Method.Submission:
                winnerInfo.innerHTML = Method.Submission;       
                break;
        }
        winnerItem.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        roundItem.appendChild(winnerItem);
    }

    private renderEvent(event: FightEvent, round: number = this.round) {
        let roundItem: HTMLElement;
        let eventItemTemplate: HTMLElement;
        let eventItem: HTMLElement;
        let eventTimeLabel: HTMLElement;
        let eventDamageLabel: HTMLElement;
        let eventEnergyLabel: HTMLElement;
        let eventTypeLabel: HTMLElement;
        let eventSubtypeLabel: HTMLElement;
        let eventImg: HTMLImageElement;

        roundItem = selectElementByClass(this.container, CLASS_NAMES.ITEMS.ROUND + round);
        if(event.attacker === Corner.RedCorner)
            eventItemTemplate = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.LIVE.RED_CORNER_EVENT);
        else
            eventItemTemplate = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.LIVE.BLUE_CORNER_EVENT);
        eventItem = eventItemTemplate.cloneNode(true) as HTMLElement;
        eventTimeLabel = selectElementByClass(eventItem, CLASS_NAMES.LABELS.EVENT_TIME_LABEL);
        eventDamageLabel = selectElementByClass(eventItem, CLASS_NAMES.LABELS.EVENT_DAMAGE);
        eventEnergyLabel = selectElementByClass(eventItem, CLASS_NAMES.LABELS.EVENT_ENERGY);
        eventTypeLabel = selectElementByClass(eventItem, CLASS_NAMES.LABELS.EVENT_TYPE);
        eventSubtypeLabel = selectElementByClass(eventItem, CLASS_NAMES.LABELS.EVENT_SUBTYPE);
        eventImg = selectElementByClass(eventItem, CLASS_NAMES.IMAGES.EVENT) as HTMLImageElement;
        
        eventTimeLabel.innerHTML = `${this.minutes}'${this.seconds}''`
        eventDamageLabel.innerHTML = event.damage.toString();
        eventEnergyLabel.innerHTML = event.energySpent.toString();
        eventTypeLabel.innerHTML = event.eventType;
        if(event.eventSubType)
            eventSubtypeLabel.innerHTML = `(${event.eventSubType})`;

        switch (event.eventType) {
            case FightEventType.Punch:
                eventImg.src = `${PATHS.IMAGES.ICONS + IMAGES.PUNCH}`
                break;
            case FightEventType.Kick:
                eventImg.src = `${PATHS.IMAGES.ICONS + IMAGES.KICK}`
                break;
            case FightEventType.Takedown:
                eventImg.src = `${PATHS.IMAGES.ICONS + IMAGES.TAKEDOWN}`
                break;
            case FightEventType.SubmissionAttempt:
                eventImg.src = `${PATHS.IMAGES.ICONS + IMAGES.SUBMISSION_ATTEMPT}`
                break;
            case FightEventType.GettingUp:
                eventImg.src = `${PATHS.IMAGES.ICONS + IMAGES.GETTING_UP}`
                break;
        }

        eventItem.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        roundItem.appendChild(eventItem);
    }

    private renderPosition(round: number = this.round) {
        let roundItem: HTMLElement;
        let changePositionItemTemplate: HTMLElement;
        let changePositionItem: HTMLElement;

        roundItem = selectElementByClass(this.container, CLASS_NAMES.ITEMS.ROUND + round);
        if(this.position === Position.Standup)
            changePositionItemTemplate = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.LIVE.INFO_STANDUP_EVENT);
        else
            changePositionItemTemplate = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.LIVE.INFO_GROUND_EVENT);
        changePositionItem = changePositionItemTemplate.cloneNode(true) as HTMLElement;
        changePositionItem.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        roundItem.appendChild(changePositionItem);
    }

    private renderTime(){
        let timeLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.TIME);
        timeLabel.innerHTML = `${this.minutes}:${this.seconds}`
    }

    private renderRound(){
        let roundLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.ROUND);
        roundLabel.innerHTML = `R${this.round.toString()}`;
    }

    private renderSignificantStrikes() {
        let significantStrikesLabels = selectElementsByClass(this.container, CLASS_NAMES.LABELS.SIGNIFICIANT_STRIKES);
        significantStrikesLabels[INDEXES.FIGHTERS.RED_CORNER].innerHTML = this.fightStats.redCorner.significantStrikes.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
        significantStrikesLabels[INDEXES.FIGHTERS.BLUE_CORNER].innerHTML = this.fightStats.blueCorner.significantStrikes.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
    }

    private renderSubmissionAttempts() {
        let submissionLabels = selectElementsByClass(this.container, CLASS_NAMES.LABELS.SUBMISSION);
        submissionLabels[INDEXES.FIGHTERS.RED_CORNER].innerHTML = this.fightStats.redCorner.submissionAttempts.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
        submissionLabels[INDEXES.FIGHTERS.BLUE_CORNER].innerHTML = this.fightStats.blueCorner.submissionAttempts.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
    }
    
    private renderTakedowns() {
        let takedownsLabels = selectElementsByClass(this.container, CLASS_NAMES.LABELS.TAKEDOWNS);
        takedownsLabels[INDEXES.FIGHTERS.RED_CORNER].innerHTML = this.fightStats.redCorner.takedowns.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
        takedownsLabels[INDEXES.FIGHTERS.BLUE_CORNER].innerHTML = this.fightStats.blueCorner.takedowns.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
    }
    
    private renderDamage() {
        fillProgressBars(this.container, CLASS_NAMES.PROGRESS_BARS.DAMAGE, this.fightStats.redCorner.damage, this.fightStats.blueCorner.damage);
    }

    private renderFightStats() {
        this.renderSignificantStrikes();
        this.renderTakedowns();
        this.renderSubmissionAttempts();
        this.renderDamage();
    }

}