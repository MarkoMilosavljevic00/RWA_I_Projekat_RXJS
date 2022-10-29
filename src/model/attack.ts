import {
  getByProbability,
  getRandomNumberRange,
  getRandomNumberTo,
} from "../controller/logic";
import { FightPosition } from "../enums/FightPositionEnum";
import { Rules } from "../enums/RulesEnum";
import { Action } from "../enums/ActionEnum";
import { ATTACK, FIGHTER, RULES } from "../environment";
import { Fight } from "./fight";
import { Fighter } from "./fighter";
import { Method } from "../enums/MethodEnum";
import { FightCard } from "./fightCard";
import { Corner } from "../enums/CornerEnum";
import { StateOfFight } from "./stateOfFight";
import { renderFinish } from "../view/view";
import { createAttackDiv } from "../view/creating.elements";

export class Attack {
  attacker: Fighter;
  defender: Fighter;

  attackerDamage: number;
  defenderDamage: number;

  type: Action;
  success: boolean;

  attackDiv: HTMLDivElement;

  constructor(fight: Fight) {
    this.attacker = this.getAttacker(
      fight.blueCorner,
      fight.redCorner,
      fight.getPosition()
    );
    this.defender = this.getDefender(fight.blueCorner, fight.redCorner);
    this.type = this.getTypeOfAttack(fight.rules, fight.getPosition());
    this.success = this.getSuccesOfAttack(fight);
    this.determineDamages(fight.getPosition());
    this.attackDiv = createAttackDiv(this);
  }

