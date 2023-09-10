import { Corner } from "../enums/corner.enum";
import { DifficultyLevel } from "../enums/difficulty-level.enum";
import { Method } from "../enums/method.enum";
import { mapRulesToNumberOfRounds, Rules } from "../enums/rules.enum";
import { PROBABILITY } from "../utilities/constants";
import { getRandomValueWithProbability } from "../utilities/helpers";
import { Result } from "./result";

export class Opponent {
    id: number;
    name: string;
    difficulty: DifficultyLevel;
    pictureSrc: string;

    constructor(id: number, name: string, difficulty:DifficultyLevel, pictureSrc: string){
      this.id = id;
      this.name = name;
      this.difficulty = difficulty;
      this.pictureSrc = pictureSrc;
    }

    mapDifficultyToProbability(difficulty: DifficultyLevel){
      const probabilityMap = {
        Easy: PROBABILITY.DIFFICULTY.EASY,
        Medium: PROBABILITY.DIFFICULTY.MEDIUM,
        Hard: PROBABILITY.DIFFICULTY.HARD,
      };
      return probabilityMap[difficulty];
    }

    getPick(finalResult: Result, rules: Rules):Result {
      let probability = this.mapDifficultyToProbability(this.difficulty);
      let winner = finalResult.winner;
      let method = finalResult.method;
      let round = finalResult.round;

      let winnerValues = Object.values(Corner);
      let methodValues = Object.values(Method);
      let roundValues = Array.from({ length: mapRulesToNumberOfRounds(rules) }, (_, i) => i + 1);

      let opponentsWinner = getRandomValueWithProbability<Corner>(winnerValues, winner, probability);
      let opponentsMethod = getRandomValueWithProbability<Method>(methodValues, method, probability);
      let opponentsRound: number;
      if(opponentsMethod !== Method.Decision)
        opponentsRound = getRandomValueWithProbability<number>(roundValues, round, probability);
      else
        opponentsRound = 0;

      return {
        winner: opponentsWinner,
        method: opponentsMethod,
        round: opponentsRound
      }
    }
}
