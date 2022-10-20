import { Observable, Subject } from "rxjs";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Opponent } from "../model/opponent";
import {
  clearChilds,
  setSelectOptions,
  selectElement,
  selectPicture,
  selectSelectionEl,
  setLabel,
  setPicture,
  clearSelect,
  renderDivs,
  showError,
  getSelectedValue,
  enableElement,
  disableMultipleElements,
  enableMultipleElements,
  putElementInOrder,
  disableElement,
} from "../view/view";
import { ELEMENTS, FIGHTER, SCORE } from "../environment";
import { FightCard } from "../model/fightCard";
import { WeightClass } from "../enums/WeightClassEnum";
import { Fighter } from "../model/fighter";
import {
  initRestartingGameObs,
  initFindingNewOpponentObs,
  initChangeFighterObs,
  initLoadInitialFightersObs,
  initChangeWeightClassObs,
  initFindingOponnentObs,
  initGameObs,
} from "./streams/initalizing.observables";
import {
  initContainer,
  initFindingOpponentDiv,
} from "../view/initalizing.elements";
import { max } from "date-fns";

export function initLogic(): void {
  let findingOpponentDiv = initFindingOpponentDiv();
  renderDivs(document.body, findingOpponentDiv);

  initFindingOponnentObs(findingOpponentDiv);
}

export function startGameLogic(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>,
  controlFindingOpponentOb$: Subject<any>
): void {
  let fightCard: FightCard = new FightCard();
  let container: HTMLDivElement;

  container = initContainer(host, findingOpponentDiv, opponent);
  initRestartingGameObs(container, fightCard);
  initFindingNewOpponentObs(
    controlFindingOpponentOb$,
    container,
    fightCard,
    findingOpponent$
  );
  initChangeWeightClassObs(container);
  initChangeFighterObs(container);
  initLoadInitialFightersObs(container);
  initGameObs(container, fightCard);
  //initPlayAgainObs(container, fightCard);

  showHomeDiv(container);
  disableElement(container, ELEMENTS.PLAY_BTN);
}

export function findNewOpponentLogic(
  container: HTMLElement,
  fightCard: FightCard,
  opponent: Opponent
): void {
  updateTopDiv(opponent, container);
  resetGameDiv(container);

  fightCard.reset();
  fightCard.resetScore();

  disableMultipleElements(
    container,
    ELEMENTS.PLAY_BTN,
    ELEMENTS.PLAY_AGAIN_BTN
  );
  enableElement(container, ELEMENTS.ADD_PICK_BTN);
}

// export function playGameLogic(container: HTMLElement, fightCard: FightCard) {
//   fightCard.getResults();
//   fightCard.getOpponentPicks(container);

//   fightCard.calculateScores();
//   fightCard.setScores(container);

//   let resultFightCardDiv = selectElement(
//     container,
//     CLASSES.RESULT_FIGHTCARD_DIV
//   );
//   fightCard.createResultDivs();
//   fightCard.renderResults(resultFightCardDiv);

//   let opponentFightCardDiv = selectElement(
//     container,
//     CLASSES.OPP_FIGHTCARD_DIV
//   );
//   fightCard.createOpponentPickDivs();
//   fightCard.renderOpponentPicks(opponentFightCardDiv);

//   fightCard.renderScoresForEach();

//   disableMultipleElements(
//     container,
//     CLASSES.PLAY_BTN,
//     CLASSES.ADD_PICK_BTN,
//     CLASSES.FINDING_OPP_BTN,
//     CLASSES.RESTART_BTN
//   );
//   enableElement(container, CLASSES.PLAY_AGAIN_BTN);
// }

export function initLiveScoreLogic(
  fightCard: FightCard,
  container: HTMLDivElement
) {
  disableMultipleElements(container, ELEMENTS.ADD_PICK_BTN, ELEMENTS.PLAY_BTN);
  showLiveDiv(container);
  fightCard.renderCurrentFight(container, fightCard.getCurrentFightNumber());
}

export function tickingTimerLogic(
  container: HTMLElement,
  fightCard: FightCard
) {
  if (fightCard.isInProgress()) {
    let currentFight = fightCard.getCurrentFight();
    currentFight.tickSecond(container, fightCard);
  }
}

