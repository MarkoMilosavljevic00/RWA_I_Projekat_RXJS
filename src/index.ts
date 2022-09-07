import { createFindingOpponentObs, startNewGame } from "./observables";
import { newGameSub } from "./subscriptions";
import { createFindingOpponentElements, drawDivs } from "./view";

const topDiv: HTMLDivElement = document.createElement("div");

function init() {
  const findingOpponentDiv: HTMLDivElement = document.createElement("div");
  createFindingOpponentElements(findingOpponentDiv);
  drawDivs(document.body, findingOpponentDiv);

  var findingOpponent$ = createFindingOpponentObs(findingOpponentDiv);
  newGameSub(document.body, findingOpponentDiv, findingOpponent$);
}

init();
