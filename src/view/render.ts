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
  // newContainer.className = CLASSES_OF_ELEMENTS.CONTAINER;
}

export function setLabel(
  label: HTMLElement,
  newText: string
) {
  label.innerHTML = newText;
}

export function selectElement(placeHolder: HTMLElement, selection: string){
  let element: HTMLElement = placeHolder.querySelector(`.${selection}`);
  return element;
}
