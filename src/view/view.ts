import { CLASSES_OF_ELEMENTS } from "../constants";
import { Opponent } from "../models/opponent";
import { createFindingOpponentElements, createOpponentPicksElements, createResultsElements, createTopElements, createYourPicksElements } from "./creatingElements";
import { renderElements, setResult } from "./rendering";

export function initFindingOpponentDiv() {
  const findingOpponentDiv: HTMLDivElement = document.createElement("div");
  findingOpponentDiv.className = CLASSES_OF_ELEMENTS.INITIAL_DIV;

  let findingOpponentElements = createFindingOpponentElements();
  renderElements(findingOpponentDiv, ...findingOpponentElements);
  return findingOpponentDiv;
}

export function initTopDiv(findingOpponentDiv: HTMLDivElement, opponent: Opponent) {
  let topDiv: HTMLDivElement = document.createElement("div");
  topDiv.className = CLASSES_OF_ELEMENTS.TOP_DIV;

  let topElements = createTopElements(findingOpponentDiv, opponent);
  renderElements(topDiv, ...topElements);
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
  resultDiv.className = CLASSES_OF_ELEMENTS.RESULTS_DIV;

  let resultElements = createResultsElements();
  renderElements(resultDiv, ...resultElements);
  return resultDiv;
}

