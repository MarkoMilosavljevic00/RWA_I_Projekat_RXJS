import { RULES } from "../utilities/constants";
import { Method } from "./method.enum";

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
      return RULES.NUMBER_OF_ROUNDS.Boxing;
    case Rules.Kickboxing:
      return RULES.NUMBER_OF_ROUNDS.Kickboxing;
    case Rules.Grappling:
      return RULES.NUMBER_OF_ROUNDS.Grappling;
  }
}

export function mapRulesToRoundDuration(rule: Rules): number {
  switch (rule) {
    case Rules.MMA:
      return RULES.ROUND_DURATION.MMA;
    case Rules.Boxing:
      return RULES.ROUND_DURATION.Boxing;
    case Rules.Kickboxing:
      return RULES.ROUND_DURATION.Kickboxing;
    case Rules.Grappling:
      return RULES.ROUND_DURATION.Grappling;
  }
}


export function mapRulesToMethods(rule: Rules){
  const methodsMap = new Map<Rules, Method[]>();
  methodsMap.set(Rules.MMA, [Method.Decision, Method.KO_TKO, Method.Submission]);
  methodsMap.set(Rules.Boxing, [Method.Decision, Method.KO_TKO]);
  methodsMap.set(Rules.Kickboxing, [Method.Decision, Method.KO_TKO]);
  methodsMap.set(Rules.Grappling, [Method.Decision, Method.Submission]);
  return methodsMap.get(rule);
}