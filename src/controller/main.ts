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
  selectButton,
  enableElement,
  disableElement,
  disableMultipleElements,
  enableMultipleElements,
} from "../view/view";
import { CLASSES, INDEXES, INITIAL, ROUND_PERCENT } from "../constants";
import { FightCard } from "../model/fightCard";
import { WeightClass } from "../enums/WeightClassEnum";
import { Fighter } from "../model/fighter";
import {
  initRestartingGame,
  initFindingNewOpponent,
  initChangeFighter,
  initNewPick,
  initChangeWeightClass,
  initFindingOponnent,
  initGame,
  initPlayAgain,
} from "./streams/initalizingObs";
import {
  initContainer,
  initFindingOpponentDiv,
} from "../view/initalizingElements";

export function init(): void {
  let findingOpponentDiv = initFindingOpponentDiv();
  renderDivs(document.body, findingOpponentDiv);

  initFindingOponnent(findingOpponentDiv);
}

export function startGame(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>,
  controlFindingOpponentOb$: Subject<any>
): void {
  let fightCard: FightCard = new FightCard();
  let container: HTMLDivElement;

  container = initContainer(host, findingOpponentDiv, opponent);
  initRestartingGame(container, fightCard);
  initFindingNewOpponent(
    controlFindingOpponentOb$,
    container,
    fightCard,
    findingOpponent$
  );

  initChangeWeightClass(container);
  initChangeFighter(container);
  initNewPick(container);

  initGame(container, fightCard);
  initPlayAgain(container, fightCard);

  disableElement(container, CLASSES.PLAY_BTN);
  enableElement(container, CLASSES.ADD_PICK_BTN);
}

export function findNewOpponent(
  container: HTMLElement,
  fightCard: FightCard,
  opponent: Opponent
): void {
  updateTopDiv(opponent, container);
  resetGameDiv(container);

  fightCard.reset();
  fightCard.resetScore();

  disableMultipleElements(container, CLASSES.PLAY_BTN, CLASSES.PLAY_AGAIN_BTN);
  enableElement(container, CLASSES.ADD_PICK_BTN);
}

export function playAgain(container: HTMLElement, fightCard: FightCard): void {
  resetGameDiv(container);

  fightCard.reset();

  enableMultipleElements(
    container,
    CLASSES.FINDING_OPP_BTN,
    CLASSES.RESTART_BTN,
    CLASSES.ADD_PICK_BTN
  );
  disableMultipleElements(container, CLASSES.PLAY_BTN, CLASSES.PLAY_AGAIN_BTN);
}

export function restartGame(
  container: HTMLElement,
  fightCard: FightCard
): void {
  resetTopDiv(container);
  resetGameDiv(container);

  fightCard.reset();
  fightCard.resetScore();

  disableMultipleElements(container, CLASSES.PLAY_BTN, CLASSES.PLAY_AGAIN_BTN);
  enableElement(container, CLASSES.ADD_PICK_BTN);
}

export function playGame(container: HTMLElement, fightCard: FightCard) {
  fightCard.getResults();
  fightCard.getOpponentPicks(container);

  fightCard.calculateScores();
  fightCard.setScores(container);

  let resultFightCardDiv = selectElement(
    container,
    CLASSES.RESULT_FIGHTCARD_DIV
  );
  fightCard.createResultDivs();
  fightCard.renderResults(resultFightCardDiv);

  let opponentFightCardDiv = selectElement(
    container,
    CLASSES.OPP_FIGHTCARD_DIV
  );
  fightCard.createOpponentPickDivs();
  fightCard.renderOpponentPicks(opponentFightCardDiv);

  fightCard.renderScoresForEach();

  disableMultipleElements(
    container,
    CLASSES.PLAY_BTN,
    CLASSES.ADD_PICK_BTN,
    CLASSES.FINDING_OPP_BTN,
    CLASSES.RESTART_BTN
  );
  enableElement(container, CLASSES.PLAY_AGAIN_BTN);
}

