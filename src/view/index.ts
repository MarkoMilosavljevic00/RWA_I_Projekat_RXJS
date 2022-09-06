import { Difficult } from "../enums/DifficultEnum";

export function createInitialElements(): HTMLDivElement {
    var initialDiv = document.createElement("div");
    initialDiv.className = "initialDiv";

    let findingOppponentDiv = document.createElement("div");
    findingOppponentDiv.className = "findOpponentDiv";

    let findingOpponentLabel = document.createElement("label");
    let findingOpponentSelect = document.createElement("select");
    let findingOpponentButton = document.createElement("button");
    
    findingOpponentButton.innerHTML = "Nadji protivnika"
    findingOpponentLabel.innerHTML = "Izaberite tezinu protivnika:"

    let difficulties = Object.values(Difficult);
    difficulties.forEach(difficulty => {
        let findOpponentOption = document.createElement("option");
        findOpponentOption.value = difficulty;
        findOpponentOption.innerHTML = difficulty;
        findingOpponentSelect.appendChild(findOpponentOption);
    });
    
    initialDiv.appendChild(findingOpponentLabel);
    initialDiv.appendChild(findingOpponentSelect);
    initialDiv.appendChild(findingOpponentButton);

    return initialDiv
}

export function drawInitialDiv(mainDiv: HTMLDivElement, initialDiv: HTMLDivElement) {
    mainDiv.appendChild(initialDiv);
}
