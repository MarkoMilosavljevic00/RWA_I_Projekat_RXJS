import { Corner } from "../enums/corner.enum";
import {
    FightEventType,
    FightEventTypeKey,
    GettingUpType,
    GroundAndPoundType,
    KickType,
    PunchType,
    SubmissionType,
    TakedownType,
} from "../enums/fight-event-type.enum";
import { Method } from "../enums/method.enum";
import { Position } from "../enums/position.enum";
import { Rules } from "../enums/rules.enum";
import { Fight } from "../models/fight";
import { Fighter } from "../models/fighter";
import { FightEvent } from "../models/fightEvent";
import { FightStats, Scorecard } from "../models/fightStats";
import { ValueWithWeight } from "../models/valueWithWeight";
import {
    CLASS_NAMES,
    DAMAGE,
    IMAGES,
    INDEXES,
    NUMBER_OF_DIGITS,
    PATHS,
    POINTS,
    PROBABILITY,
    RULES,
    TIME,
} from "../utilities/constants";
import {
    calculateEmitProbability,
    clearElement,
    fillProgressBars,
    getRandomValue,
    getRandomValueWithWeightedProbability,
    mapCornerToKey,
    mapFightEventTypeToKey,
    selectElementByClass,
    selectElementsByClass,
} from "../utilities/helpers";
import { Component } from "./component";

export class LiveComponent extends Component {
    fight: Fight;
    position: Position;
    round: number;
    secondsElapsed: number;
    fightStats: FightStats;
    scorecards: Scorecard[];

    get minutes(): string {
        return Math.floor(
            this.secondsElapsed / TIME.TICKS_IN_MINUTE
        ).toLocaleString("en-US", {
            minimumIntegerDigits: NUMBER_OF_DIGITS,
            useGrouping: false,
        });
    }

    get seconds(): string {
        return (
            this.secondsElapsed % TIME.TICKS_IN_MINUTE
            ).toLocaleString("en-US",{ 
                minimumIntegerDigits: NUMBER_OF_DIGITS, 
                useGrouping: false 
        });
    }

    constructor() {
        super();
        this.container = selectElementByClass(
            document.body,
            CLASS_NAMES.CONTAINERS.LIVE
        );
        this.resetRounds();
        this.resetTime();
        this.hideElement(CLASS_NAMES.BUTTONS.NEXT_FIGHT);
    }

    getScorecards(): Scorecard[] {
        return this.scorecards;
    }

    addFightEvent(event: FightEvent, round: number = this.round) {
        let attackerKey = mapCornerToKey(event.attacker);
        let defenderKey = mapCornerToKey(event.defender);

        this.fightStats[attackerKey].lastEvent = event;

        this.fightStats[defenderKey].damage += event.damage;
        if (this.fightStats[defenderKey].damage >= 100)
            this.fightStats[defenderKey].damage = 100;
        this.fightStats[attackerKey].damage += event.energySpent;
        if (this.fightStats[attackerKey].damage >= 100)
            this.fightStats[attackerKey].damage = 100;
        this.renderDamage();

        this.scorecards[round][attackerKey].damage += event.energySpent;
        if (this.scorecards[round][attackerKey].damage >= 100)
            this.scorecards[round][attackerKey].damage = 100;
        this.scorecards[round][defenderKey].damage += event.damage;
        if (this.scorecards[round][defenderKey].damage >= 100)
            this.scorecards[round][defenderKey].damage = 100;

        this.renderEvent(event, round);
        switch (event.type) {
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
                this.renderPosition(round);
                this.renderTakedowns();
                break;
            case FightEventType.SubmissionAttempt:
                this.fightStats[attackerKey].submissionAttempts++;
                this.scorecards[round][attackerKey].submissionAttempts++;
                this.renderSubmissionAttempts();
                break;
            case FightEventType.GettingUp:
                this.changePosition(Position.Standup);
                this.renderPosition(round);
                break;
        }
    }

    checkForFinish(): boolean {
        let redCornerDamage = this.fightStats.redCorner.damage;
        let blueCornerDamage = this.fightStats.blueCorner.damage;

        return redCornerDamage >= DAMAGE.MAX || blueCornerDamage >= DAMAGE.MAX;
    }

