import { Observable, Subject } from "rxjs";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Opponent } from "../model/opponent";
import {
  clearChilds,
  setSelectOptions,
  getOptionValue,
  selectElement,
  selectPicture,
  selectSelectionEl,
  setLabel,
  setPicture,
  clearSelect,
  renderDivs,
} from "../view/view";
import { CLASSES, INITIAL } from "../constants";
import { FightCard } from "../model/fightCard";
import { WeightClass } from "../enums/WeightClassEnum";
import { Fighter } from "../model/fighter";
import {
  initRestartingGame,
  initFindingNewOpponent,
  initChangeFighter,
  initNewPick,
  initChangeWeightClass,
  initFindingOponnent,
  initRestartView,
} from "./streams/initalizingObs";
import {
  initContainer,
  initFindingOpponentDiv,
} from "../view/initalizingElements";
import Swal from "sweetalert2";

export function init(): void {
  let findingOpponentDiv = initFindingOpponentDiv();
  renderDivs(document.body, findingOpponentDiv);

  initFindingOponnent(findingOpponentDiv);
}

export function startGame(
  host: HTMLElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent,
  findingOpponent$: Observable<Opponent>,
  controlFindingOpponentOb$: Subject<any>
): void {
  let fightCard: FightCard = new FightCard();
  let container: HTMLDivElement;
  container = initContainer(
    host,
    findingOpponentDiv,
    opponent
    // fightCard,
    // findingOpponent$,
    // controlFindingOpponentOb$
  );
  initRestartingGame(container, fightCard);
  initFindingNewOpponent(
    controlFindingOpponentOb$,
    container,
    fightCard,
    findingOpponent$
  );

  initChangeWeightClass(container);
  initChangeFighter(container);
  initNewPick(container);

  initRestartView(container, fightCard);

  //let gameOb$ = createGameObs(container, fightCard);
  //gameSub(gameOb$);
}

export function findNewOpponent(
  container: HTMLElement,
  fightCard: FightCard,
  opponent: Opponent
): void {
  updateTopDiv(opponent, container);
  resetGameDiv(container);
  fightCard = new FightCard();
}

export function restartView(
  container: HTMLElement,
  fightCard: FightCard
): void {
  resetGameDiv(container);
  fightCard = new FightCard();
}

export function restartGame(
  container: HTMLElement,
  fightCard: FightCard
): void {
  resetTopDiv(container);
  resetGameDiv(container);
  fightCard = new FightCard();
}

export function addNewPick(container: HTMLDivElement, fightCard: FightCard) {
  if(!checkAddingPick(container,fightCard)){

  }
}

function checkAddingPick(container: HTMLDivElement, fightCard: FightCard): boolean {
  if(fightCard.fights.length == 10){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You cannot add more than 10 fights on one fight card!',
    });
    return false
  }
  const blueCornerOption = getOptionValue(container, CLASSES.BLUE_CORNER_SEL);
  const redCornerOption = getOptionValue(container, CLASSES.RED_CORNER_SEL);
  if(blueCornerOption === redCornerOption){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You selected two same fighters for the same fight!',
    });
    return false;
  }
  
  
}

export function setScore(
  score: number,
  placeHolder: HTMLElement,
  selection: string
): void {
  let label = selectElement(placeHolder, selection);
  setLabel(label, score.toString());
}

export function setScoreForBoth(score: number, placeHolder: HTMLElement): void {
  setScore(score, placeHolder, CLASSES.YOUR_POINTS);
  setScore(score, placeHolder, CLASSES.OPP_POINTS);
}

export function setOpponent(opponent: Opponent, container: HTMLElement): void {
  let opponentPicture: HTMLImageElement = selectPicture(
    container,
    CLASSES.OPP_PICTURE
  );
  setPicture(opponentPicture, opponent.pictureSrc);

  let opponentNameLabel = selectElement(container, CLASSES.OPP_NAME_LABEL);
  setLabel(opponentNameLabel, `Difficulty: ${opponent.name}`);
  let opponentDifficultyLabel = selectElement(
    container,
    CLASSES.OPP_DIFF_LABEL
  );
  setLabel(opponentDifficultyLabel, `Difficulty: ${opponent.difficulty}`);
}

