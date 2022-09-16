import { CLASSES, INDEXES, INITIAL } from "../constants";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { WeightClass } from "../enums/WeightClassEnum";
import { initNewPickDiv } from "./initalizingElements";

export function createFindingOpponentElements(): HTMLElement[] {
  let findingOpponentLabel = document.createElement("label");
  findingOpponentLabel.innerHTML = "Choose Difficulty Level:";

  const difficulties = Object.values(DifficultyLevel);
  let findingOpponentSelect = createSelect(CLASSES.DIFFIULTY_SEL);
  setSelectOptions(findingOpponentSelect, difficulties, difficulties);

  let findingOpponentButton = document.createElement("button");
  findingOpponentButton.innerHTML = "Find Opponent";
  findingOpponentButton.className = CLASSES.FINDING_OPP_BTN;

  return [findingOpponentLabel, findingOpponentSelect, findingOpponentButton];
}

// function createWeightClassSelect() {
//   let findingOpponentSelect = document.createElement("select");
//   const difficulties = Object.values(DifficultyLevel);
//   difficulties.forEach((difficulty) => {
//     let findOpponentOption = document.createElement("option");
//     findOpponentOption.value = difficulty;
//     findOpponentOption.innerHTML = difficulty;
//     findingOpponentSelect.appendChild(findOpponentOption);
//   });
//   return findingOpponentSelect;
// }

// function createFindingOpponentSelect() {
//   let findingOpponentSelect = document.createElement("select");
//   findingOpponentSelect.className = CLASSES_OF_ELEMENTS.DIFFIULTY_SEL;

//   const difficulties = Object.values(DifficultyLevel);
//   difficulties.forEach((difficulty) => {
//     let findOpponentOption = document.createElement("option");
//     findOpponentOption.value = difficulty;
//     findOpponentOption.innerHTML = difficulty;
//     findingOpponentSelect.appendChild(findOpponentOption);
//   });
//   return findingOpponentSelect;
//}

export function createTopElements(findingOpponentDiv: HTMLDivElement) {
  let pointsDivs = createPointsElements();
  let yourPointsDiv = pointsDivs[INDEXES.FIRST_SCORE];
  let opponentPointsDiv = pointsDivs[INDEXES.SECOND_SCORE];

  createRestartButton(findingOpponentDiv);

  let opponentStatsDiv = createOpponentStatsDiv();

  return [
    yourPointsDiv,
    findingOpponentDiv,
    opponentStatsDiv,
    opponentPointsDiv,
  ];
}

export function createRestartButton(findingOpponentDiv: HTMLDivElement) {
  let restartButton = document.createElement("button");
  restartButton.className = CLASSES.RESTART_BTN;
  restartButton.innerHTML = "Restart Game";
  findingOpponentDiv.appendChild(restartButton);
}

export function createOpponentStatsDiv() {
  let opponentStatsDiv = document.createElement("div");
  opponentStatsDiv.className = CLASSES.OPP_STATS_DIV;

  let opponentPicture = new Image(100, 80);
  opponentPicture.className = CLASSES.OPP_PICTURE;

  let opponentNameLabel = document.createElement("label");
  opponentNameLabel.className = CLASSES.OPP_NAME_LABEL;

  let opponentDifficultyLabel = document.createElement("label");
  opponentDifficultyLabel.className = CLASSES.OPP_DIFF_LABEL;

  renderElements(
    opponentStatsDiv,
    opponentPicture,
    opponentNameLabel,
    opponentDifficultyLabel
  );

  return opponentStatsDiv;
}

export function createPointsElements() {
  let yourPointsDiv = document.createElement("div");
  yourPointsDiv.className = CLASSES.YOUR_POINTS_DIV;
  let opponentPointsDiv = document.createElement("div");
  opponentPointsDiv.className = CLASSES.OPP_POINTS_DIV;

  let yourPointsLabel = document.createElement("label");
  yourPointsLabel.innerHTML = "Your Points:";
  yourPointsDiv.appendChild(yourPointsLabel);
  let yourPoints = document.createElement("label");
  yourPoints.className = CLASSES.YOUR_POINTS;
  yourPointsDiv.appendChild(yourPoints);

  let opponentPointsLabel = document.createElement("label");
  opponentPointsLabel.innerHTML = "Opponents Points:";
  opponentPointsDiv.appendChild(opponentPointsLabel);
  let opponentPoints = document.createElement("label");
  opponentPoints.className = CLASSES.OPP_POINTS;
  opponentPointsDiv.appendChild(opponentPoints);

  return [yourPointsDiv, opponentPointsDiv];
}