    generateEvent(): FightEvent {
        let event: FightEvent = new FightEvent();
        let cornerValues: ValueWithWeight<Corner>[] = [];

        cornerValues.push({
            value: Corner.Red,
            weight: this.fight.redCorner.overall,
        });
        cornerValues.push({
            value: Corner.Blue,
            weight: this.fight.blueCorner.overall,
        });

        event.attacker = getRandomValueWithWeightedProbability(cornerValues);
        event.defender =
            event.attacker === Corner.Red ? Corner.Blue : Corner.Red;
        let attacker = this.fight[mapCornerToKey(event.attacker)];
        let defender = this.fight[mapCornerToKey(event.defender)];
        switch (this.fight.rules) {
            case Rules.MMA:
                event.type = this.getEventTypeInMMA(attacker, defender);
                break;
            case Rules.Boxing:
                event.type = this.getEventTypeInBoxing();
                break;
            case Rules.Kickboxing:
                event.type = this.getEventTypeInKickboxing();
                break;
            case Rules.Grappling:
                event.type = this.getEventTypeInGrappling();
                break;
            default:
                break;
        }
        let [attackerSkill, defenderSkill] = this.getEventRelevantSkills(
            event.type,
            attacker,
            defender
        );
        let isEventSignificant = this.checkIsEventSignificant(
            attackerSkill,
            defenderSkill,
            mapFightEventTypeToKey(event.type)
        );
        event.damage = this.getEventDamage(
            attackerSkill,
            defenderSkill,
            mapFightEventTypeToKey(event.type),
            isEventSignificant
        );
        event.energySpent = this.getEventEnergySpent(
            attackerSkill,
            defenderSkill,
            mapFightEventTypeToKey(event.type),
            event.damage
        );
        event.subType = this.getEventSubType(event.type, isEventSignificant);
        //console.log("Event generated: ", event);
        return event;
    }

    getEventTypeInGrappling(): FightEventType {
        let eventTypeValues: ValueWithWeight<FightEventType>[] = [];
        if (this.position === Position.Standup) {
            return FightEventType.Takedown;
        } else {
            eventTypeValues.push({
                value: FightEventType.SubmissionAttempt,
                weight: PROBABILITY.GRAPPLING_MATCH.SUBMISSION_ATTEMPT,
            });
            eventTypeValues.push({
                value: FightEventType.GettingUp,
                weight: PROBABILITY.GRAPPLING_MATCH.GETTING_UP,
            });
        }
        return getRandomValueWithWeightedProbability(eventTypeValues);
    }
    getEventTypeInKickboxing(): FightEventType {
        return getRandomValue([FightEventType.Punch, FightEventType.Kick]);
    }
    getEventTypeInBoxing(): FightEventType {
        return FightEventType.Punch;
    }

    getEventTypeInMMA(attacker: Fighter, defender: Fighter): FightEventType {
        let eventTypeValues: ValueWithWeight<FightEventType>[] = [];
        if (this.position === Position.Standup) {
            eventTypeValues.push({
                value: FightEventType.Punch,
                weight:
                    (attacker.striking + defender.grappling) *
                    PROBABILITY.AFFINITY.STRIKING.PUNCH,
            });
            eventTypeValues.push({
                value: FightEventType.Kick,
                weight:
                    (attacker.striking + defender.grappling) *
                    PROBABILITY.AFFINITY.STRIKING.KICK,
            });
            eventTypeValues.push({
                value: FightEventType.Takedown,
                weight:
                    (attacker.grappling + defender.striking) *
                    PROBABILITY.AFFINITY.GRAPPLING.TAKEDOWN,
            });
        } else {
            eventTypeValues.push({
                value: FightEventType.GroundAndPound,
                weight:
                    (attacker.striking + attacker.grappling) *
                    PROBABILITY.AFFINITY.STRIKING.GROUND_AND_POUND,
            });
            eventTypeValues.push({
                value: FightEventType.SubmissionAttempt,
                weight:
                    (attacker.grappling + defender.striking) *
                    PROBABILITY.AFFINITY.GRAPPLING.SUBMISSION_ATTEMPT,
            });
            eventTypeValues.push({
                value: FightEventType.GettingUp,
                weight:
                    (attacker.striking + defender.grappling) *
                    PROBABILITY.AFFINITY.STRIKING.GETTING_UP,
            });
        }
        return getRandomValueWithWeightedProbability(eventTypeValues);
    }