export function playAgainLogic(
  container: HTMLElement,
  fightCard: FightCard
): void {
  resetGameDiv(container);

  fightCard.reset();

  enableMultipleElements(
    container,
    ELEMENTS.FINDING_OPP_BTN,
    ELEMENTS.RESTART_BTN,
    ELEMENTS.ADD_PICK_BTN
  );
  disableMultipleElements(
    container,
    ELEMENTS.PLAY_BTN,
    ELEMENTS.PLAY_AGAIN_BTN
  );
}

export function restartGameLogic(
  container: HTMLElement,
  fightCard: FightCard
): void {
  resetTopDiv(container);
  resetGameDiv(container);

  fightCard.reset();
  fightCard.resetScore();

  disableMultipleElements(
    container,
    ELEMENTS.PLAY_BTN,
    ELEMENTS.PLAY_AGAIN_BTN
  );
  enableElement(container, ELEMENTS.ADD_PICK_BTN);
}

// export function tickTimer(container: HTMLDivElement, fightCard: FightCard) {
//   let currentFight = fightCard.getCurrentFight();
//   currentFight.tickSecond();
//   if(currentFight.isOver()){

//   }
// }

export function checkAddingPick(
  container: HTMLDivElement,
  fightCard: FightCard
): boolean {
  if (fightCard.fights.length == 10) {
    return showError("You cannot add more than 10 fights on fight card!");
  }

  const blueCornerValue = getSelectedValue(container, ELEMENTS.BLUE_CORNER_SEL);
  const redCornerValue = getSelectedValue(container, ELEMENTS.RED_CORNER_SEL);
  if (blueCornerValue === redCornerValue) {
    return showError("Please select two different fighters!");
  }
  let duplicate: boolean;
  fightCard.fights.forEach((fight) => {
    let blueCornerPreviousValue = fight.blueCorner.id.toString();
    let redCornerPreviousValue = fight.redCorner.id.toString();

    if (
      (blueCornerPreviousValue === blueCornerValue &&
        redCornerPreviousValue === redCornerValue) ||
      (blueCornerPreviousValue === redCornerValue &&
        redCornerPreviousValue === blueCornerValue)
    ) {
      duplicate = true;
    }
  });
  if (duplicate == true) {
    return showError("You already have that fight on your fight card!");
  }

  let selectedRadio: HTMLInputElement = document.querySelector(
    `input[name=${ELEMENTS.CORNER_RADIO}]:checked`
  );
  if (!selectedRadio) {
    return showError("Please select winner! ");
  }

  enableElement(container, ELEMENTS.PLAY_BTN);
  return true;
}

export function setScore(
  score: number,
  placeHolder: HTMLElement,
  selection: string
): void {
  let label = selectElement(placeHolder, selection);
  setLabel(label, score.toString());
}

export function setScoreForBoth(score: number, placeHolder: HTMLElement): void {
  setScore(score, placeHolder, ELEMENTS.YOUR_POINTS);
  setScore(score, placeHolder, ELEMENTS.OPP_POINTS);
}

export function setOpponent(opponent: Opponent, container: HTMLElement): void {
  let opponentPicture: HTMLImageElement = selectPicture(
    container,
    ELEMENTS.OPP_PICTURE
  );
  setPicture(opponentPicture, opponent.pictureSrc);

  let opponentNameLabel = selectElement(container, ELEMENTS.OPP_NAME_LABEL);
  setLabel(opponentNameLabel, `${opponent.name}`);
  let opponentDifficultyLabel = selectElement(
    container,
    ELEMENTS.OPP_DIFF_LABEL
  );
  setLabel(opponentDifficultyLabel, `${opponent.difficulty}`);
}

export function getRandomOpponent(opponents: Opponent[]): Opponent {
  const index = Math.trunc(Math.random() * opponents.length);
  return opponents[index];
}

export function getDifficulties(
  findingOpponentDiv: HTMLDivElement
): DifficultyLevel {
  let difficultyString = getSelectedValue(
    findingOpponentDiv,
    ELEMENTS.DIFFIULTY_SEL
  );
  return DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
}

export function getWeightClasses(container: HTMLDivElement): WeightClass {
  let weightClassString = getSelectedValue(
    container,
    ELEMENTS.WEIGHT_CLASS_SEL
  );
  return WeightClass[weightClassString as keyof typeof WeightClass];
}

export function getFighterId(
  container: HTMLDivElement,
  selection: string
): number {
  let fighterId = parseInt(getSelectedValue(container, selection));
  return fighterId;
}

