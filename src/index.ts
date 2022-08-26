import { Observable } from "rxjs";
import { Opponent } from "./models/opponent";
import { findOppponent } from "./observables";


let opponentButton = document.createElement("button");
document.body.appendChild(opponentButton);

let opp$: Observable<Opponent>;
opp$ = findOppponent(opponentButton);

let opponentNameLabel = document.createElement("label");
let opponentDifficultLabel = document.createElement("label");

opp$.subscribe((opponent: Opponent)=>{
    console.log(opponent);
    opponentNameLabel.innerHTML = opponent.name;
    opponentDifficultLabel.innerHTML = opponent.difficult;
    

    document.body.appendChild(opponentNameLabel);
    document.body.appendChild(opponentDifficultLabel);
})

