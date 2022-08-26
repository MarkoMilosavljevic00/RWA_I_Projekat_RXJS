import { Observable } from "rxjs";
import { Fighter } from "./fighter";

export class Fight{
    fighters: Fighter[];
    fighter$: Observable<Fighter[]>;

    constructor(fighters: Fighter[]){
        this.fighters = fighters;
    }

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