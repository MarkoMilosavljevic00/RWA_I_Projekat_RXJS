import Swal from "sweetalert2";
import {
  CLASSES,
  PLAY_AGAIN_TIMER,
} from "../../environment";
import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { Winner } from "../enums/WinnerEnum";
import { Result } from "../model/result";

export function renderDivs(host: HTMLElement, ...childDivs: HTMLDivElement[]) {
  childDivs.forEach((child) => host.appendChild(child));
}

export function renderElements(host: HTMLElement, ...childs: HTMLElement[]) {
  childs.forEach((child) => host.appendChild(child));
}

export function roundWinner(
  pick: Result,
  blueCornerDiv: HTMLDivElement,
  redCornerDiv: HTMLDivElement
) {
  if (pick.winner === Winner.BLUE_CORNER) {
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
  let blueSelect = selectSelectionEl(container, CLASSES.BLUE_CORNER_SEL);
  let redSelect = selectSelectionEl(container, CLASSES.RED_CORNER_SEL);

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

export function disableMultipleElements(container: HTMLElement, ...selections: string[]){
  selections.forEach(selection => {
    disableElement(container, selection);
  });
}

export function enableMultipleElements(container: HTMLElement, ...selections: string[]){
  selections.forEach(selection => {
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
      PLAY_AGAIN_TIMER / 1000
    } seconds or click on button Play Again!`,
  });
}

export function showDefeat(yourScore: number, opponentScore: number): void {
  Swal.fire({
    icon: "error",
    title: "You lost!",
    text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
      PLAY_AGAIN_TIMER / 1000
    } seconds or click on button Play Again!`,
  });
}

export function showDraw(yourScore: number, opponentScore: number): void {
  Swal.fire({
    icon: "question",
    title: `It's draw!`,
    text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
      PLAY_AGAIN_TIMER / 1000
    } seconds or click on button Play Again!`,
  });
}