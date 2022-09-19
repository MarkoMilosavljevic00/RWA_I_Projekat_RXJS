import {
  delay,
  delayWhen,
  from,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  timer,
} from "rxjs";
import { API_URL, CLASSES, INDEXES } from "../../constants";
import { DifficultyLevel } from "../../enums/DifficultyLevelEnum";
import { WeightClass } from "../../enums/WeightClassEnum";
import { Fight } from "../../model/fight";
import { FightCard } from "../../model/fightCard";
import { Fighter } from "../../model/fighter";
import { Opponent } from "../../model/opponent";
import { Result } from "../../model/result";
import {
  getCheckedRadioValue,
  getSelectedValue,
  selectElement,
  selectSelectionEl,
} from "../../view/view";
import {
  checkAddingPick,
  getDifficulties,
  getFighterId,
  getRandomOpponent,
  getWeightClasses,
  initFighterFromArray,
} from "../main";

export function createButtonObs(container: HTMLElement, selection: string) {
  let btn = selectElement(container, selection);
  return fromEvent(btn, "click");
}

export function createSelectOptionObs(
  container: HTMLDivElement,
  selection: string
) {
  let select = selectSelectionEl(container, selection);
  return fromEvent(select, "change");
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

export function getFightersByWeightClass(
  weightClass: WeightClass
): Observable<Fighter[]> {
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

export function getFightersFromForm(
  container: HTMLDivElement,
  fightCard: FightCard
): Observable<Fighter[]> {
  if (checkAddingPick(container, fightCard) == false) {
    let emptyArray: Fighter[] = [];
    return of(emptyArray);
  }
  const blueCornerId = getSelectedValue(container, CLASSES.BLUE_CORNER_SEL);
  const redCornerId = getSelectedValue(container, CLASSES.RED_CORNER_SEL);

  return from(
    fetch(`${API_URL}/fighters/?id=${blueCornerId}&id=${redCornerId}`)
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
  return createButtonObs(findingOpponentDiv, CLASSES.FINDING_OPP_BTN).pipe(
    switchMap(() => getOpponents(getDifficulties(findingOpponentDiv))),
    map((opponents) => getRandomOpponent(opponents)),
    takeUntil(controlStartGameOb$)
  );
}

export function createAddNewPickObs(
  container: HTMLDivElement,
  selection: string,
  fightCard: FightCard
): Observable<FightCard> {
  return createButtonObs(container, selection).pipe(
    switchMap(() => getFightersFromForm(container, fightCard)),
    switchMap((fightersArray) =>
      addFightToFightCardObs(container, fightCard, fightersArray)
    )
  );
}

export function addFightToFightCardObs(
  container: HTMLDivElement,
  fightCard: FightCard,
  fightersArray: Fighter[]
): Observable<FightCard> {
  return new Observable<FightCard>((generator) => {
    if (fightersArray.length === 0) {
      generator.next(fightCard);
      return;
    }
    let fight = new Fight();
  
    let blueCornerFighter = initFighterFromArray(
      fightersArray,
      INDEXES.BLUE_CORNER
    );
    let redCornerFighter = initFighterFromArray(
      fightersArray,
      INDEXES.RED_CORNER
    );
    fight.setFighters(blueCornerFighter, redCornerFighter);
  
    let winnerValue = getCheckedRadioValue(container, CLASSES.CORNER_RADIO);
    let methodValue = getSelectedValue(container, CLASSES.METHOD_SEL);
    let roundValue = getSelectedValue(container, CLASSES.ROUND_SEL);
    let yourPick = new Result(winnerValue, methodValue, roundValue);
    fight.setYourPick(yourPick);
  
    fight.createFightDiv();
    fightCard.fights.push(fight);

    generator.next(fightCard);
    });
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
): Observable<Fighter> {
  return createSelectOptionObs(container, selection).pipe(
    switchMap(() => getFighterById(getFighterId(container, selection))),
    map((fightersArray) =>
      initFighterFromArray(fightersArray, INDEXES.INITIAL_FIGHTER)
    )
  );
}

function createPlayObs(container: HTMLDivElement, selection: string) {
  let playOb$ = createButtonObs(container, selection);
  return playOb$;
}

export function createRestartViewObs(
  container: HTMLDivElement,
  selection: string
) {
  return createButtonObs(container, selection).pipe(
    delayWhen(() => timer(10000))
  );
}
