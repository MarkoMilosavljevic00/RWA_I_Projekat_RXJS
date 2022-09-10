import { from, fromEvent, map, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { API_URL, CLASSES_OF_ELEMENTS } from "../constants";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Opponent } from "../model/opponent";
import { selectElement } from "../view/render";
import { selectDifficulty } from "./gameLogic";

export function createFindingOpponentObs(
  findingOpponentDiv: HTMLDivElement,
  controlStartGameOb$: Subject<any>
): Observable<Opponent> {
  let findingOpponentBtn = selectElement(findingOpponentDiv, CLASSES_OF_ELEMENTS.FINDING_OPP_BTN)
  return fromEvent(findingOpponentBtn, "click").pipe(
    switchMap(() => {
      return getOpponents(selectDifficulty(findingOpponentDiv));
    }),
    map((opponents) => {
      const index = Math.trunc(Math.random() * opponents.length);
      return opponents[index];
    }),
    takeUntil(controlStartGameOb$)
  );
}

export function createControlFlowObs() {
    return new Subject();
}

export function createRestartGameObs(
  container: HTMLElement
) {
  let restartBtn = selectElement(container, CLASSES_OF_ELEMENTS.RESTART_BTN)
  return fromEvent(restartBtn, "click");
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
