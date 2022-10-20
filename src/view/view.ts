import Swal from "sweetalert2";
import { ELEMENTS, MAP_KEYS, TIME } from "../environment";
import { Method } from "../enums/MethodEnum";
import { Odds } from "../enums/OddEnum";
import { Round } from "../enums/RoundEnum";
import { Corner } from "../enums/CornerEnum";
import { Fight } from "../model/fight";
import { Result } from "../model/result";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";

export function renderDivs(host: HTMLElement, ...childDivs: HTMLDivElement[]) {
  childDivs.forEach((child) => host.appendChild(child));
}

export function renderElements(host: HTMLElement, ...childs: HTMLElement[]) {
  childs.forEach((child) => host.appendChild(child));
}

function printElement(
  container: HTMLElement,
  newText: string,
  selection: string
) {
  let label = selectElement(container, selection);
  setLabel(label, newText);
}

export function printRoundAndTime(
  container: HTMLElement,
  currentRound: Round,
  currentTime: Date
) {
  printElement(container, currentRound, ELEMENTS.LIVE_ROUND_LAB);
  let timeString = getTimeString(currentTime);
  printElement(container, timeString, ELEMENTS.LIVE_COUNTER_LAB);
}

export function printFightInStream(
  currentFight: Fight,
  fightNumber: number,
  container: HTMLElement
) {
  printElement(
    container,
    fightNumber.toString(),
    ELEMENTS.LIVE_FIGHT_NUM_LAB
  );

  printElement(
    container,
    currentFight.blueCorner.name,
    ELEMENTS.BLUE_STREAM_NAME_LAB
  );
  printElement(
    container,
    currentFight.redCorner.name,
    ELEMENTS.RED_STREAM_NAME_LAB
  );

  printOdd(
    container,
    currentFight,
    ELEMENTS.BLUE_STREAM_ODDS_LAB,
    Corner.BLUE_CORNER
  );
  printOdd(
    container,
    currentFight,
    ELEMENTS.RED_STREAM_ODDS_LAB,
    Corner.RED_CORNER
  );

  printElement(
    container,
    currentFight.blueCorner.damagePercent.toString(),
    ELEMENTS.BLUE_STREAM_DAMAGE_LAB
  );
  printElement(
    container,
    currentFight.redCorner.damagePercent.toString(),
    ELEMENTS.RED_STREAM_DAMAGE_LAB
  );
}

function printOdd(
  container: HTMLElement,
  currentFight: Fight,
  selectionLabel: string,
  corner: Corner
) {
  let streamOddsLabel = selectElement(container, selectionLabel);
  let odds = currentFight.getOdds();

  if (odds.get(MAP_KEYS.ODDS.FAVOURITE) === corner) {
    streamOddsLabel.innerHTML = "FAVOURITE";
    streamOddsLabel.style.color = "green";
  } else if (odds.get(MAP_KEYS.ODDS.FAVOURITE) === undefined) {
    streamOddsLabel.innerHTML = "EQUAL";
    streamOddsLabel.style.color = "yellow";
  } else {
    streamOddsLabel.innerHTML = "UNDERDOG";
    streamOddsLabel.style.color = "red";
  }
}

export function roundWinner(
  pick: Result,
  blueCornerDiv: HTMLDivElement,
  redCornerDiv: HTMLDivElement
) {
  if (pick.winner === Corner.BLUE_CORNER) {
    blueCornerDiv.style.border = "solid";
    blueCornerDiv.style.borderColor = "green";
  } else {
    redCornerDiv.style.border = "solid";
    redCornerDiv.style.borderColor = "green";
  }
}

export function replaceContainer(
  host: HTMLElement,
  newContainer: HTMLDivElement,
  oldContainer: HTMLDivElement
) {
  host.removeChild(oldContainer);
  host.appendChild(newContainer);
}

export function replaceContainerWithSelections(
  hostSelection: string,
  newContainerSelection: string,
  oldContainerSelection: string
) {
  let host = selectElement(document.body, hostSelection);
  let newContainer = selectElement(host, newContainerSelection);
  let oldContainer = selectElement(host, oldContainerSelection);
  host.removeChild(oldContainer);
  host.appendChild(newContainer);
}