export function checkAddingPick(
  container: HTMLDivElement,
  fightCard: FightCard
): boolean {
  if (fightCard.fights.length == 10) {
    return showError("You cannot add more than 10 fights on fight card!");
  }

  const blueCornerValue = getSelectedValue(container, CLASSES.BLUE_CORNER_SEL);
  const redCornerValue = getSelectedValue(container, CLASSES.RED_CORNER_SEL);
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
    `input[name=${CLASSES.CORNER_RADIO}]:checked`
  );
  if (!selectedRadio) {
    return showError("Please select winner! ");
  }

  enableElement(container, CLASSES.PLAY_BTN);
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
  setScore(score, placeHolder, CLASSES.YOUR_POINTS);
  setScore(score, placeHolder, CLASSES.OPP_POINTS);
}

export function setOpponent(opponent: Opponent, container: HTMLElement): void {
  let opponentPicture: HTMLImageElement = selectPicture(
    container,
    CLASSES.OPP_PICTURE
  );
  setPicture(opponentPicture, opponent.pictureSrc);

  let opponentNameLabel = selectElement(container, CLASSES.OPP_NAME_LABEL);
  setLabel(opponentNameLabel, `${opponent.name}`);
  let opponentDifficultyLabel = selectElement(
    container,
    CLASSES.OPP_DIFF_LABEL
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
    CLASSES.DIFFIULTY_SEL
  );
  return DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
}

export function getWeightClasses(container: HTMLDivElement): WeightClass {
  let weightClassString = getSelectedValue(container, CLASSES.WEIGHT_CLASS_SEL);
  return WeightClass[weightClassString as keyof typeof WeightClass];
}

export function getFighterId(
  container: HTMLDivElement,
  selection: string
): number {
  let fighterId = parseInt(getSelectedValue(container, selection));
  return fighterId;
}

export function resetGameDiv(container: HTMLElement): void {
  let yourFightCardDiv = selectElement(container, CLASSES.YOUR_FIGHTCARD_DIV);
  clearChilds(yourFightCardDiv);
  let opponentFightCardDiv = selectElement(
    container,
    CLASSES.OPP_FIGHTCARD_DIV
  );
  clearChilds(opponentFightCardDiv);
  let resultFightCardDiv = selectElement(
    container,
    CLASSES.RESULT_FIGHTCARD_DIV
  );
  clearChilds(resultFightCardDiv);
}

export function updateTopDiv(opponent: Opponent, container: HTMLElement): void {
  setOpponent(opponent, container);
  setScoreForBoth(INITIAL.SCORE, container);
}

export function resetTopDiv(container: HTMLElement): void {
  setScoreForBoth(INITIAL.SCORE, container);
}

export function fillFightersSelect(
  container: HTMLDivElement,
  fightersArray: Fighter[]
): void {
  let blueCornerSelect = selectSelectionEl(container, CLASSES.BLUE_CORNER_SEL);
  let redCornerSelect = selectSelectionEl(container, CLASSES.RED_CORNER_SEL);
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

  let fighter = initFighterFromArray(fightersArray, INDEXES.INITIAL_FIGHTER);

  fillFightersRating(container, fighter, CLASSES.BLUE_CORNER_DIV);
  fillFightersRating(container, fighter, CLASSES.RED_CORNER_DIV);
}

export function fillFightersRating(
  container: HTMLDivElement,
  fighter: Fighter,
  selection: string
): void {
  let fighterDiv: HTMLElement = selectElement(container, selection);

  let standupRating: HTMLElement = selectElement(
    fighterDiv,
    CLASSES.STANDUP_LAB
  );
  setLabel(standupRating, fighter.standup.toString());
  let grapplingRating: HTMLElement = selectElement(
    fighterDiv,
    CLASSES.GRAPPLING_LAB
  );
  setLabel(grapplingRating, fighter.grappling.toString());
  let overallRating: HTMLElement = selectElement(
    fighterDiv,
    CLASSES.OVERALL_LAB
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
