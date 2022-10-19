import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { Corner } from "../enums/CornerEnum";

export class Result {
  winner: Corner;
  methodOfVictory: Method;
  roundOfVictory: Round;

  // constructor(winner: string, method: string, round: string) {
  //   this.winner = Corner[winner as keyof typeof Corner];
  //   this.methodOfVictory = Method[method as keyof typeof Method];
  //   this.roundOfVictory = Round[round as keyof typeof Round];
  // }

  constructor(winner: Corner, method: Method, round: Round) {
    this.winner = winner;
    this.methodOfVictory = method;
    this.roundOfVictory = round;
  }
}
