import { combineLatest, interval, Observable, Subject, take } from "rxjs";
import { Opponent } from "../../model/opponent";
import {
  changeBlueCornerSub,
  changeRedCornerSub,
  changeWeightClassSub,
  findNewOpponentSub,
  loadInitialFightersSub,
  restartGameSub,
  playAgainSub,
  startGameSub,
  playButtonSub,
  tickingTimerSub,
} from "./subscriptions";
import { CLASSES, TIME } from "../../../environment";
import {
  completeControlFlowObs,
  createControlFlowObs,
  createFindingOpponentObs,
  createButtonObs,
  createChangeWeightClassObs,
  getFightersByWeightClass,
  createChangeFighterObs,
  createPlayAgainObs as createPlayAgainObs,
  createAddNewPickObs,
  createPlayObs,
} from "./observables";
import { FightCard } from "../../model/fightCard";
import { WeightClass } from "../../enums/WeightClassEnum";

export function initFindingOponnentObs(
  findingOpponentDiv: HTMLDivElement
): void {
  let controlFindingOpponentOb$ = createControlFlowObs();
  let findingOpponent$ = createFindingOpponentObs(
    findingOpponentDiv,
    controlFindingOpponentOb$
  );
  startGameSub(
    document.body,
    findingOpponentDiv,
    findingOpponent$,
    controlFindingOpponentOb$
  );
}

export function initFindingNewOpponentObs(
  controlStartGameFindingOb$: Subject<any>,
  container: HTMLDivElement,
  fightCard: FightCard,
  findingOpponent$: Observable<Opponent>
): void {
  completeControlFlowObs(controlStartGameFindingOb$);
  findNewOpponentSub(container, fightCard, findingOpponent$);
}

export function initRestartingGameObs(
  container: HTMLDivElement,
  fightCard: FightCard
): void {
  let restartGameOb$ = createButtonObs(container, CLASSES.RESTART_BTN);
  restartGameSub(container, fightCard, restartGameOb$);
}

export function initChangeFighterObs(container: HTMLDivElement): void {
  let changeBlueCornerOb$ = createChangeFighterObs(
    container,
    CLASSES.BLUE_CORNER_SEL
  );
  let changeRedCornerOb$ = createChangeFighterObs(
    container,
    CLASSES.RED_CORNER_SEL
  );

  changeBlueCornerSub(container, changeBlueCornerOb$);
  changeRedCornerSub(container, changeRedCornerOb$);
}

export function initChangeWeightClassObs(container: HTMLDivElement): void {
  let changeWeightClassOb$ = createChangeWeightClassObs(
    container,
    CLASSES.WEIGHT_CLASS_SEL
  );
  changeWeightClassSub(container, changeWeightClassOb$);
}

export function initLoadInitialFightersObs(container: HTMLDivElement): void {
  let initialNewPickOb$ = getFightersByWeightClass(
    WeightClass.Lightweight
  ).pipe(take(1));
  loadInitialFightersSub(initialNewPickOb$, container);
}

export function initGameObs(
  container: HTMLDivElement,
  fightCard: FightCard
): void {
  let addNewPickOb$ = createAddNewPickObs(
    container,
    CLASSES.ADD_PICK_BTN,
    fightCard
  );
  let playButtonOb$ = createButtonObs(container, CLASSES.PLAY_BTN);
  playButtonSub(playButtonOb$, fightCard, container);
  let timerOb$ = interval(TIME.SECOND);
  let tickingTimerOb$ = combineLatest(timerOb$, playButtonOb$);
  tickingTimerSub(tickingTimerOb$, container, fightCard);

  //tickingTimerSub(tickingTimerOb$, container, fightCard);

  // V1 OBS
  // let playOb$ = createPlayObs(
  //   container,
  //   CLASSES.PLAY_BTN,
  //   fightCard,
  //   addNewPickOb$
  // );
  // playSub(container, fightCard, playOb$);
}

// export function initTimerObs(container: HTMLDivElement, fightCard: FightCard) {
//   let liveTimerOb$ = interval(TIME.SECOND);
//   startTimerSub(liveTimerOb$, container, fightCard);
// }

// export function initPlayButtonObs(
//   container: HTMLDivElement,
//   fightCard: FightCard
// ) {
//   let playGameOb$ = createButtonObs(container, CLASSES.PLAY_BTN);
//   playButtonSub(
//     playGameOb$,
//     container,
//     fightCard,
//     CLASSES.LIVE_DIV,
//     CLASSES.HOME_DIV
//   );
// }

export function initPlayAgainObs(
  container: HTMLDivElement,
  fightCard: FightCard
): void {
  let playAgainOb$ = createPlayAgainObs(
    container,
    CLASSES.PLAY_BTN,
    CLASSES.PLAY_AGAIN_BTN
  );
  playAgainSub(container, fightCard, playAgainOb$);
}
