import { CLASSES, INITIAL } from "../../environment";
import { setScore } from "../controller/main";
import {
  renderDivs,
  renderElements,
  showDefeat,
  showDraw,
  showVictory,
} from "../view/view";
import { Fight } from "./fight";

export class FightCard {
  fights: Fight[];
  yourTotalScore: number = INITIAL.SCORE;
  opponentTotalScore: number = INITIAL.SCORE;

  constructor() {
    this.fights = [];
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

  resetScore() {
    this.yourTotalScore = INITIAL.SCORE;
    this.opponentTotalScore = INITIAL.SCORE;
  }

  reset() {
    this.fights = [];
  }

  createResultDivs() {
    this.fights.forEach((fight) => fight.createResultFightDiv());
  }

  createOpponentPickDivs() {
    this.fights.forEach((fight) => fight.createOpponentFightDiv());
  }

  calculateScores() {
    let yourNewScore: number = INITIAL.SCORE;
    let opponentNewScore: number = INITIAL.SCORE;
    this.fights.forEach((fight) => {
      fight.calculateScores();
      yourNewScore += fight.yourScore;
      opponentNewScore += fight.opponentScore;
    });

    this.yourTotalScore += yourNewScore;
    this.opponentTotalScore += opponentNewScore;
    this.showScores(yourNewScore, opponentNewScore);
  }

  renderScoresForEach() {
    this.fights.forEach((fight) => {
      fight.renderScores();
    });
  }

  setScores(container: HTMLElement) {
    setScore(this.yourTotalScore, container, CLASSES.YOUR_POINTS);
    setScore(this.opponentTotalScore, container, CLASSES.OPP_POINTS);
  }

  private showScores(yourNewScore: number, opponentNewScore: number) {
    if (yourNewScore > opponentNewScore) {
      showVictory(yourNewScore, opponentNewScore);
    } else if (yourNewScore < opponentNewScore) {
      showDefeat(yourNewScore, opponentNewScore);
    } else {
      showDraw(yourNewScore, opponentNewScore);
    }
  }

  getOpponentPicks(container: HTMLElement) {
    this.fights.forEach((fight) => {
      fight.getOpponentPick(container);
    });
  }

  getResults() {
    this.fights.forEach((fight) => {
      fight.getResult();
    });
  }
}