    getEventRelevantSkills(
        eventType: FightEventType,
        attacker: Fighter,
        defender: Fighter
    ): [number, number] {
        switch (eventType) {
            case FightEventType.Punch:
            case FightEventType.Kick:
            case FightEventType.GroundAndPound:
                return [attacker.striking, defender.striking];
            case FightEventType.GettingUp:
                return [
                    attacker.striking + defender.grappling,
                    defender.striking + attacker.grappling,
                ];
            case FightEventType.Takedown:
            case FightEventType.SubmissionAttempt:
                return [attacker.grappling, defender.grappling];
        }
    }

    getEventSubType(
        fightEventType: FightEventType,
        isEventSignificant: boolean
    ):
        | PunchType
        | KickType
        | TakedownType
        | SubmissionType
        | GroundAndPoundType
        | GettingUpType {
        let subTypeValues:
            | PunchType[]
            | KickType[]
            | TakedownType[]
            | SubmissionType[]
            | GroundAndPoundType[]
            | GettingUpType[];
        switch (fightEventType) {
            case FightEventType.Punch:
                subTypeValues = Object.values(PunchType);
                if (isEventSignificant)
                    subTypeValues = subTypeValues.filter((type) => type !== PunchType.Jab);
                break;
            case FightEventType.Kick:
                subTypeValues = Object.values(KickType);
                if (isEventSignificant)
                    subTypeValues = subTypeValues.filter((type) =>
                            type !== KickType.SideKick &&
                            type !== KickType.PushKick
                    );
                break;
            case FightEventType.Takedown:
                subTypeValues = Object.values(TakedownType);
                break;
            case FightEventType.SubmissionAttempt:
                subTypeValues = Object.values(SubmissionType);
                break;
            case FightEventType.GroundAndPound:
                subTypeValues = Object.values(GroundAndPoundType);
                if (isEventSignificant)
                    subTypeValues = subTypeValues.filter(
                        (type) => type !== GroundAndPoundType.GroundAndPound
                    );
                break;
            case FightEventType.GettingUp:
                subTypeValues = Object.values(GettingUpType);
                break;
        }
        return getRandomValue<
            | PunchType
            | KickType
            | TakedownType
            | SubmissionType
            | GroundAndPoundType
            | GettingUpType
        >(subTypeValues);
    }

    checkIsEventSignificant(
        attackerSkill: number,
        defenderSkill: number,
        fightEventType: FightEventTypeKey
    ): boolean {
        if (PROBABILITY.POWER[fightEventType] !== 0) {
            let booleanValues: ValueWithWeight<boolean>[] = [];
            booleanValues.push({
                value: true,
                weight: attackerSkill * PROBABILITY.POWER[fightEventType],
            });
            booleanValues.push({ value: false, weight: defenderSkill });
            return getRandomValueWithWeightedProbability(booleanValues);
        } else return false;
    }

    getEventEnergySpent(
        attackerSkill: number,
        defenderSkill: number,
        fightEventType: FightEventTypeKey,
        damage: number
    ) {
        let energySpent: number;

        if (
            fightEventType === FightEventTypeKey.Takedown ||
            fightEventType === FightEventTypeKey.SubmissionAttempt
        ) {
            let range: { min: number; max: number } = {
                min: DAMAGE.MIN,
                max: DAMAGE.ENERGY_SPENT[fightEventType],
            };
            energySpent = this.calculateDamage(
                attackerSkill,
                defenderSkill,
                range
            );
        } else {
            energySpent = damage * DAMAGE.ENERGY_SPENT[fightEventType];
        }

        return energySpent;
    }

    getEventDamage(
        attackerSkill: number,
        defenderSkill: number,
        fightEventType: FightEventTypeKey,
        isEventSignificant: boolean
    ) {
        let damage: number;

        if (isEventSignificant) {
            damage = this.calculateDamage(
                attackerSkill,
                defenderSkill,
                DAMAGE.POWER[fightEventType]
            );
        } else {
            damage = this.calculateDamage(
                attackerSkill,
                defenderSkill,
                DAMAGE.REGULAR[fightEventType]
            );
        }

        return damage;
    }

    calculateDamage(
        attackerSkill: number,
        defenderSkill: number,
        damages: { min?: number; max: number }
    ) {
        if (!damages.min) 
            damages.min = DAMAGE.MIN;
        let damageRange = damages.max - damages.min;
        if (attackerSkill > defenderSkill)
            damages.min = damages.min + (damageRange * (attackerSkill - defenderSkill)) / DAMAGE.MAX;
        else
            damages.max = damages.max - (damageRange * (defenderSkill - attackerSkill)) / DAMAGE.MAX;
        return damages.min + Math.random() * (damages.max - damages.min);
    }