export function createYourPicksElements(): HTMLElement[] {
  let yourPicksLabel = document.createElement("label");
  yourPicksLabel.innerHTML = "Your Picks: ";

  let yourFightCardDiv = document.createElement("div");
  yourFightCardDiv.className = CLASSES.YOUR_FIGHTCARD_DIV;

  let playBtn = document.createElement("button");
  playBtn.innerHTML = "PLAY";
  playBtn.className = CLASSES.PLAY_BTN;

  let newPickDiv = initNewPickDiv();

  return [yourPicksLabel, yourFightCardDiv, newPickDiv, playBtn];
}

export function createOpponentPicksElements() {
  let opponentPicksLabel = document.createElement("label");
  opponentPicksLabel.innerHTML = "Opponent Picks: ";

  let opponentFightCardDiv = document.createElement("div");
  opponentFightCardDiv.className = CLASSES.OPP_FIGHTCARD_DIV;

  return [opponentPicksLabel, opponentFightCardDiv];
}

export function createResultsElements() {
  let resultLabel: HTMLLabelElement = document.createElement("label");
  resultLabel.innerHTML = "Results: ";

  let resultFightCardDiv: HTMLDivElement = document.createElement("div");
  resultFightCardDiv.className = CLASSES.RESULT_FIGHTCARD_DIV;
  return [resultLabel, resultFightCardDiv];
}

export function createNewPickElements() {
  let topNewPickDiv = createTopNewPickDiv();
  let bottomNewPickDiv = createBottomNewPickDiv();

  let addFightPickBtn = document.createElement("button");
  addFightPickBtn.innerHTML = "Add new pick";
  addFightPickBtn.className = CLASSES.ADD_PICK_BTN;

  return [topNewPickDiv, bottomNewPickDiv, addFightPickBtn];
}

export function createBottomNewPickDiv() {
  let bottomNewPickDiv = document.createElement("div");
  bottomNewPickDiv.className = CLASSES.BOTTOM_NEW_PICK_DIV;

  let blueCornerDiv = createCornerDiv(
    CLASSES.BLUE_CORNER_DIV,
    CLASSES.BLUE_CORNER_SEL
  );
  let redCornerDiv = createCornerDiv(
    CLASSES.RED_CORNER_DIV,
    CLASSES.RED_CORNER_SEL
  );

  let outcomeDiv = createOutcomeDiv();

  renderElements(bottomNewPickDiv, blueCornerDiv, outcomeDiv, redCornerDiv);
  return bottomNewPickDiv;
}

export function createOutcomeDiv() {
  let outcomeDiv = document.createElement("div");
  outcomeDiv.className = CLASSES.OUTCOME_DIV;
  const methodes = Object.values(Method);
  let methodSelect = createSelect(CLASSES.METHOD_SEL);
  setSelectOptions(methodSelect, methodes, methodes);
  const rounds = Object.values(Round);
  let roundSelect = createSelect(CLASSES.ROUND_SEL);
  setSelectOptions(roundSelect, rounds, rounds);
  renderElements(outcomeDiv, methodSelect, roundSelect);

  return outcomeDiv;
}

export function createCornerDiv(selectionDiv: string, selectionSel: string) {
  let cornerDiv = document.createElement("div");
  cornerDiv.className = selectionDiv;
  let cornerSelect = createSelect(selectionSel);
  let cornerRadio = document.createElement("input");
  cornerRadio.type = "radio";
  cornerRadio.name = CLASSES.CORNER_RADIO;
  let fighterStatsDiv = createFighterStats();

  renderElements(cornerDiv, cornerSelect, cornerRadio, fighterStatsDiv);
  return cornerDiv;
}

