import {
  CLASSES,
  INITIAL,
  OPPONENT_PERCENT,
  ROUND_PERCENT,
} from "../constants";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { Winner } from "../enums/WinnerEnum";
import { initFightDiv } from "../view/initalizingElements";
import { getSelectedValue, selectElement } from "../view/view";
import { Fighter } from "./fighter";
import { Result } from "./result";

export class Fight {
  blueCorner: Fighter;
  redCorner: Fighter;

  yourPick: Result;
  opponentPick: Result;
  result: Result;

  yourScore: number = INITIAL.SCORE;
  opponentScore: number = INITIAL.SCORE;

  yourFightDiv: HTMLDivElement;
  opponentFightDiv: HTMLDivElement;
  resultFightDiv: HTMLDivElement;

  setFighters(
    blueCorner: Fighter,
    redCorner: Fighter,
    container: HTMLDivElement
  ) {
    if (this.checkIdsOfFighters(blueCorner, redCorner, container)) {
      this.blueCorner = redCorner;
      this.redCorner = blueCorner;
      console.log("greska");
    } else {
      this.blueCorner = blueCorner;
      this.redCorner = redCorner;
    }
  }

  checkIdsOfFighters(
    blueCorner: Fighter,
    redCorner: Fighter,
    container: HTMLDivElement
  ) {
    const blueCornerId = getSelectedValue(container, CLASSES.BLUE_CORNER_SEL);
    const redCornerId = getSelectedValue(container, CLASSES.RED_CORNER_SEL);
    if (
      blueCorner.id === parseInt(redCornerId) &&
      redCorner.id === parseInt(blueCornerId)
    ) {
      return true;
    }
  }

  setYourPick(yourPick: Result) {
    this.yourPick = yourPick;
  }

  setOpponentPick(opponentPick: Result) {
    this.opponentPick = opponentPick;
  }

  setResult(finalResult: Result) {
    this.result = finalResult;
  }

  createYourFightDiv() {
    this.yourFightDiv = initFightDiv(
      this,
      CLASSES.YOUR_FIGHT_DIV,
      this.yourPick
    );
  }

  createOpponentFightDiv() {
    this.opponentFightDiv = initFightDiv(
      this,
      CLASSES.OPP_FIGHT_DIV,
      this.opponentPick
    );
  }

  createResultFightDiv() {
    this.resultFightDiv = initFightDiv(
      this,
      CLASSES.RESULT_FIGHT_DIV,
      this.result
    );
  }

  getResult() {
    let winner: Winner = this.determineWinner();

    let method: Method = this.determineMethod(winner);

    let round: Round;
    if (method === Method.Decision) {
      round = Round.Round_3;
    } else {
      round = this.determineRound();
    }

    let result = new Result(winner.toString(), method.toString(), round.toString());
    this.setResult(result);
  }

  getOpponentPick(container: HTMLElement) {
    let difficultyString = selectElement(
      container,
      CLASSES.OPP_DIFF_LABEL
    ).innerHTML;
    let difficulty =
      DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];

    let winner: Winner = this.determineOpponentWinner(difficulty);

    let method: Method = this.determineOpponentMethod(difficulty);

    let round: Round;
    if (method === Method.Decision) {
      round = Round.Round_3;
    } else {
      round = this.determineOpponentRound(difficulty);
    }

