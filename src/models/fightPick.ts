import { Observable } from "rxjs";
import { Fighter } from "./fighter";
import { Result } from "./result";

export class FightPick{
    blueCorner: Fighter;
    redCorner: Fighter;

    yourPick: Result;
    opponentPick: Result;

    result: Result;

    //fighter$: Observable<Fighter[]>;

    getFavourite(fighters: Fighter[]){
        if(fighters[0].rating() > fighters[1].rating())
            return 0
        else 
            return 1
    }

    getUnderDog(fighters: Fighter[]){
        if(fighters[0].rating() < fighters[1].rating())
            return 0
        else 
            return 1
    }


    
}