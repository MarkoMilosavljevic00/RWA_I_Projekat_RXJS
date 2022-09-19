import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { Winner } from "../enums/WinnerEnum";

export class Result {
  winner: Winner;
  methodOfVictory: Method;
  roundOfVictory: Round;

  constructor(winner: string, method: string, round: string){
    this.winner = Winner[winner as keyof typeof Winner];
    this.methodOfVictory = Method[method as keyof typeof Method];
    this.roundOfVictory = Round[round as keyof typeof Round];
  }
}
