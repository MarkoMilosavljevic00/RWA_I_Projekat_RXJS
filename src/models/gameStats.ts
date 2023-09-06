import { Opponent } from "./opponent";

export class GameStats{
    yourPoints: number;
    opponentPoints: number;
    opponent: Opponent;

    constructor(){
        this.yourPoints = 0;
        this.opponentPoints = 0;
    }
}