  getAttacker(
    blueCorner: Fighter,
    redCorner: Fighter,
    currentPosition: FightPosition
  ): Fighter {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [
          blueCorner.calcOverall() +
            blueCorner.standup * ATTACK.FACTOR.IMPORTANCE_OF_POSITON,
          redCorner.calcOverall() +
            redCorner.standup * ATTACK.FACTOR.IMPORTANCE_OF_POSITON,
        ],
        blueCorner,
        redCorner
      );
    } else {
      return getByProbability(
        [
          blueCorner.calcOverall() +
            blueCorner.grappling * ATTACK.FACTOR.IMPORTANCE_OF_POSITON,
          redCorner.calcOverall() +
            redCorner.grappling * ATTACK.FACTOR.IMPORTANCE_OF_POSITON,
        ],
        blueCorner,
        redCorner
      );
    }
  }

  getDefender(blueCorner: Fighter, redCorner: Fighter): Fighter {
    if (this.attacker === blueCorner) {
      return redCorner;
    } else {
      return blueCorner;
    }
  }

  getTypeOfAttack(rules: Rules, currentPosition: FightPosition): Action {
    switch (rules) {
      case Rules.MMA:
        return this.getMMAAttack(currentPosition);
      case Rules.Boxing:
      case Rules.KickBoxing:
        return this.getStandUpAttack();
      case Rules.Grappling:
        return this.getGrapplingAttack(currentPosition);
      default:
        break;
    }
  }

  getMMAAttack(currentPosition: FightPosition): Action {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [this.attacker.standup, this.attacker.grappling],
        Action.Punch,
        getByProbability(
          [
            RULES.MMA.PERCENT.TO_TRY.FROM_STANDUP.TAKEDOWN,
            RULES.MMA.PERCENT.TO_TRY.FROM_STANDUP.SUBMISSION,
          ],
          Action.Takedown,
          Action.Submission
        )
      );
    } else {
      if (currentPosition === FightPosition.Ground) {
        return getByProbability(
          [this.attacker.standup, this.attacker.grappling],
          getByProbability(
            [
              RULES.MMA.PERCENT.TO_TRY.FROM_GROUND.PUNCH,
              RULES.MMA.PERCENT.TO_TRY.FROM_GROUND.STAND,
            ],
            Action.Punch,
            Action.Stand
          ),
          getByProbability(
            [
              RULES.MMA.PERCENT.TO_TRY.FROM_GROUND.PUNCH,
              RULES.MMA.PERCENT.TO_TRY.FROM_GROUND.SUBMISSION,
            ],
            Action.Punch,
            Action.Submission
          )
        );
      }
    }
  }

  getStandUpAttack(): Action {
    return Action.Punch;
  }

  getGrapplingAttack(currentPosition: FightPosition): Action {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [
          RULES.GRAPPLING.PERCENT.FROM_STANDUP.TAKEDOWN,
          RULES.GRAPPLING.PERCENT.FROM_STANDUP.SUBMISSION,
        ],
        Action.Takedown,
        Action.Submission
      );
    } else {
      if (currentPosition === FightPosition.Ground) {
        return getByProbability(
          [
            RULES.GRAPPLING.PERCENT.FROM_GROUND.SUBMISSION,
            RULES.GRAPPLING.PERCENT.FROM_GROUND.STAND,
          ],
          Action.Submission,
          Action.Stand
        );
      }
    }
  }

  getSuccesOfAttack(fight: Fight): boolean {
    switch (this.type) {
      case Action.Punch:
        return this.getSuccesOfPunch(
          fight.getPosition(),
          this.attacker,
          this.defender
        );
      case Action.Submission:
        return this.getSuccesOfSubmission(
          fight.getPosition(),
          this.attacker,
          this.defender
        );
      case Action.Takedown:
        return this.getSuccesOfTakedown(this.attacker, this.defender);
      case Action.Stand:
        let successOfStanding = this.getSuccesOfStanding(
          this.attacker,
          this.defender
        );
        if (successOfStanding) fight.setPosition(FightPosition.StandUp);
        return successOfStanding;

      default:
        break;
    }
  }

  getSuccesOfPunch(
    currentPosition: FightPosition,
    attacker: Fighter,
    defender: Fighter
  ): boolean {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [attacker.standup, defender.standup],
        true,
        false
      );
    } else {
      return getByProbability(
        [
          attacker.standup +
            RULES.MMA.PERCENT.TO_SUCCES.FROM_GROUND.ADVANTAGE_ATTACK_PUNCH,
          defender.grappling,
        ],
        true,
        false
      );
    }
  }

  getSuccesOfSubmission(
    currentPosition: FightPosition,
    attacker: Fighter,
    defender: Fighter
  ): boolean {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [
          attacker.grappling,
          defender.grappling +
            RULES.MMA.PERCENT.TO_SUCCES.FROM_STANDUP
              .ADVANTAGE_DEFENSE_SUBMISSION,
        ],
        true,
        false
      );
    } else {
      return getByProbability(
        [
          attacker.grappling,
          defender.grappling +
            RULES.MMA.PERCENT.TO_SUCCES.FROM_GROUND
              .ADVANTAGE_DEFENSE_SUBMISSION,
        ],
        true,
        false
      );
    }
  }

  getSuccesOfTakedown(attacker: Fighter, defender: Fighter): boolean {
    return getByProbability(
      [
        attacker.grappling,
        defender.grappling +
          RULES.MMA.PERCENT.TO_SUCCES.FROM_STANDUP.ADVANTAGE_DEFENSE_TAKEDOWN,
      ],
      true,
      false
    );
  }

  getSuccesOfStanding(attacker: Fighter, defender: Fighter): boolean {
    return getByProbability(
      [defender.grappling, attacker.grappling],
      true,
      false
    );
  }

  getAdvantage(attackerSkill: number, defenderSkill: number) {
    let advantage: number = 0;
    if (attackerSkill > defenderSkill) {
      advantage = getRandomNumberTo(
        (attackerSkill - defenderSkill) * ATTACK.FACTOR.ADVANTAGE
      );
    }
    return advantage;
  }

  isSuccess() {
    return this.success;
  }

  setDamages(
    advantage: number,
    success: number,
    unsuccessToSelf: number,
    unsuccessToOpp: number
  ) {
    if (this.success) {
      this.defenderDamage = getRandomNumberTo(success + advantage);
    } else {
      this.attackerDamage = getRandomNumberTo(unsuccessToSelf);
      this.defenderDamage = getRandomNumberTo(unsuccessToOpp + advantage);
    }
  }

  determineDamages(position: FightPosition): void {
    let standUpAdvantage: number = this.getAdvantage(
      this.attacker.standup,
      this.defender.standup
    );
    let groundAdvantage: number = this.getAdvantage(
      this.attacker.grappling,
      this.defender.grappling
    );
    if (position === FightPosition.StandUp) {
      this.determineStandUpDamages(
        standUpAdvantage,
        groundAdvantage,
        this.type
      );
    } else {
      this.determineGroundDamages(groundAdvantage, standUpAdvantage, this.type);
    }
  }

  determineStandUpDamages(
    standUpAdvantage: number,
    groundAdvantage: number,
    typeOfAction: Action
  ) {
    switch (typeOfAction) {
      case Action.Punch:
        this.setDamages(
          standUpAdvantage,
          ATTACK.DAMAGE.FROM_STANDUP.CLEAR_PUNCH,
          ATTACK.DAMAGE.FROM_STANDUP.BLOCKED_PUNCH.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_STANDUP.BLOCKED_PUNCH.OPP_DAMAGE
        );
        break;
      case Action.Submission:
        this.setDamages(
          groundAdvantage,
          FIGHTER.DAMAGE.MAX,
          ATTACK.DAMAGE.FROM_STANDUP.UNSUCCESSFUL_SUBMISSION.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_STANDUP.UNSUCCESSFUL_SUBMISSION.OPP_DAMAGE
        );
        break;
      case Action.Takedown:
        this.setDamages(
          groundAdvantage,
          ATTACK.DAMAGE.FROM_STANDUP.LANDED_TAKEDOWN,
          ATTACK.DAMAGE.FROM_STANDUP.DEFENDED_TAKEDOWN.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_STANDUP.DEFENDED_TAKEDOWN.OPP_DAMAGE
        );
        break;
    }
  }

  determineGroundDamages(
    groundAdvantage: number,
    standUpAdvantage: number,
    typeOfAction: Action
  ) {
    switch (typeOfAction) {
      case Action.Punch:
        this.setDamages(
          standUpAdvantage + groundAdvantage,
          ATTACK.DAMAGE.FROM_GROUND.CLEAR_PUNCH,
          ATTACK.DAMAGE.FROM_GROUND.BLOCKED_PUNCH.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_GROUND.BLOCKED_PUNCH.OPP_DAMAGE
        );
        break;
      case Action.Submission:
        this.setDamages(
          groundAdvantage,
          FIGHTER.DAMAGE.MAX,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_SUBMISSION.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_SUBMISSION.OPP_DAMAGE
        );
        break;
      case Action.Stand:
        this.setDamages(
          groundAdvantage,
          0,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_STANDING.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_STANDING.OPP_DAMAGE
        );
        break;
    }
  }

  performAttack(container: HTMLElement, currentState: StateOfFight) {
    this.calculateDamages();
    this.renderAttackDiv(container, currentState);
  }

  calculateDamages() {
    this.defender.damagePercent += this.defenderDamage;
    this.defender.normalizeFighterDamage();
    this.attacker.damagePercent += this.attackerDamage;
    this.attacker.normalizeFighterDamage();
  }

  isAnyoneFinished() {
    if (this.attacker.isFighterFinished() || this.defender.isFighterFinished())
      return true;
    else return false;
  }
  checkIsAnyoneFinished(container: HTMLElement, fightCard: FightCard) {
    if (this.isAnyoneFinished()) {
      let fight: Fight = fightCard.getCurrentFight();
      let winnerCorner: Corner = fight.getWinner();
      let method: Method;
      let details: string;

      this.checkIsDefenderFinished(method, details);
      this.checkIsAttackerInjured(method, details);

      renderFinish(
        container,
        winnerCorner,
        method,
        fight.currentState,
        details
      );

      fight.fightIsOver(
        container,
        fightCard,
        method,
        fight.currentState.getRound(),
        winnerCorner
      );
    }
  }
  checkIsAttackerInjured(method: Method, details: string) {
    if (this.attacker.isFighterFinished()) {
      method = Method.KO_TKO;
      details = "Injury";
    }
  }

  checkIsDefenderFinished(method: Method, details: string) {
    if (this.defender.isFighterFinished()) {
      this.getMethodOfFinish(method, details);
    }
  }

  getMethodOfFinish(method: Method, details: string) {
    switch (this.type) {
      case Action.Punch:
        method = Method.KO_TKO;
        details = "Punches"
        //details = Attack.getTypeOfPunch();
        break;
      case Action.Submission:
        method = Method.Submission;
        //details = Attack.getTypeOfPunch();
        break;
      case Action.Takedown:
        method = Method.KO_TKO;
        details = "From Takedown"
        //details = Attack.getTypeOfPunch();
        break;
    }
  }

  static getTypeOfPunch(): string {
    return "nista za sad";
  }

  renderAttackDiv(container: HTMLElement, currentState: StateOfFight) {
    throw new Error("Method not implemented.");
  }
}

