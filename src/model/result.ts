import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { Winner } from "../enums/WinnerEnum";

export class Result {
  winner: Winner;
  methodOfVictory: Method;
  roundOfVictory: Round;
}
