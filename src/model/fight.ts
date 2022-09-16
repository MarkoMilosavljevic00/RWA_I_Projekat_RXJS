import { Fighter } from "./fighter";
import { Result } from "./result";

export class Fight {
  blueCorner: Fighter;
  redCorner: Fighter;

  yourPick: Result;
  opponentPick: Result;

  result: Result;

  //fighter$: Observable<Fighter[]>;
}
