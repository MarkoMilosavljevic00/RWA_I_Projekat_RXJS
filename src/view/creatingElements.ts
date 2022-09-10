import { CLASSES_OF_ELEMENTS, INDEXES, INITIAL } from "../constants";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Opponent } from "../model/opponent";

export function createFindingOpponentElements() :HTMLElement[] {
  let findingOpponentLabel = document.createElement("label");
  findingOpponentLabel.innerHTML = "Choose Difficulty Level:";
  
  let findingOpponentSelect = createFindingOpponentSelect();

  let findingOpponentButton = document.createElement("button");
  findingOpponentButton.innerHTML = "Find Opponent";
  findingOpponentButton.className = CLASSES_OF_ELEMENTS.FINDING_OPP_BTN;

  return [findingOpponentLabel, findingOpponentSelect, findingOpponentButton];
}

function createFindingOpponentSelect() {
  let findingOpponentSelect = document.createElement("select");
  const difficulties = Object.values(DifficultyLevel);
  difficulties.forEach((difficulty) => {
    let findOpponentOption = document.createElement("option");
    findOpponentOption.value = difficulty;
    findOpponentOption.innerHTML = difficulty;
    findingOpponentSelect.appendChild(findOpponentOption);
  });
  return findingOpponentSelect;
}

export function createTopElements(
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
) {
  //let opponentPictureDiv = document.createElement("div");

  let pointsDivs = createPointsElements();
  let yourPointsDiv = pointsDivs[INDEXES.FIRST_SCORE];
  let opponentPointsDiv = pointsDivs[INDEXES.SECOND_SCORE];
  
  createRestartButton(findingOpponentDiv);
  
  let opponentStatsDiv = createOpponentStatsDiv(opponent);

  return[
    yourPointsDiv,
    findingOpponentDiv,
    opponentStatsDiv,
    opponentPointsDiv
  ];
}

function createRestartButton(findingOpponentDiv: HTMLDivElement) {
  let restartButton = document.createElement("button");
  restartButton.className = CLASSES_OF_ELEMENTS.RESTART_BTN;
  restartButton.innerHTML = "Restart Game";
  findingOpponentDiv.appendChild(restartButton);
}

function createOpponentStatsDiv(opponent: Opponent) {
  let opponentStatsDiv = document.createElement("div");
  opponentStatsDiv.className = CLASSES_OF_ELEMENTS.OPP_STATS_DIV;

  let opponentNameLabel = document.createElement("label");
  opponentNameLabel.className = CLASSES_OF_ELEMENTS.OPP_NAME_LABEL;
  //opponentNameLabel.innerHTML = `Name: ${opponent.name}`;
  opponentStatsDiv.appendChild(opponentNameLabel);

  let opponentDifficultyLabel = document.createElement("label");
  opponentDifficultyLabel.className = CLASSES_OF_ELEMENTS.OPP_DIFF_LABEL;
  //opponentDifficultyLabel.innerHTML = `Difficulty level: ${opponent.difficulty}`;
  opponentStatsDiv.appendChild(opponentDifficultyLabel);

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

  return [yourPointsDiv, opponentPointsDiv]
}

export function createYourPicksElements() {
  let yourPicksLabel = document.createElement("label");
  yourPicksLabel.innerHTML = "Your Picks: ";

  let yourFightCardDiv = document.createElement("div");
  yourFightCardDiv.className = CLASSES_OF_ELEMENTS.YOUR_FIGHTCARD_DIV;

  let addFightPickBtn = document.createElement("button");
  addFightPickBtn.innerHTML = "Add New Fight Pick";
  addFightPickBtn.className = CLASSES_OF_ELEMENTS.ADD_PICK_BTN;

  let playBtn = document.createElement("button");
  playBtn.innerHTML = "PLAY";
  playBtn.className = CLASSES_OF_ELEMENTS.PLAY_BTN;

  return [yourPicksLabel, yourFightCardDiv, addFightPickBtn, playBtn];
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
