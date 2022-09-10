import { Observable, Subject, Subscription } from "rxjs";
import { Fight } from "../model/fight";
import { Opponent } from "../model/opponent";
import { restartGame, startGame } from "./gameLogic";

export function startGameSub(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  findingOpponent$: Observable<Opponent>,
  controlStartGameOb$: Subject<any>
) {
  return findingOpponent$.subscribe((opponent) => {
    startGame(host, findingOpponentDiv, opponent, findingOpponent$, controlStartGameOb$);
  });
}

export function unsubscribeStartGameSub(controlStartGameOb$: Subject<any>) {
  controlStartGameOb$.next(1);
  controlStartGameOb$.complete();
}

export function findNewOpponentSub(
  container: HTMLElement,
  fightCard: Fight[],
  findingOpponent$: Observable<Opponent>
) {
  return findingOpponent$.subscribe((opponent) => {
    restartGame(container, fightCard, opponent);
  });
}

export function restartGameSub(
  container: HTMLElement,
  fightCard: Fight[],
  restartGame$: Observable<Event>,
  opponent: Opponent
) {
  return restartGame$.subscribe(() => {
    restartGame(container, fightCard, opponent)
  });
}