import { createFindingOpponentObs, startGame } from "./observables";
import { startGameSub } from "./subscriptions";
import { createFindingOpponentElements } from "./view/creatingElements";
import { renderDivs, renderElements } from "./view/rendering";
import { initFindingOpponentDiv } from "./view/view";


function init() {
  let findingOpponentDiv = initFindingOpponentDiv();
  renderDivs(document.body, findingOpponentDiv);

  let findingOpponent$ = createFindingOpponentObs(findingOpponentDiv);
  startGameSub(document.body, findingOpponentDiv, findingOpponent$);
}

init();
