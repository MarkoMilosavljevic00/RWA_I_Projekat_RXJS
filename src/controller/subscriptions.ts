import { Observable, Subject, Subscription } from "rxjs";
import { CLASSES_OF_ELEMENTS } from "../constants";
import { Fight } from "../model/fight";
import { FightCard } from "../model/fightCard";
import { Fighter } from "../model/fighter";
import { Opponent } from "../model/opponent";
import {
  clearChilds,
  fillSelect,
  findNewOpponent,
  restartGame,
  selectSelectionEl,
  startGame,
} from "./gameLogic";

export function startGameSub(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  findingOpponent$: Observable<Opponent>,
  controlStartGameOb$: Subject<any>
) {
  return findingOpponent$.subscribe((opponent) => {
    startGame(
      host,
      findingOpponentDiv,
      opponent,
      findingOpponent$,
      controlStartGameOb$
    );
  });
}

export function gameSub(ob$: Observable<[Event, number[]]>) {
  return ob$.subscribe((data2) => {
    console.log(data2);
  });
}

export function findNewOpponentSub(
  container: HTMLElement,
  fightCard: FightCard,
  findingOpponent$: Observable<Opponent>
) {
  return findingOpponent$.subscribe((newOpponent) => {
    findNewOpponent(container, fightCard, newOpponent);
  });
}

export function restartGameSub(
  container: HTMLElement,
  fightCard: FightCard,
  restartGame$: Observable<Event>
) {
  return restartGame$.subscribe(() => {
    restartGame(container, fightCard);
  });
}

export function changeWeightClassSub(
  container: HTMLDivElement,
  changeWeightClassOb$: Observable<Fighter[]>
) {
  return changeWeightClassOb$.subscribe((fighters) => {
    let blueCornerSelect = selectSelectionEl(container, CLASSES_OF_ELEMENTS.BLUE_CORNER_SEL);
    let redCornerSelect = selectSelectionEl(container, CLASSES_OF_ELEMENTS.RED_CORNER_SEL);

    clearChilds(blueCornerSelect);
    clearChilds(redCornerSelect);

    let namesOfFigters: string[] = [];
    let idsOfFighters: string[] = [];

    fighters.forEach((fighter) => {
      namesOfFigters.push(fighter.name);
      idsOfFighters.push(fighter.id.toString());
    });

    fillSelect(
      container,
      CLASSES_OF_ELEMENTS.BLUE_CORNER_SEL,
      namesOfFigters,
      idsOfFighters
    );
    fillSelect(
      container,
      CLASSES_OF_ELEMENTS.RED_CORNER_SEL,
      namesOfFigters,
      idsOfFighters
    );
  });
}
