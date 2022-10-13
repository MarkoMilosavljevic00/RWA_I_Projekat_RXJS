import { add } from "date-fns";
import { CLASSES, MAP_KEYS, PERCENTS, RULES, SCORE } from "../../environment";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Method } from "../enums/MethodEnum";
import { Odds } from "../enums/OddEnum";
import { Round } from "../enums/RoundEnum";
import { Corner } from "../enums/FightersCorner";
import {
  initFightDiv,
  initPointsForEachDiv,
} from "../view/initalizing.elements";
import {
  getCurrentDifficulty,
  getSelectedValue,
  selectElement,
} from "../view/view";
import { FightCard } from "./fightCard";
import { Fighter } from "./fighter";
import { Result } from "./result";

export class Fight {
  blueCorner: Fighter;
  redCorner: Fighter;

  yourPick: Result;
  opponentPick: Result;
  finalResult: Result;

  yourScore: number = SCORE.INITIAL;
  opponentScore: number = SCORE.INITIAL;

  yourFightDiv: HTMLDivElement;
  opponentFightDiv: HTMLDivElement;
  resultFightDiv: HTMLDivElement;

  currentRound: Round = Round.Round_1;
  currentTime: Date = new Date(0);

  // getResult() {
  //   let winner: Corner = this.determineWinner();

  //   let method: Method = this.determineMethod(winner);

  //   let round: Round;
  //   if (method === Method.Decision) {
  //     round = Round.Round_3;
  //   } else {
  //     round = this.determineRound();
  //   }

  //   let result = new Result(
  //     winner.toString(),
  //     method.toString(),
  //     round.toString()
  //   );
  //   this.setResult(result);
  // }

  // getOpponentPick(container: HTMLElement) {
  //   let difficulty = getCurrentDifficulty(container);

  //   let winner: Corner = this.determineOpponentWinner(difficulty);

  //   let method: Method = this.determineOpponentMethod(difficulty);

  //   let round: Round;
  //   if (method === Method.Decision) {
  //     round = Round.Round_3;
  //   } else {
  //     round = this.determineOpponentRound(difficulty);
  //   }

  //   let opponentPick = new Result(
  //     winner.toString(),
  //     method.toString(),
  //     round.toString()
  //   );
  //   this.setOpponentPick(opponentPick);
  // }

  getOdds(): Map<string, Corner> {
    let odds = new Map<string, Corner>();
    let blueOverallWithDamage =
      this.blueCorner.calcOverall() + (100 - this.blueCorner.damagePercent);
    let redOverallWithDamage =
      this.redCorner.calcOverall() + (100 - this.redCorner.damagePercent);
    if (blueOverallWithDamage > redOverallWithDamage) {
      odds.set(MAP_KEYS.ODDS.FAVOURITE, Corner.BLUE_CORNER);
      odds.set(MAP_KEYS.ODDS.UNDERDOG, Corner.RED_CORNER);
    } else if (blueOverallWithDamage < redOverallWithDamage) {
      odds.set(MAP_KEYS.ODDS.FAVOURITE, Corner.RED_CORNER);
      odds.set(MAP_KEYS.ODDS.UNDERDOG, Corner.BLUE_CORNER);
    } else {
      odds.set(MAP_KEYS.ODDS.FAVOURITE, undefined);
      odds.set(MAP_KEYS.ODDS.UNDERDOG, undefined);
    }
    return odds;
  }

  setFighters(
    blueCorner: Fighter,
    redCorner: Fighter,
    container: HTMLDivElement
  ) {
    if (this.checkIdsOfFighters(blueCorner, redCorner, container) == false) {
      this.blueCorner = redCorner;
      this.redCorner = blueCorner;
    } else {
      this.blueCorner = blueCorner;
      this.redCorner = redCorner;
    }
  }

  setYourPick(yourPick: Result) {
    this.yourPick = yourPick;
  }