    getFightEventProbability(): number {
        let rule = this.fight.rules;
        return calculateEmitProbability(
            RULES.NUMBER_OF_ROUNDS[rule] *
                RULES.ROUND_DURATION_IN_MINUTES[rule] *
                TIME.TICKS_IN_MINUTE,
            RULES.EVENTS_PER_FIGHT[rule]
        );
    }

    getWinnerOfRound(round: number = this.round) {
        let winner: Corner;
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
        redCornerSignificantStrikes =
            this.scorecards[round].redCorner.significantStrikes;
        blueCornerSignificantStrikes =
            this.scorecards[round].blueCorner.significantStrikes;
        redCornerSubmissionAttempts =
            this.scorecards[round].redCorner.submissionAttempts;
        blueCornerSubmissionAttempts =
            this.scorecards[round].blueCorner.submissionAttempts;
        redCornerTakedowns = this.scorecards[round].redCorner.takedowns;
        blueCornerTakedowns = this.scorecards[round].blueCorner.takedowns;

        if (redCornerDamage < blueCornerDamage) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            if (
                blueCornerDamage > DAMAGE.CONVICING.MIN &&
                redCornerDamage < DAMAGE.CONVICING.RATIO * blueCornerDamage
            )
                this.scorecards[round].blueCorner.roundPoints =
                    POINTS.ROUND.CONVICING_LOSER;
            else
                this.scorecards[round].blueCorner.roundPoints =
                    POINTS.ROUND.LOSER;
        } else if (blueCornerDamage < redCornerDamage) {
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
            if (
                redCornerDamage > DAMAGE.CONVICING.MIN &&
                blueCornerDamage < DAMAGE.CONVICING.RATIO * redCornerDamage
            )
                this.scorecards[round].redCorner.roundPoints =
                    POINTS.ROUND.CONVICING_LOSER;
            else
                this.scorecards[round].redCorner.roundPoints =
                    POINTS.ROUND.LOSER;
        } else if (redCornerSignificantStrikes > blueCornerSignificantStrikes) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        } else if (redCornerSignificantStrikes < blueCornerSignificantStrikes) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
        } else if (redCornerSubmissionAttempts > blueCornerSubmissionAttempts) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        } else if (redCornerSubmissionAttempts < blueCornerSubmissionAttempts) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
        } else if (redCornerTakedowns > blueCornerTakedowns) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.WINNER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.LOSER;
        } else if (redCornerTakedowns < blueCornerTakedowns) {
            this.scorecards[round].redCorner.roundPoints = POINTS.ROUND.LOSER;
            this.scorecards[round].blueCorner.roundPoints = POINTS.ROUND.WINNER;
        }

        if (
            this.scorecards[round].redCorner.roundPoints >
            this.scorecards[round].blueCorner.roundPoints
        )
            winner = Corner.Red;
        else winner = Corner.Blue;

        this.renderWinner(winner, Method.Decision, round);
    }

    getWinnerFromFinish(fightEvent: FightEvent) {
        let winner: Corner;
        let method: Method;
        if (this.fightStats[mapCornerToKey(fightEvent.attacker)].damage >=DAMAGE.MAX) {
            winner = fightEvent.defender;
            method = Method.KO_TKO;
        } 
        else if (this.fightStats[mapCornerToKey(fightEvent.defender)].damage >=DAMAGE.MAX) {
            winner = fightEvent.attacker;
            method = fightEvent.type === FightEventType.SubmissionAttempt
                    ? Method.Submission
                    : Method.KO_TKO;
        } 
        else 
            return;
        this.renderWinner(winner, method);
    }

    setFight(fight: Fight) {
        let numberOfRounds = RULES.NUMBER_OF_ROUNDS[fight.rules];

        this.fight = fight;
        this.setFighters(fight.redCorner, fight.blueCorner);
        this.resetTime();
        this.resetRounds();
        this.resetFightStats(numberOfRounds);
        this.resetEventList();
        this.position = Position.Standup;

        let rulesLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.RULES
        );
        rulesLabel.innerHTML = fight.rules;
        let weightclassLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.WEIGHTCLASS
        );
        weightclassLabel.innerHTML = fight.redCorner.weightclass;

        let liveListDiv = selectElementByClass(
            this.container,
            CLASS_NAMES.LISTS.LIVE
        );
        for (let roundIndex = 1; roundIndex <= numberOfRounds; roundIndex++) {
            let roundTempDiv = selectElementByClass(
                this.container,
                CLASS_NAMES.TEMPLATES.LIVE.ROUND
            );
            let roundDiv = roundTempDiv.cloneNode(true) as HTMLElement;
            roundDiv.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
            roundDiv.classList.remove(CLASS_NAMES.TEMPLATES.LIVE.ROUND);
            let roundHeader = roundDiv.children[0] as HTMLElement;
            let roundBody = roundDiv.children[1] as HTMLElement;
            roundHeader.innerHTML = `${roundIndex.toString()}. Round`;
            roundDiv.classList.add(`${CLASS_NAMES.ITEMS.ROUND + roundIndex}`);
            roundBody.classList.add(`${CLASS_NAMES.LISTS.EVENT + roundIndex}`);
            liveListDiv.appendChild(roundDiv);
        }
        this.hideElement(CLASS_NAMES.BUTTONS.NEXT_FIGHT);
    }

    setFighters(redCorner: Fighter, blueCorner: Fighter) {
        let redCornerImg: HTMLImageElement;
        let redCornerNameLabel: HTMLLabelElement;
        let blueCornerImg: HTMLImageElement;
        let blueCornerWinnerLabel: HTMLLabelElement;

        redCornerImg = selectElementByClass(
            this.container,
            CLASS_NAMES.IMAGES.RED_CORNER
        ) as HTMLImageElement;
        redCornerNameLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.RED_CORNER
        ) as HTMLLabelElement;
        blueCornerImg = selectElementByClass(
            this.container,
            CLASS_NAMES.IMAGES.BLUE_CORNER
        ) as HTMLImageElement;
        blueCornerWinnerLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.BLUE_CORNER
        ) as HTMLLabelElement;

        redCornerImg.src = `${PATHS.IMAGES.FIGHTERS + redCorner.pictureSrc}`;
        redCornerNameLabel.innerHTML = redCorner.name;
        blueCornerImg.src = `${PATHS.IMAGES.FIGHTERS + blueCorner.pictureSrc}`;
        blueCornerWinnerLabel.innerHTML = blueCorner.name;

        fillProgressBars(
            this.container,
            CLASS_NAMES.PROGRESS_BARS.RED_CORNER_SKILLS,
            redCorner.striking,
            redCorner.grappling,
            redCorner.overall
        );
        fillProgressBars(
            this.container,
            CLASS_NAMES.PROGRESS_BARS.BLUE_CORNER_SKILLS,
            blueCorner.striking,
            blueCorner.grappling,
            blueCorner.overall
        );
    }

    changePosition(position?: Position, round: number = this.round) {
        if (position) {
            this.position = position;
        } else {
            this.position =
                this.position === Position.Standup
                    ? Position.Ground
                    : Position.Standup;
        }
    }

    resetEventList() {
        clearElement(
            this.container,
            CLASS_NAMES.LISTS.LIVE,
            CLASS_NAMES.ITEMS.ROUND
        );
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
            },
        };
        this.renderFightStats();

        this.scorecards = [];
        this.scorecards.push(null);
        for (let i = 0; i < numberOfRounds; i++) {
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
                },
            };
            this.scorecards.push(round);
        }
    }

    resetRounds() {
        this.round = TIME.INITIAL.ROUNDS;
        this.renderRound();
    }

    resetTime() {
        this.secondsElapsed = TIME.INITIAL.SECONDS;
        this.renderTime();
    }

    tickSecond(rule: Rules, tick: number = 1): { 
        round: number,
        secondsElapsed: number;
        roundChange: boolean;
    } {
        let secondsElapsed: number = this.secondsElapsed;
        let round: number = this.round;
        let roundChange = false;

        secondsElapsed += tick;
        if ((secondsElapsed === 
            TIME.TICKS_IN_MINUTE * RULES.ROUND_DURATION_IN_MINUTES[rule]) && 
            round !== RULES.NUMBER_OF_ROUNDS[this.fight.rules]
        ) {
            console.log("ZAMENA RUNDE U KOMPONENTI")
            roundChange = true;
            round++;
            secondsElapsed = TIME.INITIAL.SECONDS;
        }
        return {
            round: round,
            secondsElapsed: secondsElapsed,
            roundChange: roundChange,
        };
    }

    setTimer(time: { round: number; secondsElapsed: number }) {
        this.round = time.round;
        this.secondsElapsed = time.secondsElapsed;
        this.renderRound();
        this.renderTime();
    }

    renderWinner(winner: Corner, method: Method, round: number = this.round) {
        let eventList: HTMLElement;
        let winnerItemTemplate: HTMLElement;
        let winnerItem: HTMLElement;
        let winnerLabel: HTMLElement;
        let winnerInfo: HTMLElement;

        eventList = selectElementByClass(
            this.container,
            CLASS_NAMES.LISTS.EVENT + round
        );
        winnerItemTemplate = selectElementByClass(
            this.container,
            CLASS_NAMES.TEMPLATES.LIVE.INFO_ROUND_WINNER_EVENT
        );
        winnerItem = winnerItemTemplate.cloneNode(true) as HTMLElement;
        winnerLabel = selectElementByClass(
            winnerItem,
            CLASS_NAMES.LABELS.WINNER
        );
        winnerInfo = selectElementByClass(
            winnerItem,
            CLASS_NAMES.LABELS.WIN_INFO_LABEL
        );

        winnerLabel.innerHTML = winner;
        if (winner === Corner.Red)
            winnerLabel.classList.add(CLASS_NAMES.STYLES.RED_TEXT);
        else winnerLabel.classList.add(CLASS_NAMES.STYLES.BLUE_TEXT);

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
        eventList.appendChild(winnerItem);
    }

    private renderEvent(event: FightEvent, round: number = this.round) {
        let eventList: HTMLElement;
        let eventItemTemplate: HTMLElement;
        let eventItem: HTMLElement;
        let eventTimeLabel: HTMLElement;
        let eventDamageLabel: HTMLElement;
        let eventEnergyLabel: HTMLElement;
        let eventTypeLabel: HTMLElement;
        let eventSubtypeLabel: HTMLElement;
        let eventImg: HTMLImageElement;

        eventList = selectElementByClass(
            this.container,
            CLASS_NAMES.LISTS.EVENT + round
        );
        if (event.attacker === Corner.Red)
            eventItemTemplate = selectElementByClass(
                this.container,
                CLASS_NAMES.TEMPLATES.LIVE.RED_CORNER_EVENT
            );
        else
            eventItemTemplate = selectElementByClass(
                this.container,
                CLASS_NAMES.TEMPLATES.LIVE.BLUE_CORNER_EVENT
            );
        eventItem = eventItemTemplate.cloneNode(true) as HTMLElement;
        eventTimeLabel = selectElementByClass(
            eventItem,
            CLASS_NAMES.LABELS.EVENT_TIME_LABEL
        );
        eventDamageLabel = selectElementByClass(
            eventItem,
            CLASS_NAMES.LABELS.EVENT_DAMAGE
        );
        eventEnergyLabel = selectElementByClass(
            eventItem,
            CLASS_NAMES.LABELS.EVENT_ENERGY
        );
        eventTypeLabel = selectElementByClass(
            eventItem,
            CLASS_NAMES.LABELS.EVENT_TYPE
        );
        eventSubtypeLabel = selectElementByClass(
            eventItem,
            CLASS_NAMES.LABELS.EVENT_SUBTYPE
        );
        eventImg = selectElementByClass(
            eventItem,
            CLASS_NAMES.IMAGES.EVENT
        ) as HTMLImageElement;

        eventTimeLabel.innerHTML = `${this.minutes}'${this.seconds}''`;
        eventDamageLabel.innerHTML = event.damage.toFixed(NUMBER_OF_DIGITS);
        eventEnergyLabel.innerHTML =
            event.energySpent.toFixed(NUMBER_OF_DIGITS);
        eventTypeLabel.innerHTML = event.type;
        if (event.subType) eventSubtypeLabel.innerHTML = `(${event.subType})`;

        switch (event.type) {
            case FightEventType.Punch:
            case FightEventType.GroundAndPound:
                eventImg.src += `${IMAGES.PUNCH}`;
                break;
            case FightEventType.Kick:
                eventImg.src += `${IMAGES.KICK}`;
                break;
            case FightEventType.Takedown:
                eventImg.src += `${IMAGES.TAKEDOWN}`;
                break;
            case FightEventType.SubmissionAttempt:
                eventImg.src += `${IMAGES.SUBMISSION_ATTEMPT}`;
                break;
            case FightEventType.GettingUp:
                eventImg.src += `${IMAGES.GETTING_UP}`;
                break;
        }

        eventItem.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        eventList.appendChild(eventItem);
    }

    private renderPosition(round: number = this.round) {
        let eventList: HTMLElement;
        let changePositionItemTemplate: HTMLElement;
        let changePositionItem: HTMLElement;

        eventList = selectElementByClass(
            this.container,
            CLASS_NAMES.LISTS.EVENT + round
        );
        if (this.position === Position.Standup)
            changePositionItemTemplate = selectElementByClass(
                this.container,
                CLASS_NAMES.TEMPLATES.LIVE.INFO_STANDUP_EVENT
            );
        else
            changePositionItemTemplate = selectElementByClass(
                this.container,
                CLASS_NAMES.TEMPLATES.LIVE.INFO_GROUND_EVENT
            );
        changePositionItem = changePositionItemTemplate.cloneNode(
            true
        ) as HTMLElement;
        changePositionItem.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        eventList.appendChild(changePositionItem);
    }

    private renderTime() {
        let timeLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.TIME
        );
        timeLabel.innerHTML = `${this.minutes}:${this.seconds}`;
    }

    private renderRound() {
        let roundLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.ROUND
        );
        roundLabel.innerHTML = `R${this.round.toString()}`;
    }

    private renderSignificantStrikes() {
        let significantStrikesLabels = selectElementsByClass(
            this.container,
            CLASS_NAMES.LABELS.SIGNIFICIANT_STRIKES
        );
        significantStrikesLabels[INDEXES.FIGHTERS.RED_CORNER].innerHTML =
            this.fightStats.redCorner.significantStrikes.toLocaleString(
                "en-US",
                { minimumIntegerDigits: NUMBER_OF_DIGITS, useGrouping: false }
            );
        significantStrikesLabels[INDEXES.FIGHTERS.BLUE_CORNER].innerHTML =
            this.fightStats.blueCorner.significantStrikes.toLocaleString(
                "en-US",
                { minimumIntegerDigits: NUMBER_OF_DIGITS, useGrouping: false }
            );
    }

    private renderSubmissionAttempts() {
        let submissionLabels = selectElementsByClass(
            this.container,
            CLASS_NAMES.LABELS.SUBMISSION
        );
        submissionLabels[INDEXES.FIGHTERS.RED_CORNER].innerHTML =
            this.fightStats.redCorner.submissionAttempts.toLocaleString(
                "en-US",
                { minimumIntegerDigits: NUMBER_OF_DIGITS, useGrouping: false }
            );
        submissionLabels[INDEXES.FIGHTERS.BLUE_CORNER].innerHTML =
            this.fightStats.blueCorner.submissionAttempts.toLocaleString(
                "en-US",
                { minimumIntegerDigits: NUMBER_OF_DIGITS, useGrouping: false }
            );
    }

    private renderTakedowns() {
        let takedownsLabels = selectElementsByClass(
            this.container,
            CLASS_NAMES.LABELS.TAKEDOWNS
        );
        takedownsLabels[INDEXES.FIGHTERS.RED_CORNER].innerHTML =
            this.fightStats.redCorner.takedowns.toLocaleString("en-US", {
                minimumIntegerDigits: NUMBER_OF_DIGITS,
                useGrouping: false,
            });
        takedownsLabels[INDEXES.FIGHTERS.BLUE_CORNER].innerHTML =
            this.fightStats.blueCorner.takedowns.toLocaleString("en-US", {
                minimumIntegerDigits: NUMBER_OF_DIGITS,
                useGrouping: false,
            });
    }

    private renderDamage() {
        fillProgressBars(
            this.container,
            CLASS_NAMES.PROGRESS_BARS.DAMAGE,
            parseFloat(
                this.fightStats.redCorner.damage.toFixed(NUMBER_OF_DIGITS)
            ),
            parseFloat(
                this.fightStats.blueCorner.damage.toFixed(NUMBER_OF_DIGITS)
            )
        );
    }

    private renderFightStats() {
        this.renderSignificantStrikes();
        this.renderTakedowns();
        this.renderSubmissionAttempts();
        this.renderDamage();
    }
}
