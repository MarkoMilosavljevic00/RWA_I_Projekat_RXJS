import { CLASSES_OF_ELEMENTS } from "../constants";

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
  newContainer.className = CLASSES_OF_ELEMENTS.CONTAINER;
}

export function setResult(score: number, yourPointsDiv: HTMLDivElement, opponentPointsDiv: HTMLDivElement) {
  let yourPoints = yourPointsDiv.querySelector(`.${CLASSES_OF_ELEMENTS.YOUR_POINTS}`);
  let opponentPoints = opponentPointsDiv.querySelector(`.${CLASSES_OF_ELEMENTS.OPP_POINTS}`);

  yourPoints.innerHTML = score.toString();
  opponentPoints.innerHTML = score.toString();
}