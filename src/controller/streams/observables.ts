import {
  delay,
  delayWhen,
  from,
  fromEvent,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from "rxjs";
import { API_URL, CLASSES } from "../../constants";
import { DifficultyLevel } from "../../enums/DifficultyLevelEnum";
import { WeightClass } from "../../enums/WeightClassEnum";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import { selectElement, selectSelectionEl } from "../../view/view";
import { getDifficulties, getFighterId, getRandomOpponent, getWeightClasses } from "../main";

export function createButtonObs(container: HTMLElement, selection: string) {
  let btn = selectElement(container, selection);
  return fromEvent(btn, "click");
}

export function createSelectOptionObs(
  container: HTMLDivElement,
  selection: string
) {
  let select = selectSelectionEl(container, selection);
  return fromEvent(select,"change");
}

export function createControlFlowObs() {
  return new Subject();
}

export function completeControlFlowObs(controlStartGameOb$: Subject<any>) {
  controlStartGameOb$.next(1);
  controlStartGameOb$.complete();
}

function getOpponents(difficulty: DifficultyLevel): Observable<Opponent[]> {
  return from(
    fetch(`${API_URL}/opponents/?difficulty=${difficulty}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error("Fetch error");
      })
      .catch((err) => console.error(err))
  );
}

export function getFightersByWeightClass(weightClass: WeightClass): Observable<Fighter[]> {
  return from(
    fetch(`${API_URL}/fighters/?weightClass=${weightClass}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error("Fetch error");
      })
      .catch((err) => console.error(err))
  );
}

function getFighterById(id: number): Observable<Fighter[]> {
  return from(
    fetch(`${API_URL}/fighters/?id=${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error("Fetch error");
      })
      .catch((err) => console.error(err))
  );
}


export function createFindingOpponentObs(
  findingOpponentDiv: HTMLDivElement,
  controlStartGameOb$: Subject<any>
): Observable<Opponent> {
  return createButtonObs(
    findingOpponentDiv,
    CLASSES.FINDING_OPP_BTN
  ).pipe(
    switchMap(() => getOpponents(getDifficulties(findingOpponentDiv))),
    map((opponents) => getRandomOpponent(opponents)),
    takeUntil(controlStartGameOb$)
  );
}

// export function createGameObs(container: HTMLDivElement, fightCard: FightCard) {
//   let addNewPickOb$ = createAddNewPickObs(
//     container,
//     CLASSES_OF_ELEMENTS.ADD_PICK_BTN,
//     fightCard
//   );
//   let playOb$ = createPlayObs(container, CLASSES_OF_ELEMENTS.PLAY_BTN);
//   return playOb$.pipe(withLatestFrom(addNewPickOb$));
// }

export function createChangeWeightClassObs(
  container: HTMLDivElement,
  selection: string
) {
  return createSelectOptionObs(container, selection).pipe(
    switchMap(() => getFightersByWeightClass(getWeightClasses(container)))
  );
}

export function createChangeFighterObs(
  container: HTMLDivElement,
  selection: string
): Observable<Fighter[]> {
  return createSelectOptionObs(container, selection).pipe(
    switchMap(() => getFighterById(getFighterId(container, selection)))
  );
}

function createAddNewPickObs(
  container: HTMLDivElement,
  selection: string,
  fightCard: FightCard
) {
  return createSelectOptionObs(container, selection).pipe();
}

function createPlayObs(container: HTMLDivElement, selection: string) {
  let playOb$ = createButtonObs(container, selection);
  return playOb$;
}

export function createRestartView(
  container: HTMLDivElement,
  selection: string
){
  return createButtonObs(container,selection).pipe(
    delayWhen(() => timer(10000))
  )
}