export function getRandomOpponent(opponents: Opponent[]): Opponent {
  const index = Math.trunc(Math.random() * opponents.length);
  return opponents[index];
}

export function getDifficulties(
  findingOpponentDiv: HTMLDivElement
): DifficultyLevel {
  let difficultyString = getOptionValue(
    findingOpponentDiv,
    CLASSES.DIFFIULTY_SEL
  );
  return DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
}

export function getWeightClasses(container: HTMLDivElement): WeightClass {
  let weightClassString = getOptionValue(container, CLASSES.WEIGHT_CLASS_SEL);
  return WeightClass[weightClassString as keyof typeof WeightClass];
}

export function getFighterId(
  container: HTMLDivElement,
  selection: string
): number {
  let fighterId = parseInt(getOptionValue(container, selection));
  return fighterId;
}

export function resetGameDiv(container: HTMLElement): void {
  let yourFightCardDiv = selectElement(container, CLASSES.YOUR_FIGHTCARD_DIV);
  clearChilds(yourFightCardDiv);
  let opponentFightCardDiv = selectElement(
    container,
    CLASSES.OPP_FIGHTCARD_DIV
  );
  clearChilds(opponentFightCardDiv);
  let resultFightCardDiv = selectElement(
    container,
    CLASSES.RESULT_FIGHTCARD_DIV
  );
  clearChilds(resultFightCardDiv);
}

export function updateTopDiv(opponent: Opponent, container: HTMLElement): void {
  setOpponent(opponent, container);
  setScoreForBoth(INITIAL.SCORE, container);
}

export function resetTopDiv(container: HTMLElement): void {
  setScoreForBoth(INITIAL.SCORE, container);
}

export function fillFightersSelect(
  container: HTMLDivElement,
  fightersArray: Fighter[]
): void {
  let blueCornerSelect = selectSelectionEl(container, CLASSES.BLUE_CORNER_SEL);
  let redCornerSelect = selectSelectionEl(container, CLASSES.RED_CORNER_SEL);
  clearSelect(blueCornerSelect);
  clearSelect(redCornerSelect);

  let namesOfFigters: string[] = [];
  let idsOfFighters: string[] = [];

  fightersArray.forEach((fighter) => {
    namesOfFigters.push(fighter.name);
    idsOfFighters.push(fighter.id.toString());
  });

  setSelectOptions(blueCornerSelect, namesOfFigters, idsOfFighters);
  setSelectOptions(redCornerSelect, namesOfFigters, idsOfFighters);

  let fighter = new Fighter(
    fightersArray[INITIAL.INDEX_OF_FIGHTER].id,
    fightersArray[INITIAL.INDEX_OF_FIGHTER].name,
    fightersArray[INITIAL.INDEX_OF_FIGHTER].weightClass,
    fightersArray[INITIAL.INDEX_OF_FIGHTER].standup,
    fightersArray[INITIAL.INDEX_OF_FIGHTER].grappling
  );

  fillFightersRating(container, fighter, CLASSES.BLUE_CORNER_DIV);
  fillFightersRating(container, fighter, CLASSES.RED_CORNER_DIV);
}

export function fillFightersRating(
  container: HTMLDivElement,
  fighter: Fighter,
  selection: string
): void {
  let fighterDiv: HTMLElement = selectElement(container, selection);

  let standupRating: HTMLElement = selectElement(
    fighterDiv,
    CLASSES.STANDUP_LAB
  );
  setLabel(standupRating, fighter.standup.toString());
  let grapplingRating: HTMLElement = selectElement(
    fighterDiv,
    CLASSES.GRAPPLING_LAB
  );
  setLabel(grapplingRating, fighter.grappling.toString());
  let overallRating: HTMLElement = selectElement(
    fighterDiv,
    CLASSES.OVERALL_LAB
  );
  setLabel(overallRating, fighter.calculateOverall().toString());
}