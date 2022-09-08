import { from, fromEvent, map, Observable, switchMap } from "rxjs";
import { API_URL} from "./constants";
import { DifficultyLevel } from "./enums/DifficultyLevelEnum";
import { Opponent } from "./models/opponent";
import { createTopElements } from "./view/creatingElements";
import { renderDivs, replaceContainer, setResult } from "./view/rendering";
import { initGameDiv, initTopDiv } from "./view/view";

export function createFindingOpponentObs(
  findingOpponentDiv: HTMLDivElement
): Observable<Opponent> {
  let buttonFindOpponent = findingOpponentDiv.querySelector("button");
  return fromEvent(buttonFindOpponent, "click").pipe(
    switchMap(() => {
      return getOpponents(selectDifficulty(findingOpponentDiv));
    }),
    map((opponents) => {
      const index = Math.trunc(Math.random() * opponents.length);
      return opponents[index];
    })
  );
}

export function createRestartScoreObs() {}

function getOpponents(difficulty: DifficultyLevel): Observable<Opponent[]> {
  return from(
    fetch(`${API_URL}/opponents/?difficulty=${difficulty}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error("Fetch error");
      })
      .catch((err) => console.error(err))
  );
}

function selectDifficulty(findingOpponentDiv: HTMLDivElement): DifficultyLevel {
  let select = findingOpponentDiv.querySelector("select");
  let difficultyString = select.options[select.selectedIndex].value;
  return DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
}

export function startGame(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>
) {
  let container: HTMLDivElement = document.createElement("div");

  replaceContainer(host, container, findingOpponentDiv);
  let topDiv = initTopDiv(findingOpponentDiv, opponent);
  let gameDiv = initGameDiv();
  renderDivs(container, topDiv, gameDiv);
}