export function getByProbability(percents: number[], ...objects: any[]): any {
  let max: number = 0;
  percents.forEach((percent) => (max += percent));
  let drawnNumber = Math.floor(Math.random() * max);

  let currentPercent: number = 0;
  let nextPercent: number = 0;
  let drawnObject;

  objects.forEach((objekat, index) => {
    currentPercent = nextPercent;
    nextPercent += percents[index];
    if (drawnNumber > currentPercent && drawnNumber <= nextPercent) {
      drawnObject = objekat;
    }
  });

  return drawnObject;
}

export function getRandomNumberTo(to: number): number {
  return Math.random() * to;
}

export function getRandomNumberRange(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from) + from);
}

export function resetGameDiv(container: HTMLElement): void {
  let yourFightCardDiv = selectElement(container, ELEMENTS.YOUR_FIGHTCARD_DIV);
  clearChilds(yourFightCardDiv);
  let opponentFightCardDiv = selectElement(
    container,
    ELEMENTS.OPP_FIGHTCARD_DIV
  );
  clearChilds(opponentFightCardDiv);
  let resultFightCardDiv = selectElement(
    container,
    ELEMENTS.RESULT_FIGHTCARD_DIV
  );
  clearChilds(resultFightCardDiv);
}

export function updateTopDiv(opponent: Opponent, container: HTMLElement): void {
  setOpponent(opponent, container);
  setScoreForBoth(SCORE.INITIAL, container);
}

export function resetTopDiv(container: HTMLElement): void {
  setScoreForBoth(SCORE.INITIAL, container);
}

export function fillFightersSelect(
  container: HTMLDivElement,
  fightersArray: Fighter[]
): void {
  let blueCornerSelect = selectSelectionEl(container, ELEMENTS.BLUE_CORNER_SEL);
  let redCornerSelect = selectSelectionEl(container, ELEMENTS.RED_CORNER_SEL);
  clearSelect(blueCornerSelect);
  clearSelect(redCornerSelect);

  let namesOfFigters: string[] = [];
  let idsOfFighters: string[] = [];

  fightersArray.forEach((fighter) => {
    namesOfFigters.push(fighter.name);
    idsOfFighters.push(fighter.id.toString());
  });

  setSelectOptions(blueCornerSelect, namesOfFigters, idsOfFighters);
  setSelectOptions(redCornerSelect, namesOfFigters, idsOfFighters);

  let fighter = initFighterFromArray(fightersArray, FIGHTER.INDEX.INITIAL);

  fillFightersRating(container, fighter, ELEMENTS.BLUE_CORNER_DIV);
  fillFightersRating(container, fighter, ELEMENTS.RED_CORNER_DIV);
}

export function fillFightersRating(
  container: HTMLDivElement,
  fighter: Fighter,
  selection: string
): void {
  let fighterDiv: HTMLElement = selectElement(container, selection);

  let standupRating: HTMLElement = selectElement(
    fighterDiv,
    ELEMENTS.STANDUP_LAB
  );
  setLabel(standupRating, fighter.standup.toString());
  let grapplingRating: HTMLElement = selectElement(
    fighterDiv,
    ELEMENTS.GRAPPLING_LAB
  );
  setLabel(grapplingRating, fighter.grappling.toString());
  let overallRating: HTMLElement = selectElement(
    fighterDiv,
    ELEMENTS.OVERALL_LAB
  );
  setLabel(overallRating, fighter.calcOverall().toString());
}

export function initFighterFromArray(
  fightersArray: Fighter[],
  index: number
): Fighter {
  return new Fighter(
    fightersArray[index].id,
    fightersArray[index].name,
    fightersArray[index].weightClass,
    fightersArray[index].standup,
    fightersArray[index].grappling
  );
}

export function showHomeDiv(container: HTMLElement) {
  enableElement(container, ELEMENTS.HOME_DIV);
  disableElement(container, ELEMENTS.LIVE_DIV);
  putElementInOrder(
    container,
    ELEMENTS.HOME_DIV,
    ELEMENTS.LIVE_DIV,
    ELEMENTS.ORDER.FIRST,
    ELEMENTS.ORDER.SECOND
  );
}

export function showLiveDiv(container: HTMLDivElement) {
  enableElement(container, ELEMENTS.LIVE_DIV);
  disableElement(container, ELEMENTS.HOME_DIV);
  putElementInOrder(
    container,
    ELEMENTS.LIVE_DIV,
    ELEMENTS.HOME_DIV,
    ELEMENTS.ORDER.FIRST,
    ELEMENTS.ORDER.SECOND
  );
}
