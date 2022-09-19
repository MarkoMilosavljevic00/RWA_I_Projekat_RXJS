import { initFightDiv } from "../view/initalizingElements";
import { Fighter } from "./fighter";
import { Result } from "./result";

export class Fight {
  blueCorner: Fighter;
  redCorner: Fighter;

  yourPick: Result;
  opponentPick: Result;
  finalResult: Result;

  fightDiv: HTMLDivElement;

  setFighters(blueCorner: Fighter, redCorner: Fighter) {
    this.blueCorner = blueCorner;
    this.redCorner = redCorner;
  }

  setYourPick(yourPick: Result) {
    this.yourPick = yourPick;
  }

  setOpponentPick(opponentPick: Result) {
    this.opponentPick = opponentPick;
  }

  setFinalResult(finalResult: Result) {
    this.finalResult = finalResult;
  }

  createFightDiv() {
    this.fightDiv = initFightDiv(this);
  }
}
