import {
  getByProbability,
  getRandomNumberRange,
  getRandomNumberTo,
} from "../controller/logic";
import { FightPosition } from "../enums/FightPositionEnum";
import { Rules } from "../enums/RulesEnum";
import { TypeOfAction } from "../enums/ActionEnum";
import { ATTACK, RULES } from "../environment";
import { Fight } from "./fight";
import { Fighter } from "./fighter";

export class Attack {
  attacker: Fighter;
  defender: Fighter;

  attackerDamage: number;
  defenderDamage: number;

  type: TypeOfAction;
  success: boolean;

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
  }

  getAttacker(
    blueCorner: Fighter,
    redCorner: Fighter,
    currentPosition: FightPosition
  ): Fighter {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [
          blueCorner.calcOverall() + blueCorner.standup / 2,
          redCorner.calcOverall() + redCorner.standup / 2,
        ],
        blueCorner,
        redCorner
      );
    } else {
      return getByProbability(
        [
          blueCorner.calcOverall() + blueCorner.grappling / 2,
          redCorner.calcOverall() + redCorner.grappling / 2,
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

  getTypeOfAttack(rules: Rules, currentPosition: FightPosition): TypeOfAction {
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

  getMMAAttack(currentPosition: FightPosition): TypeOfAction {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [this.attacker.standup, this.attacker.grappling],
        TypeOfAction.Punch,
        getByProbability(
          [
            RULES.MMA.PERCENT.TO_TRY.FROM_STANDUP.TAKEDOWN,
            RULES.MMA.PERCENT.TO_TRY.FROM_STANDUP.SUBMISSION,
          ],
          TypeOfAction.Takedown,
          TypeOfAction.Submission
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
            TypeOfAction.Punch,
            TypeOfAction.Stand
          ),
          getByProbability(
            [
              RULES.MMA.PERCENT.TO_TRY.FROM_GROUND.PUNCH,
              RULES.MMA.PERCENT.TO_TRY.FROM_GROUND.SUBMISSION,
            ],
            TypeOfAction.Punch,
            TypeOfAction.Submission
          )
        );
      }
    }
  }

  getStandUpAttack(): TypeOfAction {
    return TypeOfAction.Punch;
  }

  getGrapplingAttack(currentPosition: FightPosition): TypeOfAction {
    if (currentPosition === FightPosition.StandUp) {
      return getByProbability(
        [
          RULES.GRAPPLING.PERCENT.FROM_STANDUP.TAKEDOWN,
          RULES.GRAPPLING.PERCENT.FROM_STANDUP.SUBMISSION,
        ],
        TypeOfAction.Takedown,
        TypeOfAction.Submission
      );
    } else {
      if (currentPosition === FightPosition.Ground) {
        return getByProbability(
          [
            RULES.GRAPPLING.PERCENT.FROM_GROUND.SUBMISSION,
            RULES.GRAPPLING.PERCENT.FROM_GROUND.STAND,
          ],
          TypeOfAction.Submission,
          TypeOfAction.Stand
        );
      }
    }
  }

  getSuccesOfAttack(fight: Fight): boolean {
    switch (this.type) {
      case TypeOfAction.Punch:
        return this.getSuccesOfPunch(
          fight.getPosition(),
          this.attacker,
          this.defender
        );
      case TypeOfAction.Submission:
        return this.getSuccesOfSubmission(
          fight.getPosition(),
          this.attacker,
          this.defender
        );
      case TypeOfAction.Takedown:
        let successOfTakedown = this.getSuccesOfTakedown(
          this.attacker,
          this.defender
        );
        if (successOfTakedown) fight.setPosition(FightPosition.Ground);
        return successOfTakedown;
      case TypeOfAction.Stand:
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
      advantage = getRandomNumberTo((attackerSkill - defenderSkill) / 2);
    }
    return advantage;
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
    typeOfAction: TypeOfAction
  ) {
    switch (typeOfAction) {
      case TypeOfAction.Punch:
        this.setDamages(
          standUpAdvantage,
          ATTACK.DAMAGE.FROM_STANDUP.CLEAR_PUNCH,
          ATTACK.DAMAGE.FROM_STANDUP.BLOCKED_PUNCH.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_STANDUP.BLOCKED_PUNCH.OPP_DAMAGE
        );
        break;
      case TypeOfAction.Submission:
        this.setDamages(
          groundAdvantage,
          0,
          ATTACK.DAMAGE.FROM_STANDUP.UNSUCCESSFUL_SUBMISSION.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_STANDUP.UNSUCCESSFUL_SUBMISSION.OPP_DAMAGE
        );
        break;
      case TypeOfAction.Takedown:
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
    typeOfAction: TypeOfAction
  ) {
    switch (typeOfAction) {
      case TypeOfAction.Punch:
        this.setDamages(
          standUpAdvantage + groundAdvantage,
          ATTACK.DAMAGE.FROM_GROUND.CLEAR_PUNCH,
          ATTACK.DAMAGE.FROM_GROUND.BLOCKED_PUNCH.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_GROUND.BLOCKED_PUNCH.OPP_DAMAGE
        );
        break;
      case TypeOfAction.Submission:
        this.setDamages(
          groundAdvantage,
          0,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_SUBMISSION.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_SUBMISSION.OPP_DAMAGE
        );
        break;
      case TypeOfAction.Stand:
        this.setDamages(
          groundAdvantage,
          0,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_STANDING.SELF_DAMAGE,
          ATTACK.DAMAGE.FROM_GROUND.UNSUCCESSFUL_STANDING.OPP_DAMAGE,
        );
        break;
    }
  }
}