    let opponentPick = new Result(winner.toString(), method.toString(), round.toString());
    this.setOpponentPick(opponentPick);
  }

  determineOpponentWinner(difficulty: DifficultyLevel): Winner {
    let correctWinner = this.result.winner;
    let faultyWinner;
    if (correctWinner === Winner.BLUE_CORNER) {
      faultyWinner = Winner.RED_CORNER;
    } else {
      faultyWinner = Winner.BLUE_CORNER;
    }

    let percentage: number = this.getPercentage(difficulty);

    let winner: Winner;
    let drawnNumber = Math.floor(Math.random() * OPPONENT_PERCENT.MAX);
    if (drawnNumber < percentage) {
      winner = correctWinner;
    } else {
      winner = faultyWinner;
    }

    return winner;
  }

  determineOpponentRound(difficulty: DifficultyLevel): Round {
    let correctRound = this.result.roundOfVictory;
    let faultyRound;
    if (correctRound === Round.Round_1) {
      faultyRound = Math.random() < 0.5 ? Round.Round_2 : Round.Round_3;
    } else if (correctRound === Round.Round_2) {
      faultyRound = Math.random() < 0.5 ? Round.Round_1 : Round.Round_3;
    } else {
      faultyRound = Math.random() < 0.5 ? Round.Round_1 : Round.Round_2;
    }

    let percentage: number = this.getPercentage(difficulty);

    let round: Round;
    let drawnNumber = Math.floor(Math.random() * OPPONENT_PERCENT.MAX);
    if (drawnNumber < percentage) {
      round = correctRound;
    } else {
      round = faultyRound;
    }

    return round;
  }

  determineOpponentMethod(difficulty: DifficultyLevel): Method {
    let correctMethod = this.result.methodOfVictory;
    let faultyMethod;
    if (correctMethod === Method.Decision) {
      faultyMethod = Math.random() < 0.5 ? Method.KO_TKO : Method.Submission;
    } else if (correctMethod === Method.KO_TKO) {
      faultyMethod = Math.random() < 0.5 ? Method.Decision : Method.Submission;
    } else {
      faultyMethod = Math.random() < 0.5 ? Method.Decision : Method.KO_TKO;
    }

    let percentage: number = this.getPercentage(difficulty);

    let method: Method;
    let drawnNumber = Math.floor(Math.random() * OPPONENT_PERCENT.MAX);
    if (drawnNumber < percentage) {
      method = correctMethod;
    } else {
      method = faultyMethod;
    }

    return method;
  }

  determineWinner(): Winner {
    let max = this.blueCorner.calcOverall() + this.redCorner.calcOverall();
    let drawnNumber = Math.floor(Math.random() * max);
    if (drawnNumber < this.blueCorner.calcOverall()) {
      return Winner.BLUE_CORNER;
    } else {
      return Winner.RED_CORNER;
    }
  }

  determineMethod(winnerEnum: Winner): Method {
    let winner: Fighter;
    if (winnerEnum === Winner.BLUE_CORNER) {
      winner = this.blueCorner;
    } else {
      winner = this.redCorner;
    }

    let max = winner.grappling + this.redCorner.standup + winner.calcOverall();
    let drawnNumber = Math.floor(Math.random() * max);
    if (drawnNumber < winner.grappling) {
      return Method.Submission;
    } else if (
      drawnNumber >= winner.grappling &&
      drawnNumber < winner.grappling + winner.standup
    ) {
      return Method.KO_TKO;
    } else {
      return Method.Decision;
    }
  }

  determineRound(): Round {
    let max = ROUND_PERCENT.MAX;
    let drawnNumber = Math.floor(Math.random() * max);
    if (drawnNumber < ROUND_PERCENT.FIRST) {
      return Round.Round_1;
    } else if (
      drawnNumber >= ROUND_PERCENT.SECOND &&
      drawnNumber < ROUND_PERCENT.THIRD
    ) {
      return Round.Round_2;
    } else {
      return Round.Round_3;
    }
  }

  private getPercentage(difficulty: DifficultyLevel) {
    let percentage: number;
    switch (difficulty) {
      case DifficultyLevel.Easy:
        percentage = OPPONENT_PERCENT.EASY;
        break;
      case DifficultyLevel.Medium:
        percentage = OPPONENT_PERCENT.MEDIUM;
        break;
      case DifficultyLevel.Hard:
        percentage = OPPONENT_PERCENT.HARD;
        break;
      default:
        break;
    }
    return percentage;
  }

  calculateScore(): void {
    this.yourScore = INITIAL.SCORE;
    if (this.yourPick.winner === this.result.winner) {
      this.yourScore += 10;
      if (this.yourPick.methodOfVictory === this.result.methodOfVictory) {
        if (this.yourPick.methodOfVictory === Method.Decision) {
          this.yourScore += 10;
        } else {
          this.yourScore += 5;
        }
        if (this.yourPick.roundOfVictory === this.result.roundOfVictory) {
          this.yourScore += 5;
        }
      }
    }

    this.opponentScore = INITIAL.SCORE;
    if (this.opponentPick.winner === this.result.winner) {
      this.opponentScore += 10;
      if (this.opponentPick.methodOfVictory === this.result.methodOfVictory) {
        if (this.opponentPick.methodOfVictory === Method.Decision) {
          this.opponentScore += 10;
        } else {
          this.opponentScore += 5;
        }
        if (this.opponentPick.roundOfVictory === this.result.roundOfVictory) {
          this.opponentScore += 5;
        }
      }
    }
  }
}
