import { Observable, Subject } from "rxjs";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Opponent } from "../model/opponent";
import {
  renderDivs,
  renderElements,
  replaceContainer,
  setLabel,
} from "../view/render";
import {
  changeWeightClassSub,
  findNewOpponentSub,
  gameSub,
  restartGameSub,
  startGameSub
} from "./subscriptions";
import { CLASSES_OF_ELEMENTS, INITIAL } from "../constants";
import {
  createFindingOpponentElements,
  createNewPickElements,
  createOpponentPicksElements,
  createResultsElements,
  createTopElements,
  createYourPicksElements,
} from "../view/creatingElements";
import { Fight } from "../model/fight";
import {
  completeControlFlowObs,
  createControlFlowObs,
  createFindingOpponentObs,
  createButtonObs,
  //createGameObs,
  createSelectOptionObs,
  createChangeWeightClassObs,
} from "./observables";
import { FightCard } from "../model/fightCard";
import { WeightClass } from "../enums/WeightClassEnum";

export function startGame(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>,
  controlStartGameFindingOb$: Subject<any>
  ) {
  let fightCard: FightCard = new FightCard();
  let container: HTMLDivElement = initStartingContainer(
    host,
    findingOpponentDiv,
    opponent
  );
  
  completeControlFlowObs(controlStartGameFindingOb$);

  let restartGameOb$ = createButtonObs(container, CLASSES_OF_ELEMENTS.RESTART_BTN);
  restartGameSub(container,fightCard,restartGameOb$);
  findNewOpponentSub(container,fightCard,findingOpponent$);

  let changeWeightClassOb$ = createChangeWeightClassObs(container, CLASSES_OF_ELEMENTS.WEIGHT_CLASS_SEL);
  changeWeightClassSub(container, changeWeightClassOb$);
  //let gameOb$ = createGameObs(container, fightCard);
  //gameSub(gameOb$);
   

}

export function findNewOpponent(
  container: HTMLElement,
  fightCard: FightCard,
  opponent: Opponent
) {
  updateTopDiv(opponent, container);
  resetGameDiv(container);
  fightCard = new FightCard();
}

export function restartGame(
  container: HTMLElement,
  fightCard: FightCard
) {
  resetTopDiv(container);
  resetGameDiv(container);
  fightCard = new FightCard();
}

export function init() {
  let findingOpponentDiv = initFindingOpponentDiv();
  renderDivs(document.body, findingOpponentDiv);

  let controlStartGameFindingOb$ = createControlFlowObs();
  let findingOpponent$ = createFindingOpponentObs(
    findingOpponentDiv,
    controlStartGameFindingOb$
  );
  startGameSub(
    document.body,
    findingOpponentDiv,
    findingOpponent$,
    controlStartGameFindingOb$
  );
}

function initStartingContainer(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
) {
  let container: HTMLDivElement = document.createElement("div");
  container.className = container.className = CLASSES_OF_ELEMENTS.CONTAINER;

  replaceContainer(host, container, findingOpponentDiv);
  let topDiv = initTopDiv(findingOpponentDiv, opponent);
  let gameDiv = initGameDiv();
  renderDivs(container, topDiv, gameDiv);
  return container;
}

export function initFindingOpponentDiv() {
  const findingOpponentDiv: HTMLDivElement = document.createElement("div");
  findingOpponentDiv.className = CLASSES_OF_ELEMENTS.INITIAL_DIV;

  let findingOpponentElements = createFindingOpponentElements();
  renderElements(findingOpponentDiv, ...findingOpponentElements);
  return findingOpponentDiv;
}

export function initTopDiv(
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
) {
  let topDiv: HTMLDivElement = document.createElement("div");
  topDiv.className = CLASSES_OF_ELEMENTS.TOP_DIV;

  let topElements = createTopElements(findingOpponentDiv);

  renderElements(topDiv, ...topElements);
  setScoreForBoth(INITIAL.SCORE, topDiv);
  setOpponent(opponent, topDiv);
  return topDiv;
}

export function initGameDiv() {
  let gameDiv: HTMLDivElement = document.createElement("div");
  gameDiv.className = CLASSES_OF_ELEMENTS.GAME_DIV;

  let yourPicksDiv = initYourPicksDiv();
  let opponentPicksDiv = initOpponentPicksDiv();
  let resultsDiv = initResultsDiv();

  renderElements(gameDiv, yourPicksDiv, resultsDiv, opponentPicksDiv);
  return gameDiv;
}

export function initYourPicksDiv() {
  let yourPicksDiv: HTMLDivElement = document.createElement("div");
  yourPicksDiv.className = CLASSES_OF_ELEMENTS.YOUR_PICKS_DIV;

  let yourPicksElements = createYourPicksElements();
  renderElements(yourPicksDiv, ...yourPicksElements);
  return yourPicksDiv;
}