  setOpponentPick(container: HTMLElement) {
    let difficulty = getCurrentDifficulty(container);
    let winner: Corner = this.determineOpponentWinner(difficulty);
    let method: Method = this.determineOpponentMethod(difficulty);
    let round: Round;
    if (method === Method.Decision) {
      round = Round.Round_3;
    } else {
      round = this.determineOpponentRound(difficulty);
    }
    this.opponentPick = new Result(winner, method, round);
  }

  setResult(finalResult: Result) {
    this.finalResult = finalResult;
  }

  setFinalResult(method: Method, round: Round, winner?: Corner) {
    if (!winner) {
      winner = this.determineWinnerByDamage();
    }
    this.finalResult = new Result(winner, method, round);
  }

  tickSecond(container: HTMLElement, fightCard: FightCard) {
    this.currentTime = add(this.currentTime, { seconds: 1 });
    fightCard.renderCurrentRoundAndTime(container);
    if (this.checkIfIsOver(container)) {
      fightCard.nextFight(container);
    }
  }

  checkIfIsOver(container: HTMLElement) {
    if (
      this.currentTime.getMinutes() === RULES.MMA.ROUND_LENGTH.MINUTES &&
      this.currentTime.getSeconds() === RULES.MMA.ROUND_LENGTH.SECONDS
    ) {
      switch (this.currentRound) {
        case Round.Round_1:
          this.currentTime = new Date(0);
          this.currentRound = Round.Round_2;
          return false;
        case Round.Round_2:
          this.currentTime = new Date(0);
          this.currentRound = Round.Round_3;
          return false;
        case Round.Round_3:
          this.setFinalResult(Method.Decision, Round.Round_3);
          this.setOpponentPick(container);
          return true;
      }
    } else return false;
  }

  determineOpponentWinner(difficulty: DifficultyLevel): Corner {
    let correctWinner = this.finalResult.winner;
    let faultyWinner;
    if (correctWinner === Corner.BLUE_CORNER) {
      faultyWinner = Corner.RED_CORNER;
    } else {
      faultyWinner = Corner.BLUE_CORNER;
    }

    let percentage: number = this.getPercentage(difficulty);

    let winner: Corner;
    let drawnNumber = Math.floor(Math.random() * PERCENTS.OPP.MAX);
    if (drawnNumber < percentage) {
      winner = correctWinner;
    } else {
      winner = faultyWinner;
    }

    return winner;
  }

  determineOpponentRound(difficulty: DifficultyLevel): Round {
    let correctRound = this.finalResult.roundOfVictory;
    let faultyRound;
    if (correctRound === Round.Round_1) {
      faultyRound =
        Math.random() < PERCENTS.OPP.WRONG_CHOICE
          ? Round.Round_2
          : Round.Round_3;
    } else if (correctRound === Round.Round_2) {
      faultyRound =
        Math.random() < PERCENTS.OPP.WRONG_CHOICE
          ? Round.Round_1
          : Round.Round_3;
    } else {
      faultyRound =
        Math.random() < PERCENTS.OPP.WRONG_CHOICE
          ? Round.Round_1
          : Round.Round_2;
    }

    let percentage: number = this.getPercentage(difficulty);

    let round: Round;
    let drawnNumber = Math.floor(Math.random() * PERCENTS.OPP.MAX);
    if (drawnNumber < percentage) {
      round = correctRound;
    } else {
      round = faultyRound;
    }

    return round;
  }

