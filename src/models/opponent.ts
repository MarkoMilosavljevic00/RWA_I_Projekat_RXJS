import { Corner } from "../enums/corner.enum";
import { DifficultyLevel } from "../enums/difficulty-level.enum";
import { Method } from "../enums/method.enum";
import { Rules } from "../enums/rules.enum";
import { PROBABILITY, RULES } from "../utilities/constants";
import { getRandomValue, getRandomValueWithProbability } from "../utilities/helpers";
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

    getPick(finalResult: Result, rules: Rules):Result {
      let probability = PROBABILITY.DIFFICULTY[this.difficulty];
      let winner = finalResult.winner;
      let method = finalResult.method;
      let round = finalResult.round;

      let winnerValues = Object.values(Corner);
      let methodValues = Object.values(Method);
      let roundValues = Array.from({ length: RULES.NUMBER_OF_ROUNDS[rules] }, (_, i) => i + 1);

      let opponentsWinner = getRandomValueWithProbability<Corner>(winnerValues, winner, probability);
      let opponentsMethod = getRandomValueWithProbability<Method>(methodValues, method, probability);
      let opponentsRound: number;
      if(opponentsMethod !== Method.Decision)
        if(method === Method.Decision)
          opponentsRound = getRandomValue(roundValues);
        else
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
