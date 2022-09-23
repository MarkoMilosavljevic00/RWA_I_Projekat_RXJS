import { CLASSES, INITIAL } from "../constants";
import { setOpponent, setScoreForBoth } from "../controller/main";
import { Fight } from "../model/fight";
import { Opponent } from "../model/opponent";
import { Result } from "../model/result";
import {
  createFightElements,
  createFindingOpponentElements,
  createNewPickElements,
  createOpponentPicksElements,
  createPointsForEachDiv,
  createResultsElements,
  createTopElements,
  createYourPicksElements,
  renderDivs,
  renderElements,
  replaceContainer,
} from "./view";

export function initContainer(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
): HTMLDivElement {
  let container: HTMLDivElement = document.createElement("div");
  container.className = container.className = CLASSES.CONTAINER;

  replaceContainer(host, container, findingOpponentDiv);
  let topDiv = initTopDiv(findingOpponentDiv, opponent);
  let gameDiv = initGameDiv();
  renderDivs(container, topDiv, gameDiv);

  return container;
}

export function initFindingOpponentDiv(): HTMLDivElement {
  const findingOpponentDiv: HTMLDivElement = document.createElement("div");
  findingOpponentDiv.className = CLASSES.INITIAL_DIV;

  let findingOpponentElements = createFindingOpponentElements();
  renderElements(findingOpponentDiv, ...findingOpponentElements);
  return findingOpponentDiv;
}

export function initTopDiv(
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
): HTMLDivElement {
  let topDiv: HTMLDivElement = document.createElement("div");
  topDiv.className = CLASSES.TOP_DIV;

  let topElements = createTopElements(findingOpponentDiv);

  renderElements(topDiv, ...topElements);
  setScoreForBoth(INITIAL.SCORE, topDiv);
  setOpponent(opponent, topDiv);
  return topDiv;
}

export function initGameDiv(): HTMLDivElement {
  let gameDiv: HTMLDivElement = document.createElement("div");
  gameDiv.className = CLASSES.GAME_DIV;

  let yourPicksDiv = initYourPicksDiv();
  let opponentPicksDiv = initOpponentPicksDiv();
  let resultsDiv = initResultsDiv();

  renderElements(gameDiv, yourPicksDiv, resultsDiv, opponentPicksDiv);
  return gameDiv;
}

export function initYourPicksDiv(): HTMLDivElement {
  let yourPicksDiv: HTMLDivElement = document.createElement("div");
  yourPicksDiv.className = CLASSES.YOUR_PICKS_DIV;

  let yourPicksElements = createYourPicksElements();
  renderElements(yourPicksDiv, ...yourPicksElements);
  return yourPicksDiv;
}

export function initNewPickDiv(): HTMLDivElement {
  let newPickDiv = document.createElement("div");
  newPickDiv.className = CLASSES.NEW_PICK_DIV;

  let newPickElements = createNewPickElements();
  renderElements(newPickDiv, ...newPickElements);

  return newPickDiv;
}

export function initOpponentPicksDiv(): HTMLDivElement {
  let opponentPicksDiv: HTMLDivElement = document.createElement("div");
  opponentPicksDiv.className = CLASSES.OPP_PICKS_DIV;

  let opponentPicksElements = createOpponentPicksElements();
  renderElements(opponentPicksDiv, ...opponentPicksElements);
  return opponentPicksDiv;
}

export function initResultsDiv(): HTMLDivElement {
  let resultDiv: HTMLDivElement = document.createElement("div");
  resultDiv.className = CLASSES.RESULT_DIV;

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
  pointsForEachDiv.className = CLASSES.POINTS_FOR_EACH_DIV;

  renderElements(fightDiv, pointsForEachDiv);
}
