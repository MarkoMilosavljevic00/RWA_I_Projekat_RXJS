import { Observable } from "rxjs";
import { Opponent } from "./models/opponent";
import { startGame } from "./observables";

export function startGameSub(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  findingOpponent$: Observable<Opponent>
) {
  findingOpponent$.subscribe((opponent) =>
    startGame(host, findingOpponentDiv, opponent, findingOpponent$)
  );
}
