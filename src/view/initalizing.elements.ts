import { ELEMENTS, SCORE } from "../environment";
import { setOpponent, setScoreForBoth } from "../controller/logic";
import { Fight } from "../model/fight";
import { Opponent } from "../model/opponent";
import { Result } from "../model/result";
import {
  renderDivs,
  renderElements,
  replaceContainer,
} from "./view";
import {
  createFightElements,
  createFindingOpponentElements,
  createLiveElements,
  createNewPickElements,
  createOpponentPicksElements,
  createPointsForEachDiv,
  createResultsElements,
  createTopElements,
  createYourPicksElements
} from "./creating.elements";

export function initContainer(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
): HTMLDivElement {
  let container: HTMLDivElement = document.createElement("div");
  container.className = container.className = ELEMENTS.CONTAINER;

  replaceContainer(host, container, findingOpponentDiv);
  let topDiv = initTopDiv(findingOpponentDiv, opponent);
  let liveDiv = initLiveDiv();
  let gameDiv = initHomeDiv();
  renderDivs(container, topDiv, liveDiv, gameDiv);

  return container;
}

export function initFindingOpponentDiv(): HTMLDivElement {
  const findingOpponentDiv: HTMLDivElement = document.createElement("div");
  findingOpponentDiv.className = ELEMENTS.INITIAL_DIV;

  let findingOpponentElements = createFindingOpponentElements();
  renderElements(findingOpponentDiv, ...findingOpponentElements);
  return findingOpponentDiv;
}

export function initTopDiv(
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
): HTMLDivElement {
  let topDiv: HTMLDivElement = document.createElement("div");
  topDiv.className = ELEMENTS.TOP_DIV;

  let topElements = createTopElements(findingOpponentDiv);

  renderElements(topDiv, ...topElements);
  setScoreForBoth(SCORE.INITIAL, topDiv);
  setOpponent(opponent, topDiv);
  return topDiv;
}

export function initHomeDiv(): HTMLDivElement {
  let gameDiv: HTMLDivElement = document.createElement("div");
  gameDiv.className = ELEMENTS.HOME_DIV;

  let yourPicksDiv = initYourPicksDiv();
  let opponentPicksDiv = initOpponentPicksDiv();
  let resultsDiv = initResultsDiv();

  renderElements(gameDiv, yourPicksDiv, resultsDiv, opponentPicksDiv);
  return gameDiv;
}

export function initYourPicksDiv(): HTMLDivElement {
  let yourPicksDiv: HTMLDivElement = document.createElement("div");
  yourPicksDiv.className = ELEMENTS.YOUR_PICKS_DIV;

  let yourPicksElements = createYourPicksElements();
  renderElements(yourPicksDiv, ...yourPicksElements);
  return yourPicksDiv;
}

export function initNewPickDiv(): HTMLDivElement {
  let newPickDiv = document.createElement("div");
  newPickDiv.className = ELEMENTS.NEW_PICK_DIV;

  let newPickElements = createNewPickElements();
  renderElements(newPickDiv, ...newPickElements);

  return newPickDiv;
}

export function initOpponentPicksDiv(): HTMLDivElement {
  let opponentPicksDiv: HTMLDivElement = document.createElement("div");
  opponentPicksDiv.className = ELEMENTS.OPP_PICKS_DIV;

  let opponentPicksElements = createOpponentPicksElements();
  renderElements(opponentPicksDiv, ...opponentPicksElements);
  return opponentPicksDiv;
}

export function initResultsDiv(): HTMLDivElement {
  let resultDiv: HTMLDivElement = document.createElement("div");
  resultDiv.className = ELEMENTS.RESULT_DIV;

  let resultElements = createResultsElements();
  renderElements(resultDiv, ...resultElements);
  return resultDiv;
}

export function initFightDiv(
  fight: Fight,
  selection: string,
  result: Result
): HTMLDivElement {
  let fightDiv: HTMLDivElement = document.createElement("div");
  fightDiv.className = selection;

  let fightElements = createFightElements(fight, result);
  renderElements(fightDiv, ...fightElements);
  return fightDiv;
}

export function initPointsForEachDiv(
  fightDiv: HTMLDivElement,
  score: number
): void {
  let pointsForEachDiv: HTMLDivElement = createPointsForEachDiv(score);
  pointsForEachDiv.className = ELEMENTS.POINTS_FOR_EACH_DIV;

  renderElements(fightDiv, pointsForEachDiv);
}

export function initLiveDiv(): HTMLDivElement {
  let liveDiv = document.createElement("div");
  liveDiv.className = ELEMENTS.LIVE_DIV;

  let liveElements = createLiveElements();
  renderElements(liveDiv, ...liveElements);

  return liveDiv
}