function createFighterStats() {
  let fighterStatsDiv = document.createElement("div");
  fighterStatsDiv.className = CLASSES.FIGHTER_STATS_DIV;

  let standupRatingLabel = document.createElement("div");
  standupRatingLabel.innerHTML = "Standup: ";

  let grapplingRatingLabel = document.createElement("div");
  grapplingRatingLabel.innerHTML = "Grappling:";

  let overallRatingLabel = document.createElement("div");
  overallRatingLabel.innerHTML = "Overall: ";

  let standupRating = document.createElement("label");
  standupRating.className = CLASSES.STANDUP_LAB;
  let grapplingRating = document.createElement("label");
  grapplingRating.className = CLASSES.GRAPPLING_LAB;
  let overallRating = document.createElement("label");
  overallRating.className = CLASSES.OVERALL_LAB;

  renderElements(
    fighterStatsDiv,
    standupRatingLabel,
    standupRating,
    grapplingRatingLabel,
    grapplingRating,
    overallRatingLabel,
    overallRating
  );

  return fighterStatsDiv;
}

export function createTopNewPickDiv() {
  let topNewPickDiv = document.createElement("div");
  topNewPickDiv.className = CLASSES.TOP_NEW_PICK_DIV;

  let chooseWeightClassLabel = document.createElement("label");
  chooseWeightClassLabel.innerHTML = "Choose Weight Class";

  const weightClasses = Object.values(WeightClass);
  let weightClassSelect = createSelect(CLASSES.WEIGHT_CLASS_SEL);
  setSelectOptions(weightClassSelect, weightClasses, weightClasses);
  renderElements(topNewPickDiv, chooseWeightClassLabel, weightClassSelect);
  return topNewPickDiv;
}

export function createSelect(classEl: string) {
  let select = document.createElement("select");
  select.className = classEl;
  return select;
}

export function renderDivs(host: HTMLElement, ...childDivs: HTMLDivElement[]) {
  childDivs.forEach((child) => host.appendChild(child));
}

export function renderElements(host: HTMLElement, ...childs: HTMLElement[]) {
  childs.forEach((child) => host.appendChild(child));
}

export function replaceContainer(
  host: HTMLElement,
  newContainer: HTMLDivElement,
  oldContainer: HTMLDivElement
) {
  host.removeChild(oldContainer);
  host.appendChild(newContainer);
}

export function clearChilds(container: HTMLElement): void {
  let childs = container.childNodes;
  childs.forEach((child) => {
    container.removeChild(child);
    child.remove();
  });
}

export function clearSelect(select: HTMLSelectElement): void{
  let optionsLength = select.options.length;
  for (let i = optionsLength; i>= 0; i--){
    select.remove(i);
  }
}

export function setLabel(label: HTMLElement, newText: string) {
  label.innerHTML = newText;
}

export function setPicture(pictureEl: HTMLImageElement, pictureSrc: string) {
  pictureEl.src = `${pictureSrc}`;
}

export function setSelectOptions(
  select: HTMLSelectElement,
  optionNames: string[],
  optionValues: string[]
): void {
  optionValues.forEach((optionValue, index) => {
    let option = document.createElement("option");
    option.value = optionValue;
    option.innerHTML = optionNames[index];
    select.appendChild(option);
  });
}

export function getOptionValue(
  container: HTMLDivElement,
  selection: string
): string {
  let select: HTMLSelectElement = selectSelectionEl(container, selection);
  let value = select.options[select.selectedIndex].value;
  return value;
}

export function getValuesOfFighterSelect(container: HTMLDivElement): number[] {
  let blueSelect = selectSelectionEl(
    container,
    CLASSES.BLUE_CORNER_SEL
  );
  let redSelect = selectSelectionEl(
    container,
    CLASSES.RED_CORNER_SEL
  );

  let blueValue = parseInt(blueSelect.options[blueSelect.selectedIndex].value);
  let redValue = parseInt(redSelect.options[redSelect.selectedIndex].value);

  return [blueValue, redValue];
}

export function selectElement(
  placeHolder: HTMLElement,
  selection: string
): HTMLElement {
  let element: HTMLElement = placeHolder.querySelector(`.${selection}`);
  return element;
}

export function selectPicture(
  placeHolder: HTMLElement,
  selection: string
): HTMLImageElement {
  let picture: HTMLImageElement = placeHolder.querySelector(`.${selection}`);
  return picture;
}

export function selectSelectionEl(
  container: HTMLDivElement,
  selection: string
): HTMLSelectElement {
  let select: HTMLSelectElement = container.querySelector(`.${selection}`);
  return select;
}
