import { secondsInDay } from "date-fns";
import { Observable, Subject, Subscription } from "rxjs";
import { ELEMENTS, FIGHTER, INDEXES } from "../../environment";
import { Attack } from "../../model/attack";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import { StateOfFight } from "../../model/stateOfFight";
import {
  fillFightersRating,
  fillFightersSelect,
  findNewOpponentLogic,
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
  return findingOpponent$.subscribe((opponent: Opponent) => {
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
  return findingOpponent$.subscribe((newOpponent: Opponent) => {
    findNewOpponentLogic(container, fightCard, newOpponent);
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
  return changeWeightClassOb$.subscribe((fightersArray: Fighter[]) => {
    fillFightersSelect(container, fightersArray);
  });
}

export function changeBlueCornerSub(
  container: HTMLDivElement,
  changeBlueCornerOb$: Observable<Fighter>
) {
  return changeBlueCornerOb$.subscribe((fighter: Fighter) => {
    fillFightersRating(container, fighter, ELEMENTS.BLUE_CORNER_DIV);
  });
}

export function changeRedCornerSub(
  container: HTMLDivElement,
  changeRedCornerOb$: Observable<Fighter>
) {
  return changeRedCornerOb$.subscribe((fighter: Fighter) => {
    fillFightersRating(container, fighter, ELEMENTS.RED_CORNER_DIV);
  });
}

export function loadInitialFightersSub(
  initialNewPickOb$: Observable<Fighter[]>,
  container: HTMLDivElement
) {
  initialNewPickOb$.subscribe((fightersArray: Fighter[]) => {
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
  playButtonOb$.subscribe((fightCard: FightCard) => {
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

export function generatorAttackSub(
  generatorAttackOb$: Observable<Attack>,
  fightCard: FightCard,
  container: HTMLElement
) {
  return generatorAttackOb$.subscribe((attack) => {
    attack.performAttack(container, fightCard.getCurrentFight().currentState);
    attack.checkIsAnyoneFinished(container, fightCard);
  });
}
