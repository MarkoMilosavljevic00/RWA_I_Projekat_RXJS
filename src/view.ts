import { CLASSES_OF_ELEMENTS, INITIAL_SCORE } from "./constants";
import { DifficultyLevel } from "./enums/DifficultyLevelEnum";
import { Opponent } from "./models/opponent";

export function createFindingOpponentElements(
  findingOpponentDiv: HTMLDivElement
): HTMLDivElement {
  let findingOpponentLabel = document.createElement("label");
  let findingOpponentSelect = document.createElement("select");
  let findingOpponentButton = document.createElement("button");

  findingOpponentDiv.className = CLASSES_OF_ELEMENTS.FINDING_OPP_DIV;
  findingOpponentButton.className = CLASSES_OF_ELEMENTS.FINDING_OPP_BTN;

  findingOpponentLabel.innerHTML = "Choose Difficulty Level:";
  findingOpponentButton.innerHTML = "Find Opponent";

  const difficulties = Object.values(DifficultyLevel);
  difficulties.forEach((difficulty) => {
    let findOpponentOption = document.createElement("option");
    findOpponentOption.value = difficulty;
    findOpponentOption.innerHTML = difficulty;
    findingOpponentSelect.appendChild(findOpponentOption);
  });

  findingOpponentDiv.appendChild(findingOpponentLabel);
  findingOpponentDiv.appendChild(findingOpponentSelect);
  findingOpponentDiv.appendChild(findingOpponentButton);

  return findingOpponentDiv;
}

export function drawDivs(host: HTMLElement, ...childDivs: HTMLDivElement[]) {
  childDivs.forEach((child) => host.appendChild(child));
}

export function replaceContainer(
  host: HTMLElement,
  newContainer: HTMLDivElement,
  oldContainer: HTMLDivElement
) {
  host.removeChild(oldContainer);
  host.appendChild(newContainer);
  newContainer.className = "container";
}

export function createTopDivElements(
  topDiv: HTMLDivElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
) {
  topDiv.className = CLASSES_OF_ELEMENTS.TOP_DIV

  var yourPointsDiv = document.createElement("div");
  var opponentStatsDiv = document.createElement("div");
  //var opponentPictureDiv = document.createElement("div");
  var opponentPointsDiv = document.createElement("div");

  var yourPointsLabel = document.createElement("label");
  yourPointsLabel.innerHTML = "Your Points:";
  yourPointsDiv.appendChild(yourPointsLabel);
  var yourPoints = document.createElement("label");
  yourPoints.className = CLASSES_OF_ELEMENTS.YOUR_POINTS;
  yourPointsDiv.appendChild(yourPoints);

  var opponentPointsLabel = document.createElement("label");
  opponentPointsLabel.innerHTML = "Opponents Points:";
  opponentPointsDiv.appendChild(opponentPointsLabel);
  var opponentPoints = document.createElement("label");
  opponentPoints.className = CLASSES_OF_ELEMENTS.OPP_POINTS;
  opponentPointsDiv.appendChild(opponentPoints);

  var restartButton = document.createElement("button");
  restartButton.className = CLASSES_OF_ELEMENTS.RESTART_BTN;
  restartButton.innerHTML = "Restart Game";
  findingOpponentDiv.appendChild(restartButton);

  var opponentNameLabel = document.createElement("label");
  opponentNameLabel.className = CLASSES_OF_ELEMENTS.OPP_NAME_LABEL;
  opponentNameLabel.innerHTML = `Name: ${opponent.name}`;
  opponentStatsDiv.appendChild(opponentNameLabel);

  var opponentDifficultyLabel = document.createElement("label");
  opponentDifficultyLabel.className = CLASSES_OF_ELEMENTS.OPP_DIFFICULTY_LABEL;
  opponentDifficultyLabel.innerHTML = `Difficulty level: ${opponent.difficulty}`;
  opponentStatsDiv.appendChild(opponentDifficultyLabel);

  drawDivs(topDiv, yourPointsDiv, findingOpponentDiv, opponentStatsDiv, opponentPointsDiv)
}

export function createGameDivElements(
  topDiv: HTMLDivElement,
  findingOpponentDiv: HTMLDivElement,
  opponent: Opponent
) {
  throw new Error("Function not implemented.");
}
export function setResult(score: number, topDiv: HTMLDivElement) {
  var yourPoints = topDiv.querySelector(`.${CLASSES_OF_ELEMENTS.YOUR_POINTS}`);
  var opponentPoints = topDiv.querySelector(`.${CLASSES_OF_ELEMENTS.OPP_POINTS}`);

  yourPoints.innerHTML = score.toString();
  opponentPoints.innerHTML = score.toString();
}



