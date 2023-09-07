import { FightEventType } from "../enums/fight-event-type.enum";
import { mapRulesToNumberOfRounds } from "../enums/rules.enum";
import { Fight } from "../models/fight";
import { Fighter } from "../models/fighter";
import { FightEvent } from "../models/fightEvent";
import { FightStats } from "../models/fightStats";
import { RoundStats } from "../models/roundStats";
import { CLASS_NAMES, INDEXES, PATHS, TIME } from "../utilities/constants";
import { fillProgressBars, getPercentageStrings, selectElementByClass, selectElementsByClass } from "../utilities/helpers";

export class LiveComponent{
    container: HTMLElement;
    currentFight: Fight;
    fightStats: FightStats;
    roundStats: RoundStats[];
    secondsElapsed: number;
    currentRound: number;

    get minutes(): string{
        return Math.floor(this.secondsElapsed / TIME.SECONDS_IN_MINUTE).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    }

    get seconds(): string{
        return (this.secondsElapsed % TIME.SECONDS_IN_MINUTE).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    }
    
    constructor(){
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.LIVE);
        this.resetRounds();
        this.resetTime();
    }

    setNewFight(newFight: Fight){
        let numberOfRounds = mapRulesToNumberOfRounds(newFight.rules);
        this.setFighters(newFight.redCorner, newFight.blueCorner);
        this.resetTime();
        this.resetRounds();
        this.resetFightStats(numberOfRounds);
        let rulesLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.RULES);
        rulesLabel.innerHTML = newFight.rules;
        let weightclassLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.WEIGHTCLASS);
        weightclassLabel.innerHTML = newFight.redCorner.weightclass;
        let liveListDiv = selectElementByClass(this.container, CLASS_NAMES.LISTS.LIVE); 
        for(let roundIndex = 1; roundIndex <= numberOfRounds; roundIndex++){
            let roundTempDiv = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.ROUND);
            let roundDiv = roundTempDiv.cloneNode(true) as HTMLElement;
            roundDiv.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
            roundDiv.classList.remove(CLASS_NAMES.TEMPLATES.ROUND);
            let roundHeader = roundDiv.children[0] as HTMLElement;
            let roundBody = roundDiv.children[1] as HTMLElement;
            roundHeader.innerHTML = `${roundIndex.toString()}. Round`;
            roundBody.classList.add(`${CLASS_NAMES.CARDS.ROUND + roundIndex}`);
            liveListDiv.appendChild(roundDiv);
        }

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
        this.roundStats = Array<RoundStats>(numberOfRounds);

        this.renderFightStats();
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

    addToFightStats(event: FightEvent<FightEventType>){
    }

    resetRounds() {
        this.currentRound = 1;
        this.renderRound();
    }

    resetTime() {
        this.secondsElapsed = 0;
        this.renderTime();
    }

    addSecond(){
        this.secondsElapsed++;
        this.renderTime();
    }
    
    addRound(){
        this.currentRound++;
        this.renderRound();
        this.resetTime();
    }

    private renderTime(){
        let timeLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.TIME);
        timeLabel.innerHTML = `${this.minutes}:${this.seconds}`
    }

    private renderRound(){
        let roundLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.ROUND);
        roundLabel.innerHTML = `R${this.currentRound.toString()}`;
    }

    private renderSignificantStrikes() {
        let significantStrikesLabels = selectElementsByClass(this.container, CLASS_NAMES.LABELS.SIGNIFICIANT_STRIKES);
        significantStrikesLabels[INDEXES.RED_CORNER].innerHTML = this.fightStats.redCorner.significantStrikes.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
        significantStrikesLabels[INDEXES.BLUE_CORNER].innerHTML = this.fightStats.blueCorner.significantStrikes.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
    }

    private renderSubmissionAttempts() {
        let submissionLabels = selectElementsByClass(this.container, CLASS_NAMES.LABELS.SUBMISSION);
        submissionLabels[INDEXES.RED_CORNER].innerHTML = this.fightStats.redCorner.significantStrikes.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
        submissionLabels[INDEXES.BLUE_CORNER].innerHTML = this.fightStats.blueCorner.takedowns.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
    }
    
    private renderTakedowns() {
        let takedownsLabels = selectElementsByClass(this.container, CLASS_NAMES.LABELS.TAKEDOWNS);
        takedownsLabels[INDEXES.RED_CORNER].innerHTML = this.fightStats.redCorner.takedowns.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
        takedownsLabels[INDEXES.BLUE_CORNER].innerHTML = this.fightStats.blueCorner.significantStrikes.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });
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