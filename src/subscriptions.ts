import { Observable } from "rxjs";
import { Opponent } from "./models/opponent";
import { startNewGame } from "./observables";

export function newGameSub(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  findingOpponent$: Observable<Opponent>
) {
  findingOpponent$.subscribe((opponent) =>
    startNewGame(host, findingOpponentDiv, opponent, findingOpponent$)
  );
}
