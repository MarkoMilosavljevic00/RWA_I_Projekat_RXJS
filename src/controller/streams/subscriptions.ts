import { Observable, Subject, Subscription } from "rxjs";
import { CLASSES, INDEXES, INITIAL } from "../../constants";
import { Fight } from "../../model/fight";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import { Result } from "../../model/result";
import { selectElement } from "../../view/view";
import {
  fillFightersRating,
  fillFightersSelect,
  findNewOpponent,
  initFighterFromArray,
  restartGame,
  restartView,
  startGame,
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

// export function gameSub(ob$: Observable<[Event, number[]]>): Subscription {
//   return ob$.subscribe((data2) => {
//     console.log(data2);
//   });
// }

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

export function restartViewSub(
  container: HTMLElement,
  fightCard: FightCard,
  restartGame$: Observable<Event>
): Subscription {
  return restartGame$.subscribe(() => {
    restartView(container, fightCard);
  });
}

export function addNewPickSub(
  container: HTMLDivElement,
  // fightCard: FightCard,
  restartGame$: Observable<FightCard>
): Subscription {
  return restartGame$.subscribe((fightCard) => {
    let yourFightCardDiv = selectElement(container, CLASSES.YOUR_FIGHTCARD_DIV);
    fightCard.renderFightDivs(yourFightCardDiv);
  });
}

// export function pushFightInFightCardSub(
//   fight: Fight,
//   fightCard: FightCard,
//   yourPick: Result,
//   getFightersOb$: Observable<Fighter[]>
// ): Subscription {
//   return getFightersOb$.subscribe((fightersArray) => {
//     let blueCornerFighter = initFighterFromArray(fightersArray, INDEXES.BLUE_CORNER);
//     let redCornerFighter = initFighterFromArray(fightersArray, INDEXES.RED_CORNER);

//     fight.setFighters(blueCornerFighter, redCornerFighter);
//     fight.setYourPick(yourPick);

//     fightCard.fights.push(fight);
//     console.log(fightCard.fights)
//   });
// }
