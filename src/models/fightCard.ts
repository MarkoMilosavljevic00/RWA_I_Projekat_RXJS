import { Message } from "../enums/message.enum";
import { DEFAULT, POINTS } from "../utilities/constants";
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
            return Message.SameFighters;

        if(newFight.redCorner.id === DEFAULT.FIGHTER.ID || newFight.blueCorner.id === DEFAULT.FIGHTER.ID)
          return Message.NoFighterSelected

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

    reset(){
      this.fights = [];
      this.currentFightIndex = undefined;
      this.yourTotalPoints = POINTS.INITIAL;
      this.opponentTotalPoints = POINTS.INITIAL;
    }
}