import {
  Observable,
  Subject,
  switchMap,
  take,
  withLatestFrom,
  zip,
} from "rxjs";
import { Opponent } from "../../model/opponent";
import {
  changeBlueCornerSub,
  changeRedCornerSub,
  changeWeightClassSub,
  findNewOpponentSub,
  initialNewPickSub,
  restartGameSub,
  playAgainSub as playAgainSub,
  startGameSub,
  playSub,
} from "./subscriptions";
import { CLASSES } from "../../constants";
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

export function initFindingOponnent(findingOpponentDiv: HTMLDivElement): void {
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

export function initFindingNewOpponent(
  controlStartGameFindingOb$: Subject<any>,
  container: HTMLDivElement,
  fightCard: FightCard,
  findingOpponent$: Observable<Opponent>
): void {
  completeControlFlowObs(controlStartGameFindingOb$);
  findNewOpponentSub(container, fightCard, findingOpponent$);
}

export function initRestartingGame(
  container: HTMLDivElement,
  fightCard: FightCard
): void {
  let restartGameOb$ = createButtonObs(container, CLASSES.RESTART_BTN);
  restartGameSub(container, fightCard, restartGameOb$);
}

export function initChangeFighter(container: HTMLDivElement): void {
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

export function initChangeWeightClass(container: HTMLDivElement): void {
  let changeWeightClassOb$ = createChangeWeightClassObs(
    container,
    CLASSES.WEIGHT_CLASS_SEL
  );
  changeWeightClassSub(container, changeWeightClassOb$);
}

export function initNewPick(container: HTMLDivElement): void {
  let initialNewPickOb$ = getFightersByWeightClass(
    WeightClass.Lightweight
  ).pipe(take(1));
  initialNewPickSub(initialNewPickOb$, container);
}

export function initGame(
  container: HTMLDivElement,
  fightCard: FightCard
): void {
  let addNewPickOb$ = createAddNewPickObs(
    container,
    CLASSES.ADD_PICK_BTN,
    fightCard
  );

  let playOb$ = createPlayObs(
    container,
    CLASSES.PLAY_BTN,
    fightCard,
    addNewPickOb$
  );

  playSub(container, fightCard, playOb$);
}

export function initPlayAgain(
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
