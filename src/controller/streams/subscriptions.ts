import { secondsInDay } from "date-fns";
import { Observable, Subject, Subscription } from "rxjs";
import { ELEMENTS, FIGHTER, INDEXES } from "../../environment";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import {
  fillFightersRating,
  fillFightersSelect,
  findNewOpponent,
  initFighterFromArray,
  restartGameLogic,
  playAgainLogic,
  startGameLogic,
  initLiveScoreLogic,
  tickingTimerLogic,
} from "../logic";

export function startGameSub(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  findingOpponent$: Observable<Opponent>,
  controlStartGameOb$: Subject<any>
): Subscription {
  return findingOpponent$.subscribe((opponent) => {
    startGameLogic(
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
    restartGameLogic(container, fightCard);
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
    fillFightersRating(container, fighter, ELEMENTS.BLUE_CORNER_DIV);
  });
}

export function changeRedCornerSub(
  container: HTMLDivElement,
  changeRedCornerOb$: Observable<Fighter>
) {
  return changeRedCornerOb$.subscribe((fighter) => {
    fillFightersRating(container, fighter, ELEMENTS.RED_CORNER_DIV);
  });
}

export function loadInitialFightersSub(
  initialNewPickOb$: Observable<Fighter[]>,
  container: HTMLDivElement
) {
  initialNewPickOb$.subscribe((fightersArray) => {
    let fighter = initFighterFromArray(fightersArray, FIGHTER.INDEX.INITIAL);
    fillFightersSelect(container, fightersArray);
    fillFightersRating(container, fighter, ELEMENTS.BLUE_CORNER_DIV);
    fillFightersRating(container, fighter, ELEMENTS.RED_CORNER_DIV);
  });
}

export function playAgainSub(
  container: HTMLElement,
  fightCard: FightCard,
  playAgain$: Observable<Event>
): Subscription {
  return playAgain$.subscribe(() => {
    //console.log("playagain");
    playAgainLogic(container, fightCard);
  });
}

export function playSub(
  container: HTMLDivElement,
  fightCard: FightCard,
  playOb$: Observable<FightCard>
): Subscription {
  return playOb$.subscribe(() => {
    //console.log(fightCard);
    //playGameLogic(container, fightCard);
  });
}

export function initLiveScoreSubSub(
  playButtonOb$: Observable<FightCard>,
  container: HTMLDivElement
) {
  playButtonOb$.subscribe((fightCard) => {
    fightCard.start();
    initLiveScoreLogic(fightCard, container);
  });
}

export function tickingTimerSub(
  tickingTimerOb$: Observable<FightCard>,
  container: HTMLDivElement
) {
  return tickingTimerOb$.subscribe((fightCard) => {
    tickingTimerLogic(container, fightCard);
  });
}