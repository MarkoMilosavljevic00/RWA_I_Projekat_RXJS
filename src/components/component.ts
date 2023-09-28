import { hideElement, selectElementByClass, selectElementsByClass, showElement } from "../utilities/helpers";

export class Component{
    container: HTMLElement;

    getElement(className: string): HTMLElement{
        return selectElementByClass(this.container, className);
    }

    getElements(className: string): NodeListOf<HTMLElement>{
        return selectElementsByClass(this.container, className);
    }

    showElement(className: string) {
        let element = selectElementByClass(this.container, className);
        showElement(element);
    }

    hideElement(className: string) {
        let element = selectElementByClass(this.container, className);
        hideElement(element);
    }
}