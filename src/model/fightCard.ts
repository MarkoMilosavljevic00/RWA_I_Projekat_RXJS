import { CLASSES, FIGHTER, SCORE } from "../../environment";
import { setScore } from "../controller/logic";
import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import {
  renderDivs,
  printFightInStream,
  showDefeat,
  showDraw,
  showVictory,
  printRoundAndTime,
} from "../view/view";
import { Fight } from "./fight";
import { Result } from "./result";

export class FightCard {
  fights: Fight[];
  yourTotalScore: number = SCORE.INITIAL;
  opponentTotalScore: number = SCORE.INITIAL;

  currentFightIndex: number | undefined = undefined;

  constructor() {
    this.fights = [];
  }

  // getOpponentPicks(container: HTMLElement) {
  //   this.fights.forEach((fight) => {
  //     fight.getOpponentPick(container);
  //   });
  // }

  // getResults() {
  //   this.fights.forEach((fight) => {
  //     fight.getResult();
  //   });
  // }

  getCurrentFight(): Fight | undefined {
    if (this.isInProgress()) {
      return this.fights[this.currentFightIndex];
    } else {
      return undefined;
    }
  }

  setScores(container: HTMLElement) {
    setScore(this.yourTotalScore, container, CLASSES.YOUR_POINTS);
    setScore(this.opponentTotalScore, container, CLASSES.OPP_POINTS);
  }

  start() {
    if (this.fights.length !== 0) {
      this.currentFightIndex = FIGHTER.INDEX.INITIAL;
    }
  }

  reset() {
    this.fights = [];
    this.currentFightIndex = undefined;
  }

  resetScore() {
    this.yourTotalScore = SCORE.INITIAL;
    this.opponentTotalScore = SCORE.INITIAL;
  }

  isInProgress(): boolean {
    if (this.currentFightIndex !== undefined && this.currentFightIndex < this.fights.length) {
      return true;
    } else {
      return false;
    }
  }

  isOver(): boolean {
    if (this.currentFightIndex !== this.fights.length) {
      return true;
    } else {
      return false;
    }
  }

  nextFight(container: HTMLElement) {
    this.currentFightIndex++;
    if (this.currentFightIndex !== this.fights.length) {
      this.renderCurrentFight(container);
      this.renderCurrentRoundAndTime(container);
    } else {
      this.cardIsOver();
    }
  }

  cardIsOver() {
    throw new Error("Method not implemented.");
  }

  renderCurrentRoundAndTime(container: HTMLElement) {
    if (this.isInProgress()) {
      let currentFight = this.getCurrentFight();
      printRoundAndTime(container, currentFight.currentRound, currentFight.currentTime);
    } else {
      console.log("currentFightIndex je undefined");
    }
  }

  renderCurrentFight(container: HTMLElement) {
    if (this.isInProgress()) {
      let currentFight = this.getCurrentFight();
      printFightInStream(currentFight, container);
    } else {
      console.log("currentFightIndex je undefined");
    }
  }

  renderYourPicksDivs(container: HTMLElement) {
    this.fights.forEach((fight) => {
      if (!container.contains(fight.yourFightDiv)) {
        renderDivs(container, fight.yourFightDiv);
      }
    });
  }

  renderOpponentPicks(container: HTMLElement) {
    this.fights.forEach((fight) => {
      if (!container.contains(fight.opponentFightDiv)) {
        renderDivs(container, fight.opponentFightDiv);
      }
    });
  }

  renderResults(container: HTMLElement) {
    this.fights.forEach((fight) => {
      if (!container.contains(fight.resultFightDiv)) {
        renderDivs(container, fight.resultFightDiv);
      }
    });
  }

  renderScoresForEach() {
    this.fights.forEach((fight) => {
      fight.renderScores();
    });
  }

  createResultDivs() {
    this.fights.forEach((fight) => fight.createResultFightDiv());
  }

  createOpponentPickDivs() {
    this.fights.forEach((fight) => fight.createOpponentFightDiv());
  }

  calculateScores() {
    let yourNewScore: number = SCORE.INITIAL;
    let opponentNewScore: number = SCORE.INITIAL;
    this.fights.forEach((fight) => {
      fight.calculateScores();
      yourNewScore += fight.yourScore;
      opponentNewScore += fight.opponentScore;
    });

    this.yourTotalScore += yourNewScore;
    this.opponentTotalScore += opponentNewScore;
    this.showScores(yourNewScore, opponentNewScore);
  }

  showScores(yourNewScore: number, opponentNewScore: number) {
    if (yourNewScore > opponentNewScore) {
      showVictory(yourNewScore, opponentNewScore);
    } else if (yourNewScore < opponentNewScore) {
      showDefeat(yourNewScore, opponentNewScore);
    } else {
      showDraw(yourNewScore, opponentNewScore);
    }
  }
}