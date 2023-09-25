import Swal from "sweetalert2";
import { Rules } from "../enums/rules.enum";
import { ValueWithWeight } from "../models/valueWithWeight";
import { CLASS_NAMES, DAMAGE, RULES } from "./constants";

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

export function getRandomValueWithWeightedProbabilities<T>(valuesWithProbability: ValueWithWeight<T>[]): T {
    const totalProbability = valuesWithProbability.reduce((sum, curr) => sum + curr.weight, 0);
    let random = Math.random() * totalProbability;

    for (const val of valuesWithProbability) {
        if (random < val.weight) {
            return val.value;
        }
        random -= val.weight;
    }

    return valuesWithProbability[0].value;
}

export function getRandomValueWithWeightedProbability<T>(values: ValueWithWeight<T>[]): T {
    let sumOfProbabilities = values.reduce((sum: number, curr: ValueWithWeight<T>) => sum + curr.weight, 0);
    for(let value of values) {
        let random = Math.random();
        //console.log("Random broj: " + random + " Treba da bude unutar: " + value.weight / sumOfProbabilities + "");
        if(random < value.weight / sumOfProbabilities) {
            //console.log("Vratio: " + value.value);
            return value.value;
        } else {
            sumOfProbabilities -= value.weight;
        }   
    };
    return null;
}

export function getRandomValueWithProbability<T>(
    values: T[],
    finalValue: T,
    probability: number
): T {
    let random = Math.random();
    console.log(random)
    if (random < probability) {
        console.log("uso u dobro")
        return finalValue;
    } else {
        console.log("uso u lose")
        let otherValues = values.filter((value) => value !== finalValue);
        console.log("other values: " + otherValues);
        if(otherValues.length !== 0)
            return getRandomValue<T>(otherValues);
        else 
            return finalValue;
    }
}

export function getRandomValue<T>(values: T[]) {
    let index = Math.floor(Math.random() * values.length);
    return values[index];
}

export function calculateEmitProbability(totalTicks: number, desiredEmits: number): number {
    return desiredEmits / totalTicks;
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

export function disableElement(element: HTMLElement) {
    if (!element.classList.contains(CLASS_NAMES.STATES.DISABLED))
        element.classList.add(CLASS_NAMES.STATES.DISABLED);
}

export function enableElement(element: HTMLElement) {
    if (element.classList.contains(CLASS_NAMES.STATES.DISABLED))
        element.classList.remove(CLASS_NAMES.STATES.DISABLED);
}

export function showError(text: string): boolean {
    Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: `${text}`,
    });
    return false;
}

export function showVictory(): void {
    Swal.fire({
        icon: "success",
        title: "Congratulations, you won!",
        text: `You won the game! If you want to play again, click on button Play Again!`,
    });
}

export function showDefeat(): void {
    Swal.fire({
        icon: "error",
        title: "You lost!",
        text: `Unfortunately you lost but don't give up, click on button Play Again and try again!`,
    });
}

export function showDraw(): void {
    Swal.fire({
        icon: "question",
        title: `It's draw!`,
        text: `It's draw, you and your opponent have the same score! If you want to play again, click on button Play Again!`,
    });
}
