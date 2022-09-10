import { Observable, Subject } from "rxjs";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Opponent } from "../model/opponent";
import {
  renderDivs,
  renderElements,
  replaceContainer,
  selectElement,
  setLabel,
} from "../view/render";
import { findNewOpponentSub, restartGameSub, startGameSub, unsubscribeStartGameSub } from "./subscriptions";
import { CLASSES_OF_ELEMENTS, INITIAL } from "../constants";
import {
  createFindingOpponentElements,
  createOpponentPicksElements,
  createResultsElements,
  createTopElements,
  createYourPicksElements,
} from "../view/creatingElements";
import { Fight } from "../model/fight";
import { createControlFlowObs, createFindingOpponentObs, createRestartGameObs } from "./observables";

export function init() {
  let findingOpponentDiv = initFindingOpponentDiv();
  renderDivs(document.body, findingOpponentDiv);

  let controlStartGameOb$ = createControlFlowObs();
  let findingOpponent$ = createFindingOpponentObs(findingOpponentDiv, controlStartGameOb$);
  startGameSub(document.body, findingOpponentDiv, findingOpponent$, controlStartGameOb$);
}

export function startGame(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>,
  controlStartGameOb$: Subject<any>
) {
  let container: HTMLDivElement = initStartingContainer(host, findingOpponentDiv, opponent);
  let fightCard: Fight[] = [];

  unsubscribeStartGameSub(controlStartGameOb$);
  findNewOpponentSub(container, fightCard, findingOpponent$);

  let restartGameOb$ = createRestartGameObs(container);
  restartGameSub(container, fightCard, restartGameOb$, opponent);
}


export function restartGame(container: HTMLElement,fightCard: Fight[], opponent: Opponent) {
  resetTopDiv(opponent, container);
  resetGameDiv(container);
  fightCard = [];
}

function initStartingContainer(host: HTMLElement, findingOpponentDiv: HTMLDivElement, opponent: Opponent) {
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

  let topElements = createTopElements(findingOpponentDiv, opponent);

  renderElements(topDiv, ...topElements);
  setResultForBoth(INITIAL.SCORE, topDiv);
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

export function setResult(
  score: number,
  placeHolder: HTMLElement,
  selection: string
) {
  let label = selectElement(placeHolder, selection);
  setLabel(label, score.toString());
}

export function setResultForBoth(score: number, placeHolder: HTMLElement) {
  setResult(score, placeHolder, CLASSES_OF_ELEMENTS.YOUR_POINTS);
  setResult(score, placeHolder, CLASSES_OF_ELEMENTS.OPP_POINTS);
}

export function setOpponent(opponent: Opponent, container: HTMLElement) {
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
  let select = findingOpponentDiv.querySelector("select");
  let difficultyString = select.options[select.selectedIndex].value;
  return DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
}

export function resetGameDiv(container: HTMLElement){
  let yourFightCardDiv = selectElement(
    container,
    CLASSES_OF_ELEMENTS.YOUR_FIGHTCARD_DIV
  );
  resetDiv(yourFightCardDiv);
  let opponentFightCardDiv = selectElement(
    container,
    CLASSES_OF_ELEMENTS.OPP_FIGHTCARD_DIV
  );
  resetDiv(opponentFightCardDiv);
  let resultFightCardDiv = selectElement(
    container,
    CLASSES_OF_ELEMENTS.RESULT_FIGHTCARD_DIV
  );
  resetDiv(resultFightCardDiv);
}

function resetDiv(container: HTMLElement) {
  let childs = container.childNodes;
  childs.forEach((child) => {
    container.removeChild(child);
    child.remove();
  });
}

function resetTopDiv(opponent: Opponent, container: HTMLElement) {
  setOpponent(opponent, container);
  setResultForBoth(INITIAL.SCORE, container);
}