export function initNewPickDiv() {
  let newPickDiv = document.createElement("div");
  newPickDiv.className = CLASSES_OF_ELEMENTS.NEW_PICK_DIV;

  let newPickElements = createNewPickElements();
  renderElements(newPickDiv, ...newPickElements);

  return newPickDiv;
}

export function initOpponentPicksDiv() {
  let opponentPicksDiv: HTMLDivElement = document.createElement("div");
  opponentPicksDiv.className = CLASSES_OF_ELEMENTS.OPP_PICKS_DIV;

  let opponentPicksElements = createOpponentPicksElements();
  renderElements(opponentPicksDiv, ...opponentPicksElements);
  return opponentPicksDiv;
}

export function initResultsDiv() {
  let resultDiv: HTMLDivElement = document.createElement("div");
  resultDiv.className = CLASSES_OF_ELEMENTS.RESULT_DIV;

  let resultElements = createResultsElements();
  renderElements(resultDiv, ...resultElements);
  return resultDiv;
}

export function setScore(
  score: number,
  placeHolder: HTMLElement,
  selection: string
) {
  let label = selectElement(placeHolder, selection);
  setLabel(label, score.toString());
}

export function setScoreForBoth(score: number, placeHolder: HTMLElement) {
  setScore(score, placeHolder, CLASSES_OF_ELEMENTS.YOUR_POINTS);
  setScore(score, placeHolder, CLASSES_OF_ELEMENTS.OPP_POINTS);
}

export function setOpponent(opponent: Opponent, container: HTMLElement) {
  let opponentPicture: HTMLImageElement = selectPicture(
    container,
    CLASSES_OF_ELEMENTS.OPP_PICTURE
  );
  opponentPicture.src = `${opponent.pictureSrc}`;

  let opponentNameLabel = selectElement(
    container,
    CLASSES_OF_ELEMENTS.OPP_NAME_LABEL
  );
  opponentNameLabel.innerHTML = `Name: ${opponent.name}`;
  let opponentDifficultyLabel = selectElement(
    container,
    CLASSES_OF_ELEMENTS.OPP_DIFF_LABEL
  );
  opponentDifficultyLabel.innerHTML = `Difficulty: ${opponent.difficulty}`;
}

export function selectDifficulty(
  findingOpponentDiv: HTMLDivElement
): DifficultyLevel {
  let difficultyString = getOptionValue(findingOpponentDiv, CLASSES_OF_ELEMENTS.DIFFIULTY_SEL);
  return DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
}

export function selectWeightClass(container: HTMLDivElement): WeightClass {
  let weightClassString = getOptionValue(container, CLASSES_OF_ELEMENTS.WEIGHT_CLASS_SEL);
  return WeightClass[weightClassString as keyof typeof WeightClass];
}

export function selectElement(placeHolder: HTMLElement, selection: string){
  let element: HTMLElement = placeHolder.querySelector(`.${selection}`);
  return element;
}

export function selectPicture(placeHolder: HTMLElement, selection: string){
  let picture: HTMLImageElement = placeHolder.querySelector(`.${selection}`);
  return picture;
}

export function selectSelectionEl(
  container: HTMLDivElement,
  selection: string
) {
  let select: HTMLSelectElement = container.querySelector(`.${selection}`)
  return select
}

export function getOptionValue(
  container: HTMLDivElement,
  selection: string
) {
  let select: HTMLSelectElement = selectSelectionEl(container, selection);
  let value = select.options[select.selectedIndex].value;
  return value;
}

export function resetGameDiv(container: HTMLElement) {
  let yourFightCardDiv = selectElement(
    container,
    CLASSES_OF_ELEMENTS.YOUR_FIGHTCARD_DIV
  );
  clearChilds(yourFightCardDiv);
  let opponentFightCardDiv = selectElement(
    container,
    CLASSES_OF_ELEMENTS.OPP_FIGHTCARD_DIV
  );
  clearChilds(opponentFightCardDiv);
  let resultFightCardDiv = selectElement(
    container,
    CLASSES_OF_ELEMENTS.RESULT_FIGHTCARD_DIV
  );
  clearChilds(resultFightCardDiv);
}

export function clearChilds(container: HTMLElement) {
  let childs = container.childNodes;
  childs.forEach((child) => {
    container.removeChild(child);
    child.remove();
  });
}

function updateTopDiv(opponent: Opponent, container: HTMLElement) {
  setOpponent(opponent, container);
  setScoreForBoth(INITIAL.SCORE, container);
}

function resetTopDiv(container: HTMLElement) {
  setScoreForBoth(INITIAL.SCORE, container);
}

export function fillSelect(container: HTMLDivElement, selection: string, optionNames: string[], optionValues: string[]) {
  let select = selectElement(container, selection);
  
  optionValues.forEach((optionValue, index) => {
    let option = document.createElement("option");
    option.value = optionValue;
    option.innerHTML = optionNames[index];
    select.appendChild(option);
    });
};


