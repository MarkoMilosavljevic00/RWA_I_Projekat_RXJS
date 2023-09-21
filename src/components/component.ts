import { selectElementByClass, selectElementsByClass } from "../utilities/helpers";

export class Component{
    container: HTMLElement;

    getElement(className: string): HTMLElement{
        return selectElementByClass(this.container, className);
    }

    getElements(className: string): NodeListOf<HTMLElement>{
        return selectElementsByClass(this.container, className);
    }
}