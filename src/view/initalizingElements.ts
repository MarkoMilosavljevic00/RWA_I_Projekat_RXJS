import { CLASSES, INITIAL } from "../constants";
import { setOpponent, setScoreForBoth } from "../controller/main";
import { initFindingOponnent } from "../controller/streams/initalizingObs";
import { Fight } from "../model/fight";
import { Opponent } from "../model/opponent";
import { createFightElements, createFindingOpponentElements, createNewPickElements, createOpponentPicksElements, createResultsElements, createTopElements, createYourPicksElements, renderDivs, renderElements, replaceContainer } from "./view";

export function initContainer(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  // fightCard: FightCard,
  // findingOpponent$: Observable<Opponent>,
  // controlFindingOpponentOb$: Subject<any>
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

export function initFightDiv(fight: Fight): HTMLDivElement {
  let fightDiv: HTMLDivElement = document.createElement("div");
  fightDiv.className = CLASSES.YOUR_FIGHT_DIV;

  let fightElements = createFightElements(fight);
  renderElements(fightDiv, ...fightElements);
  return fightDiv;
}