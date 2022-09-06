// import { Observable } from "rxjs";
// import { Opponent } from "./models/opponent";
// import { findOppponent } from "./observables";

import { Difficult } from "./enums/DifficultEnum";
import { createInitialElements, drawInitialDiv } from "./view";


// let opponentButton = document.createElement("button");
// document.body.appendChild(opponentButton);

// let opp$: Observable<Opponent>;
// opp$ = findOppponent(opponentButton);

// let opponentNameLabel = document.createElement("label");
// let opponentDifficultLabel = document.createElement("label");

// opp$.subscribe((opponent: Opponent)=>{
//     console.log(opponent);
//     opponentNameLabel.innerHTML = opponent.name;
//     opponentDifficultLabel.innerHTML = opponent.difficult;
    

//     document.body.appendChild(opponentNameLabel);
//     document.body.appendChild(opponentDifficultLabel);
// })

let mainDiv: HTMLDivElement = document.createElement("div");
document.body.appendChild(mainDiv);

// let topDiv: HTMLDivElement;
// let midDiv: HTMLDivElement;

let initialDiv: HTMLDivElement = createInitialElements();

drawInitialDiv(
    mainDiv,
    initialDiv
)

