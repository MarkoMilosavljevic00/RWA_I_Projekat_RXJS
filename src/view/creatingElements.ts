import { CLASSES_OF_ELEMENTS, INDEXES, INITIAL } from "../constants";
import { initNewPickDiv, selectElement } from "../controller/gameLogic";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { WeightClass } from "../enums/WeightClassEnum";
import { Opponent } from "../model/opponent";
import { renderElements } from "./render";

export function createFindingOpponentElements(): HTMLElement[] {
  let findingOpponentLabel = document.createElement("label");
  findingOpponentLabel.innerHTML = "Choose Difficulty Level:";

  const difficulties = Object.values(DifficultyLevel);
  let findingOpponentSelect = createSelect(
    CLASSES_OF_ELEMENTS.DIFFIULTY_SEL,
    difficulties
  );

  let findingOpponentButton = document.createElement("button");
  findingOpponentButton.innerHTML = "Find Opponent";
  findingOpponentButton.className = CLASSES_OF_ELEMENTS.FINDING_OPP_BTN;

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

function createRestartButton(findingOpponentDiv: HTMLDivElement) {
  let restartButton = document.createElement("button");
  restartButton.className = CLASSES_OF_ELEMENTS.RESTART_BTN;
  restartButton.innerHTML = "Restart Game";
  findingOpponentDiv.appendChild(restartButton);
}

function createOpponentStatsDiv() {
  let opponentStatsDiv = document.createElement("div");
  opponentStatsDiv.className = CLASSES_OF_ELEMENTS.OPP_STATS_DIV;

  let opponentPicture = new Image(100, 80);
  opponentPicture.className = CLASSES_OF_ELEMENTS.OPP_PICTURE;

  let opponentNameLabel = document.createElement("label");
  opponentNameLabel.className = CLASSES_OF_ELEMENTS.OPP_NAME_LABEL;

  let opponentDifficultyLabel = document.createElement("label");
  opponentDifficultyLabel.className = CLASSES_OF_ELEMENTS.OPP_DIFF_LABEL;

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
  yourPointsDiv.className = CLASSES_OF_ELEMENTS.YOUR_POINTS_DIV;
  let opponentPointsDiv = document.createElement("div");
  opponentPointsDiv.className = CLASSES_OF_ELEMENTS.OPP_POINTS_DIV;

  let yourPointsLabel = document.createElement("label");
  yourPointsLabel.innerHTML = "Your Points:";
  yourPointsDiv.appendChild(yourPointsLabel);
  let yourPoints = document.createElement("label");
  yourPoints.className = CLASSES_OF_ELEMENTS.YOUR_POINTS;
  yourPointsDiv.appendChild(yourPoints);

  let opponentPointsLabel = document.createElement("label");
  opponentPointsLabel.innerHTML = "Opponents Points:";
  opponentPointsDiv.appendChild(opponentPointsLabel);
  let opponentPoints = document.createElement("label");
  opponentPoints.className = CLASSES_OF_ELEMENTS.OPP_POINTS;
  opponentPointsDiv.appendChild(opponentPoints);

  return [yourPointsDiv, opponentPointsDiv];
}

export function createYourPicksElements(): HTMLElement[] {
  let yourPicksLabel = document.createElement("label");
  yourPicksLabel.innerHTML = "Your Picks: ";

  let yourFightCardDiv = document.createElement("div");
  yourFightCardDiv.className = CLASSES_OF_ELEMENTS.YOUR_FIGHTCARD_DIV;

  let playBtn = document.createElement("button");
  playBtn.innerHTML = "PLAY";
  playBtn.className = CLASSES_OF_ELEMENTS.PLAY_BTN;

  let newPickDiv = initNewPickDiv();

  return [yourPicksLabel, yourFightCardDiv, newPickDiv, playBtn];
}

export function createOpponentPicksElements() {
  let opponentPicksLabel = document.createElement("label");
  opponentPicksLabel.innerHTML = "Opponent Picks: ";

  let opponentFightCardDiv = document.createElement("div");
  opponentFightCardDiv.className = CLASSES_OF_ELEMENTS.OPP_FIGHTCARD_DIV;

  return [opponentPicksLabel, opponentFightCardDiv];
}

export function createResultsElements() {
  let resultLabel: HTMLLabelElement = document.createElement("label");
  resultLabel.innerHTML = "Results: ";

  let resultFightCardDiv: HTMLDivElement = document.createElement("div");
  resultFightCardDiv.className = CLASSES_OF_ELEMENTS.RESULT_FIGHTCARD_DIV;
  return [resultLabel, resultFightCardDiv];
}

export function createNewPickElements() {
  let topNewPickDiv = createTopNewPickDiv();
  let bottomNewPickDiv = createBottomNewPickDiv();

  let addFightPickBtn = document.createElement("button");
  addFightPickBtn.innerHTML = "Add new pick";
  addFightPickBtn.className = CLASSES_OF_ELEMENTS.ADD_PICK_BTN;

  return [topNewPickDiv, bottomNewPickDiv, addFightPickBtn];
}

function createBottomNewPickDiv() {
  let bottomNewPickDiv = document.createElement("div");
  bottomNewPickDiv.className = CLASSES_OF_ELEMENTS.BOTTOM_NEW_PICK_DIV;

  let blueCornerDiv = createCornerDiv(
    CLASSES_OF_ELEMENTS.BLUE_CORNER_DIV,
    CLASSES_OF_ELEMENTS.BLUE_CORNER_SEL
  );
  let redCornerDiv = createCornerDiv(
    CLASSES_OF_ELEMENTS.RED_CORNER_DIV,
    CLASSES_OF_ELEMENTS.RED_CORNER_SEL
  );

  let outcomeDiv = createOutcomeDiv();

  renderElements(bottomNewPickDiv, blueCornerDiv, outcomeDiv, redCornerDiv);
  return bottomNewPickDiv;
}

function createOutcomeDiv() {
  let outcomeDiv = document.createElement("div");
  outcomeDiv.className = CLASSES_OF_ELEMENTS.OUTCOME_DIV;
  const methodes = Object.values(Method);
  let methodSelect = createSelect(CLASSES_OF_ELEMENTS.METHOD_SEL, methodes);
  const rounds = Object.values(Round);
  let roundSelect = createSelect(CLASSES_OF_ELEMENTS.ROUND_SEL, rounds);
  renderElements(outcomeDiv, methodSelect, roundSelect);

  return outcomeDiv;
}

function createCornerDiv(selectionDiv: string, selectionSel: string) {
  let cornerDiv = document.createElement("div");
  cornerDiv.className = selectionDiv;
  let cornerSelect = createSelect(selectionSel);
  let cornerRadio = document.createElement("input");
  cornerRadio.type = "radio";
  cornerRadio.name = CLASSES_OF_ELEMENTS.CORNER_RADIO;
  renderElements(cornerDiv, cornerSelect, cornerRadio);

  return cornerDiv;
}

function createTopNewPickDiv() {
  let topNewPickDiv = document.createElement("div");
  topNewPickDiv.className = CLASSES_OF_ELEMENTS.TOP_NEW_PICK_DIV;

  let chooseWeightClassLabel = document.createElement("label");
  chooseWeightClassLabel.innerHTML = "Choose Weight Class";

  const weightClasses = Object.values(WeightClass);
  let weightClassSelect = createSelect(
    CLASSES_OF_ELEMENTS.WEIGHT_CLASS_SEL,
    weightClasses
  );
  renderElements(topNewPickDiv, chooseWeightClassLabel, weightClassSelect);
  return topNewPickDiv;
}

// Ovu popravi ne valja nista, treba samo da pravi select a posle imas drugu funkciju da je popunis
function createSelect(classEl: string, optionStrings?: string[]) {
  let select = document.createElement("select");
  select.className = classEl;

  if (optionStrings) {
    optionStrings.forEach((optionString) => {
      let option = document.createElement("option");
      option.value = optionString;
      option.innerHTML = optionString;
      select.appendChild(option);
    });
  }
  return select;
}
