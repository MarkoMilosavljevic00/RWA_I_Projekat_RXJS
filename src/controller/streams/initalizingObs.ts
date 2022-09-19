import { Observable, Subject, switchMap, take } from "rxjs";
import { Opponent } from "../../model/opponent";
import {
  addNewPickSub,
  changeBlueCornerSub,
  changeRedCornerSub,
  changeWeightClassSub,
  findNewOpponentSub,
  initialNewPickSub,
  restartGameSub,
  restartViewSub,
  startGameSub,
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
  createRestartViewObs,
  createAddNewPickObs,
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
) {
  let restartGameOb$ = createButtonObs(container, CLASSES.RESTART_BTN);
  restartGameSub(container, fightCard, restartGameOb$);
}

export function initChangeFighter(container: HTMLDivElement) {
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

export function initChangeWeightClass(container: HTMLDivElement) {
  let changeWeightClassOb$ = createChangeWeightClassObs(
    container,
    CLASSES.WEIGHT_CLASS_SEL
  );
  changeWeightClassSub(container, changeWeightClassOb$);
}

export function initNewPick(container: HTMLDivElement) {
  let initialNewPickOb$ = getFightersByWeightClass(
    WeightClass.Lightweight
  ).pipe(take(1));
  initialNewPickSub(initialNewPickOb$, container);
}

export function initRestartView(
  container: HTMLDivElement,
  fightCard: FightCard
) {
  let restartViewOb$ = createRestartViewObs(container, CLASSES.PLAY_BTN);
  restartViewSub(container, fightCard, restartViewOb$);
}

export function initAddNewPick(
  container: HTMLDivElement,
  fightCard: FightCard
) {
  let addNewPickOb$ = createAddNewPickObs(
    container,
    CLASSES.ADD_PICK_BTN,
    fightCard
  );
  addNewPickSub(container, addNewPickOb$);
}
