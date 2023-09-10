import { Message } from "../enums/message.enum";
import { showError } from "../utilities/helpers";
import { Fight } from "./fight";

export class FightCard{
    fights: Fight[];
    yourTotalPoints: number = 0;
    opponentTotalPoints: number = 0;
    currentFightIndex: number | undefined;

    constructor(){
        this.fights = [];
    }

    addFight(newFight: Fight){
        if(this.fights.length >= 10)
            return Message.MaxLength;

        if(newFight.redCorner.id === newFight.blueCorner.id)
        {
            console.log(newFight.redCorner.id, newFight.blueCorner.id);
            return Message.SameFighters;
        }

        let duplicate: boolean;
        this.fights.forEach((fight) => {
          let blueCornerPreviousValue = fight.blueCorner.id;
          let redCornerPreviousValue = fight.redCorner.id;
        
          if (
            (blueCornerPreviousValue === newFight.blueCorner.id &&
              redCornerPreviousValue === newFight.redCorner.id) ||
            (blueCornerPreviousValue === newFight.redCorner.id &&
              redCornerPreviousValue === newFight.blueCorner.id)
          ) {
            duplicate = true;
          }
        });
        if (duplicate == true) {
          return Message.Duplicate;
        }

        this.fights.push(newFight);
        return Message.Success;
    }

    removeFight(fightIndex: number) {
        this.fights.splice(fightIndex, 1);
    }
}