export function clearChilds(container: HTMLElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

export function clearSelect(select: HTMLSelectElement): void {
  let optionsLength = select.options.length;
  for (let i = optionsLength; i >= 0; i--) {
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

function getTimeString(currentTime: Date) {
  let minutesString: string = currentTime.getMinutes() <= 9 ? "0" : "";
  minutesString = minutesString + currentTime.getMinutes();
  let secondsString: string = currentTime.getSeconds() <= 9 ? "0" : "";
  secondsString = secondsString + currentTime.getSeconds();

  let timeString: string = minutesString + " : " + secondsString;
  return timeString;
}

export function getStringsOfMethods(methodesEnum: Method[]) {
  let methodes: string[] = [];
  methodesEnum.forEach((methodEnum) => {
    switch (methodEnum) {
      case Method.Decision:
        methodes.push("Decision");
        break;
      case Method.KO_TKO:
        methodes.push("KO/TKO");
        break;
      case Method.Submission:
        methodes.push("Submission");
        break;

      default:
        break;
    }
  });
  return methodes;
}

export function getStringsOfRounds(roundsEnum: Round[]) {
  let rounds: string[] = [];
  roundsEnum.forEach((methodEnum) => {
    switch (methodEnum) {
      case Round.Round_1:
        rounds.push("I Round");
        break;
      case Round.Round_2:
        rounds.push("II Round");
        break;
      case Round.Round_3:
        rounds.push("III Round");
        break;

      default:
        break;
    }
  });
  return rounds;
}

export function getCheckedRadioValue(
  container: HTMLDivElement,
  selection: string
): string {
  let selectedRadio: HTMLInputElement = document.querySelector(
    `input[name=${selection}]:checked`
  );
  let value = selectedRadio.value;
  return value;
}

export function getSelectedValue(
  container: HTMLDivElement,
  selection: string
): string {
  let select: HTMLSelectElement = selectSelectionEl(container, selection);
  let value = select.options[select.selectedIndex].value;
  return value;
}

export function getValuesOfFighterSelect(container: HTMLDivElement): number[] {
  let blueSelect = selectSelectionEl(container, ELEMENTS.BLUE_CORNER_SEL);
  let redSelect = selectSelectionEl(container, ELEMENTS.RED_CORNER_SEL);

  let blueValue = parseInt(blueSelect.options[blueSelect.selectedIndex].value);
  let redValue = parseInt(redSelect.options[redSelect.selectedIndex].value);

  return [blueValue, redValue];
}

export function getCurrentDifficulty(container: HTMLElement): DifficultyLevel {
  let difficultyString = selectElement(
    container,
    ELEMENTS.OPP_DIFF_LABEL
  ).innerHTML;
  let difficulty =
    DifficultyLevel[difficultyString as keyof typeof DifficultyLevel];
  return difficulty;
}

export function getYourPickFromForm(container: HTMLDivElement): Result {
  let winnerValue = getCheckedRadioValue(container, ELEMENTS.CORNER_RADIO);
  let winner = Corner[winnerValue as keyof typeof Corner];
  let methodValue = getSelectedValue(container, ELEMENTS.METHOD_SEL);
  let method = Method[methodValue as keyof typeof Method];
  let roundValue: string;
  if (methodValue === Method.Decision) {
    roundValue = Round.Round_3.toString();
  } else {
    roundValue = getSelectedValue(container, ELEMENTS.ROUND_SEL);
  }
  let round = Round[roundValue as keyof typeof Round];
  let yourPick = new Result(winner, method, round);
  return yourPick;
}

export function putElementInOrder(
  container: HTMLElement,
  frontElementSelection: string,
  lastElementSelection: string,
  orderNumOFFirst: number,
  orderNumOFSecond: number
) {
  let frontElement = selectElement(container, frontElementSelection);
  let lastElement = selectElement(container, lastElementSelection);
  frontElement.style.order = orderNumOFFirst.toString();
  lastElement.style.order = orderNumOFSecond.toString();
}

export function selectElement(
  placeHolder: HTMLElement,
  selection: string
): HTMLElement {
  let element: HTMLElement = placeHolder.querySelector(`.${selection}`);
  return element;
}

export function selectButton(
  placeHolder: HTMLElement,
  selection: string
): HTMLButtonElement {
  let element: HTMLButtonElement = placeHolder.querySelector(`.${selection}`);
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

export function disableMultipleElements(
  container: HTMLElement,
  ...selections: string[]
) {
  selections.forEach((selection) => {
    disableElement(container, selection);
  });
}

export function enableMultipleElements(
  container: HTMLElement,
  ...selections: string[]
) {
  selections.forEach((selection) => {
    enableElement(container, selection);
  });
}

export function disableElement(container: HTMLElement, selection: string) {
  let element = selectElement(container, selection);
  element.style.visibility = `hidden`;
}

export function enableElement(container: HTMLElement, selection: string) {
  let element = selectElement(container, selection);
  element.style.visibility = `visible`;
}

export function showError(text: string): boolean {
  Swal.fire({
    icon: "warning",
    title: "Oops...",
    text: `${text}`,
  });
  return false;
}

export function showVictory(yourScore: number, opponentScore: number): void {
  Swal.fire({
    icon: "success",
    title: "Congratulations, you won!",
    text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
      TIME.PLAY_AGAIN / 1000
    } seconds or click on button Play Again!`,
  });
}

export function showDefeat(yourScore: number, opponentScore: number): void {
  Swal.fire({
    icon: "error",
    title: "You lost!",
    text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
      TIME.PLAY_AGAIN / 1000
    } seconds or click on button Play Again!`,
  });
}

export function showDraw(yourScore: number, opponentScore: number): void {
  Swal.fire({
    icon: "question",
    title: `It's draw!`,
    text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
      TIME.PLAY_AGAIN / 1000
    } seconds or click on button Play Again!`,
  });
}
