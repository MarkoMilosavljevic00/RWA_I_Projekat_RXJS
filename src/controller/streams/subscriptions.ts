import { Observable, Subject, Subscription } from "rxjs";
import { CLASSES, INITIAL } from "../../constants";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import { fillFightersRating, fillFightersSelect, findNewOpponent, restartGame, startGame } from "../main";

export function startGameSub(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  findingOpponent$: Observable<Opponent>,
  controlStartGameOb$: Subject<any>
): Subscription {
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

export function gameSub(ob$: Observable<[Event, number[]]>): Subscription {
  return ob$.subscribe((data2) => {
    console.log(data2);
  });
}

export function findNewOpponentSub(
  container: HTMLElement,
  fightCard: FightCard,
  findingOpponent$: Observable<Opponent>
): Subscription {
  return findingOpponent$.subscribe((newOpponent) => {
    findNewOpponent(container, fightCard, newOpponent);
  });
}

export function restartGameSub(
  container: HTMLElement,
  fightCard: FightCard,
  restartGame$: Observable<Event>
): Subscription {
  return restartGame$.subscribe(() => {
    restartGame(container, fightCard);
  });
}

export function changeWeightClassSub(
  container: HTMLDivElement,
  changeWeightClassOb$: Observable<Fighter[]>
): Subscription {
  return changeWeightClassOb$.subscribe((fighters) => {
    fillFightersSelect(container, fighters);
  });
}

export function changeBlueCornerSub(
  container: HTMLDivElement,
  changeBlueCornerOb$: Observable<Fighter[]>
) {
  return changeBlueCornerOb$.subscribe((fightersArray) => {
    let fighter = new Fighter(
      fightersArray[INITIAL.INDEX_OF_FIGHTER].id,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].name,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].weightClass,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].standup,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].grappling
    );
    fillFightersRating(
      container,
      fighter,
      CLASSES.BLUE_CORNER_DIV
    );
  });
}

export function changeRedCornerSub(
  container: HTMLDivElement,
  changeRedCornerOb$: Observable<Fighter[]>
) {
  return changeRedCornerOb$.subscribe((fightersArray) => {
    let fighter = new Fighter(
      fightersArray[INITIAL.INDEX_OF_FIGHTER].id,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].name,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].weightClass,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].standup,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].grappling
    );
    fillFightersRating(
      container,
      fighter,
      CLASSES.RED_CORNER_DIV
    );
  });
}

export function initialNewPickSub(initialNewPickOb$: Observable<Fighter[]>, container: HTMLDivElement) {
  initialNewPickOb$.subscribe((fightersArray) => {
    let fighter = new Fighter(
      fightersArray[INITIAL.INDEX_OF_FIGHTER].id,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].name,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].weightClass,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].standup,
      fightersArray[INITIAL.INDEX_OF_FIGHTER].grappling
    );
    fillFightersSelect(container, fightersArray);
    fillFightersRating(container, fighter, CLASSES.BLUE_CORNER_DIV);
    fillFightersRating(container, fighter, CLASSES.RED_CORNER_DIV);
  });
}
