import Swal from "sweetalert2";
import { CLASS_NAMES } from "./constants";

export function selectElementByClass(
    placeHolder: HTMLElement,
    className: string
): HTMLElement {
    let element: HTMLElement = placeHolder.querySelector(`.${className}`);
    return element;
}

export function selectElementsByClass(
    placeHolder: HTMLElement,
    className: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(
        `.${className}`
    );
    return elements;
}

export function selectElementByClassAndType(
    placeHolder: HTMLElement,
    className: string,
    typeOfElement: string
): HTMLElement {
    let element: HTMLElement = placeHolder.querySelector(
        `.${className} ${typeOfElement}`
    );
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

export function selectElementsByPartialClass(
    placeHolder: HTMLElement,
    partOfClassName: string
): NodeListOf<HTMLElement> {
    let elements: NodeListOf<HTMLElement> = placeHolder.querySelectorAll(`[class*="${partOfClassName}"]`);
    return elements;
}

export function setSelectOptions(
    className: HTMLSelectElement,
    optionNames: string[],
    optionValues: string[]
): void {
    optionValues.forEach((optionValue, index) => {
        let option = document.createElement("option");
        option.value = optionValue;
        option.innerHTML = optionNames[index];
        className.appendChild(option);
    });
}

export function getSelectedValue(
    container: HTMLDivElement,
    className: string
): string {
    let select: HTMLSelectElement = selectElementByClass(
        container,
        className
    ) as HTMLSelectElement;
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

export function mapStringToEnum<T>(value: string, enumObject: Object): T {
    const enumValues = Object.values(enumObject);
    if (enumValues.includes(value)) {
        return enumValues.find((enumValue) => enumValue === value);
    }
    return undefined;
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
