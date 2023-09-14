import { RULES } from "../utilities/constants";

export enum Rules{
  MMA = "MMA",
  Boxing = "Boxing",
  Kickboxing = "Kickboxing",
  Grappling = "Grappling"
}

export function mapRulesToNumberOfRounds(rule: Rules): number {
  switch (rule) {
    case Rules.MMA:
      return RULES.NUMBER_OF_ROUNDS.MMA;
    case Rules.Boxing:
      return RULES.NUMBER_OF_ROUNDS.BOXING;
    case Rules.Kickboxing:
      return RULES.NUMBER_OF_ROUNDS.KICKBOXING;
    case Rules.Grappling:
      return RULES.NUMBER_OF_ROUNDS.GRAPPLING;
  }
}

export function mapRulesToRoundDuration(rule: Rules): number {
  switch (rule) {
    case Rules.MMA:
      return RULES.DURATION_OF_ROUND.MMA;
    case Rules.Boxing:
      return RULES.DURATION_OF_ROUND.BOXING;
    case Rules.Kickboxing:
      return RULES.DURATION_OF_ROUND.KICKBOXING;
    case Rules.Grappling:
      return RULES.DURATION_OF_ROUND.GRAPPLING;
  }
}