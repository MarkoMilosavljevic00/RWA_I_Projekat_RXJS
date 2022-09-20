import { Observable, Subject, Subscription } from "rxjs";
import { CLASSES, INDEXES, INITIAL } from "../../constants";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import {
  fillFightersRating,
  fillFightersSelect,
  findNewOpponent,
  initFighterFromArray,
  restartGame,
  playAgain,
  startGame,
  playGame,
} from "../main";

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
  changeBlueCornerOb$: Observable<Fighter>
) {
  return changeBlueCornerOb$.subscribe((fighter) => {
    fillFightersRating(container, fighter, CLASSES.BLUE_CORNER_DIV);
  });
}

export function changeRedCornerSub(
  container: HTMLDivElement,
  changeRedCornerOb$: Observable<Fighter>
) {
  return changeRedCornerOb$.subscribe((fighter) => {
    fillFightersRating(container, fighter, CLASSES.RED_CORNER_DIV);
  });
}

export function initialNewPickSub(
  initialNewPickOb$: Observable<Fighter[]>,
  container: HTMLDivElement
) {
  initialNewPickOb$.subscribe((fightersArray) => {
    let fighter = initFighterFromArray(fightersArray, INDEXES.INITIAL_FIGHTER);
    fillFightersSelect(container, fightersArray);
    fillFightersRating(container, fighter, CLASSES.BLUE_CORNER_DIV);
    fillFightersRating(container, fighter, CLASSES.RED_CORNER_DIV);
  });
}

export function playAgainSub(
  container: HTMLElement,
  fightCard: FightCard,
  playAgain$: Observable<Event>
): Subscription {
  return playAgain$.subscribe(() => {
    console.log("playagain");
    playAgain(container, fightCard);
  });
}

export function playSub(
  container: HTMLDivElement,
  fightCard: FightCard,
  playOb$: Observable<FightCard>
): Subscription {
  return playOb$.subscribe(() => {
    console.log("sad sam");
    playGame(container, fightCard);
  });
}
