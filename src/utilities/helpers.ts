import Swal from "sweetalert2";
import { ValueProbability } from "../models/valueProbability";
import { CLASS_NAMES } from "./constants";

export function selectElementByClass(placeHolder: HTMLElement, className: string): HTMLElement {
    let element: HTMLElement = placeHolder.querySelector(`.${className}`);
    return element;
}

export function selectElementsByClass(
    placeHolder: HTMLElement,
    className: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(`.${className}`);
    return elements;
}

export function selectElementByClassAndType(
    placeHolder: HTMLElement,
    className: string,
    typeOfElement: string
): HTMLElement {
    let element: HTMLElement = placeHolder.querySelector(`.${className} ${typeOfElement}`);
    return element;
}

export function selectElementsByClassAndType(
    placeHolder: HTMLElement,
    className: string,
    typeOfElement: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(
        `.${className} ${typeOfElement}`
    );
    return elements;
}

export function selectElementsByBeginOfClass(
    placeHolder: HTMLElement,
    className: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(
        `div[class^="${className}"]`
    );
    return elements;
}

export function selectElementsByTwoClasses(
    placeHolder: HTMLElement,
    firstClassName: string,
    secondClassName: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(
        `.${firstClassName}.${secondClassName}`
    );
    return elements;
}

export function selectElementsByPartialClass(
    placeHolder: HTMLElement,
    partOfClassName: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(
        `[class*="${partOfClassName}"]`
    );
    return elements;
}

export function setSelectOptions(
    select: HTMLSelectElement,
    optionNames: string[],
    optionValues: string[],
    optionsClass: string
) {
    let currentOptions = selectElementsByClass(select, optionsClass);
    currentOptions.forEach((currentOption) => {
        select.removeChild(currentOption);
    });

    optionValues.forEach((optionValue, index) => {
        let option = document.createElement("option");
        option.value = optionValue;
        option.innerHTML = optionNames[index];
        option.classList.add(optionsClass);
        select.appendChild(option);
    });
    select.selectedIndex = 0;
}

export function setSelectsOptionsFromValues(
    container: HTMLElement,
    selectClassName: string,
    optionClassName: string,
    value: Object
) {
    const values = Object.values(value);
    let selects = selectElementsByClass(container, selectClassName);
    selects.forEach((select) =>
        setSelectOptions(select as HTMLSelectElement, values, values, optionClassName)
    );
}

export function setSelectOptionsToNumber(
    container: HTMLElement,
    selectClassName: string,
    optionClassName: string,
    num: Number
) {
    let selects = selectElementsByClass(container, selectClassName);
    let values: string[] = [];
    for (let i = 1; i <= num; i++) values.push(i.toString());
    selects.forEach((select) =>
        setSelectOptions(select as HTMLSelectElement, values, values, optionClassName)
    );
}

export function appendItemToList(
    container: HTMLElement,
    numberOfItem: number,
    itemClassName: string,
    listClassName: string,
    templateClassName: string
): HTMLElement {
    let listDiv = selectElementByClass(container, listClassName);
    let tempDiv = selectElementByClass(container, templateClassName);
    let item = tempDiv.cloneNode(true) as HTMLElement;

    item.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
    item.classList.remove(templateClassName);
    item.classList.add(`${itemClassName + numberOfItem}`);
    listDiv.appendChild(item);
    return item;
}

export function fillProgressBars(
    container: HTMLElement,
    className: string,
    ...percentageValues: number[]
) {
    let progressBars = selectElementsByClass(container, className);
    let percentageStrings = getPercentageStrings(...percentageValues);
    progressBars.forEach((bar, index) => {
        bar.style.width = percentageStrings[index];
        bar.innerHTML = percentageStrings[index];
    });
}

export function clearElement(
    container: HTMLElement,
    listClassName: string,
    itemsClassName: string
) {
    let element = selectElementByClass(container, listClassName);
    let items = selectElementsByPartialClass(element, itemsClassName);
    items.forEach((item) => {
        element.removeChild(item);
    });
}

export function getSelectedValue(container: HTMLElement, className: string): string {
    let select: HTMLSelectElement = selectElementByClass(container, className) as HTMLSelectElement;
    let value = select.options[select.selectedIndex].value;
    return value;
}

export function getCheckedRadioValue(className: string): string {
    let selectedRadio: HTMLInputElement = document.querySelector(
        `input[name=${className}]:checked`
    );
    let value = selectedRadio.value;
    return value;
}

export function getPercentageStrings(...percentages: number[]): string[] {
    let percentageStrings: string[] = [];
    percentages.forEach((percent) => {
        percentageStrings.push(`${percent}%`);
    });
    return percentageStrings;
}

export function getRandomValueWithWeightedProbabilities<T>(values: ValueProbability<T>[]): T {
    const totalProbability = values.reduce((sum, vp) => sum + vp.probability, 0);
    let random = Math.random() * totalProbability;

    for (const vp of values) {
        if (random < vp.probability) {
            return vp.value;
        }
        random -= vp.probability;
    }

    return values[0].value;
}

export function getRandomValueWithProbability<T>(
    values: T[],
    finalValue: T,
    probability: number
): T {
    let random = Math.random();
    //console.log(random)
    if (random < probability) {
        //console.log("uso u dobro")
        return finalValue;
    } else {
        //console.log("uso u lose")
        let otherValues = values.filter((value) => value !== finalValue);
        // let index = Math.floor(Math.random() * otherValues.length);
        // return otherValues[index];
        return getRandomValue<T>(otherValues);
    }
}

export function getRandomValue<T>(values: T[]) {
    let index = Math.floor(Math.random() * values.length);
    return values[index];
}

export function mapStringToEnum<T>(value: string, enumObject: Object): T {
    const enumValues = Object.values(enumObject);
    if (enumValues.includes(value)) {
        return enumValues.find((enumValue) => enumValue === value);
    }
    return undefined;
}

export function mapNumberToIndex(numberOfItem: number){
    return numberOfItem - 1;
}

export function showElement(element: HTMLElement) {
    if (element.classList.contains(CLASS_NAMES.STATES.COLLAPSE))
        element.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
}

export function hideElement(element: HTMLElement) {
    if (!element.classList.contains(CLASS_NAMES.STATES.COLLAPSE))
        element.classList.add(CLASS_NAMES.STATES.COLLAPSE);
}

export function showError(text: string): boolean {
    Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: `${text}`,
    });
    return false;
}

// export function showVictory(yourScore: number, opponentScore: number): void {
//     Swal.fire({
//         icon: "success",
//         title: "Congratulations, you won!",
//         text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
//             TIME.PLAY_AGAIN / 1000
//         } seconds or click on button Play Again!`,
//     });
// }

// export function showDefeat(yourScore: number, opponentScore: number): void {
//     Swal.fire({
//         icon: "error",
//         title: "You lost!",
//         text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
//             TIME.PLAY_AGAIN / 1000
//         } seconds or click on button Play Again!`,
//     });
// }

// export function showDraw(yourScore: number, opponentScore: number): void {
//     Swal.fire({
//         icon: "question",
//         title: `It's draw!`,
//         text: `It's ${yourScore} : ${opponentScore}. You can play again in ${
//             TIME.PLAY_AGAIN / 1000
//         } seconds or click on button Play Again!`,
//     });
// }