  determineOpponentMethod(difficulty: DifficultyLevel): Method {
    let correctMethod = this.finalResult.methodOfVictory;
    let faultyMethod;
    if (correctMethod === Method.Decision) {
      faultyMethod =
        Math.random() < PERCENTS.OPP.WRONG_CHOICE
          ? Method.KO_TKO
          : Method.Submission;
    } else if (correctMethod === Method.KO_TKO) {
      faultyMethod =
        Math.random() < PERCENTS.OPP.WRONG_CHOICE
          ? Method.Decision
          : Method.Submission;
    } else {
      faultyMethod =
        Math.random() < PERCENTS.OPP.WRONG_CHOICE
          ? Method.Decision
          : Method.KO_TKO;
    }

    let percentage: number = this.getPercentage(difficulty);

    let method: Method;
    let drawnNumber = Math.floor(Math.random() * PERCENTS.OPP.MAX);
    if (drawnNumber < percentage) {
      method = correctMethod;
    } else {
      method = faultyMethod;
    }

    return method;
  }

  determineWinnerByDamage() {
    let blueCornerDamage = this.blueCorner.damagePercent;
    let redCornerDamage = this.redCorner.damagePercent;

    if (redCornerDamage < blueCornerDamage) {
      return Corner.RED_CORNER;
    } else {
      return Corner.BLUE_CORNER;
    }
  }

  determineWinner(): Corner {
    let max = this.blueCorner.calcOverall() + this.redCorner.calcOverall();
    let drawnNumber = Math.floor(Math.random() * max);
    if (drawnNumber < this.blueCorner.calcOverall()) {
      return Corner.BLUE_CORNER;
    } else {
      return Corner.RED_CORNER;
    }
  }

  determineMethod(winnerEnum: Corner): Method {
    let winner: Fighter;
    if (winnerEnum === Corner.BLUE_CORNER) {
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
    let max = PERCENTS.ROUND.MAX;
    let drawnNumber = Math.floor(Math.random() * max);
    if (drawnNumber <= PERCENTS.ROUND.FIRST) {
      return Round.Round_1;
    } else if (
      drawnNumber > PERCENTS.ROUND.FIRST &&
      drawnNumber <= PERCENTS.ROUND.SECOND
    ) {
      return Round.Round_2;
    } else {
      return Round.Round_3;
    }
  }

  getPercentage(difficulty: DifficultyLevel) {
    let percentage: number;
    switch (difficulty) {
      case DifficultyLevel.Easy:
        percentage = PERCENTS.OPP.EASY;
        break;
      case DifficultyLevel.Medium:
        percentage = PERCENTS.OPP.MEDIUM;
        break;
      case DifficultyLevel.Hard:
        percentage = PERCENTS.OPP.HARD;
        break;
      default:
        break;
    }
    return percentage;
  }

  calculateScores(): void {
    this.calculateYourScore();
    this.calculateOpponentScore();
  }

  calculateYourScore(): void {
    this.yourScore = SCORE.INITIAL;
    if (this.yourPick.winner === this.finalResult.winner) {
      this.yourScore += 10;
      if (this.yourPick.methodOfVictory === this.finalResult.methodOfVictory) {
        if (this.yourPick.methodOfVictory === Method.Decision) {
          this.yourScore += 10;
          return;
        } else {
          this.yourScore += 5;
        }
        if (this.yourPick.roundOfVictory === this.finalResult.roundOfVictory) {
          this.yourScore += 5;
        }
      }
    }
  }

  calculateOpponentScore(): void {
    this.opponentScore = SCORE.INITIAL;
    if (this.opponentPick.winner === this.finalResult.winner) {
      this.opponentScore += 10;
      if (
        this.opponentPick.methodOfVictory === this.finalResult.methodOfVictory
      ) {
        if (this.opponentPick.methodOfVictory === Method.Decision) {
          this.opponentScore += 10;
          return;
        } else {
          this.opponentScore += 5;
        }
        if (
          this.opponentPick.roundOfVictory === this.finalResult.roundOfVictory
        ) {
          this.opponentScore += 5;
        }
      }
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
      return false;
    } else return true;
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
      this.finalResult
    );
  }

  renderScores() {
    initPointsForEachDiv(this.yourFightDiv, this.yourScore);
    initPointsForEachDiv(this.opponentFightDiv, this.opponentScore);
  }
}
