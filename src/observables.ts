import { from, fromEvent, map, Observable, switchMap } from "rxjs";
import { API_URL, INITIAL_SCORE, NUMBER_OF_OPPONENTS } from "./constants";
import { DifficultyLevel } from "./enums/DifficultyLevelEnum";
import { Opponent } from "./models/opponent";
import { createTopDivElements, drawDivs, replaceContainer, setResult } from "./view";

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

export function createRestartScoreObs() {

}

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

export function startNewGame(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>
) {
  var mainDiv: HTMLDivElement = document.createElement("div");
  var topDiv: HTMLDivElement = document.createElement("div");
  var gameDiv: HTMLDivElement = document.createElement("div");

  replaceContainer(host, mainDiv, findingOpponentDiv);

  createTopDivElements(topDiv, findingOpponentDiv, opponent);
  //console.log(topDiv)
  setResult(INITIAL_SCORE, topDiv);
  // createGameDivElements(gameDiv);
  drawDivs(mainDiv, topDiv, gameDiv);

  //createRestartScoreObs(topDiv, gameDiv);
}

