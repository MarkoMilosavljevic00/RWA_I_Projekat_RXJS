import { combineLatest, interval, map, Observable, Subject, take, withLatestFrom } from "rxjs";
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
  initLiveScoreSubSub as initLiveScoreSub,
  tickingTimerSub,
} from "./subscriptions";
import { ATTACK, ELEMENTS, TIME } from "../../environment";
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
  createInitLiveScoreObs,
  createTickingTimerObs,
  createGeneratorAttackObs,
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
  let restartGameOb$ = createButtonObs(container, ELEMENTS.RESTART_BTN);
  restartGameSub(container, fightCard, restartGameOb$);
}

export function initChangeFighterObs(container: HTMLDivElement): void {
  let changeBlueCornerOb$ = createChangeFighterObs(
    container,
    ELEMENTS.BLUE_CORNER_SEL
  );
  let changeRedCornerOb$ = createChangeFighterObs(
    container,
    ELEMENTS.RED_CORNER_SEL
  );

  changeBlueCornerSub(container, changeBlueCornerOb$);
  changeRedCornerSub(container, changeRedCornerOb$);
}

export function initChangeWeightClassObs(container: HTMLDivElement): void {
  let changeWeightClassOb$ = createChangeWeightClassObs(
    container,
    ELEMENTS.WEIGHT_CLASS_SEL
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
    ELEMENTS.ADD_PICK_BTN,
    fightCard
  );

  let initLiveScoreOb$ = createInitLiveScoreObs(container, ELEMENTS.PLAY_BTN, addNewPickOb$);
  initLiveScoreSub(initLiveScoreOb$, container);

  let tickingTimerOb$ = createTickingTimerObs(container, ELEMENTS.PLAY_BTN, addNewPickOb$, TIME.SECOND);
  tickingTimerSub(tickingTimerOb$, container);

  let generatorAttackOb$ = createGeneratorAttackObs(container, addNewPickOb$, ATTACK.FREQUENCY, ATTACK.PERCENT.TO_HAPPEN, ATTACK.PERCENT.NOT_TO_HAPPEN)

  // let tickingTimerOb$ = combineLatest(timerOb$, playButtonOb$).pipe(
  //   map(arr => arr[0])
  // );
  // tickingTimerSub(tickingTimerOb$, container, fightCard);

  // tickingTimerOb$.pipe(
  //   withLatestFrom(addNewPickOb$),
  //   map(arr => arr[1])
  // ).subscribe(console.log);


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
    ELEMENTS.PLAY_BTN,
    ELEMENTS.PLAY_AGAIN_BTN
  );
  playAgainSub(container, fightCard, playAgainOb$);
}