import { Rules } from "../enums/rules.enum";
import { Weightclass } from "../enums/weightclass.enum";
import { DEFAULT, RULES } from "../utilities/constants";

export class Fighter {
    
    id: number;
    name: string;
    pictureSrc?: string;
    rule: Rules;
    weightclass: Weightclass;
    striking: number;
    grappling: number;
    get overall(): number {
        if (this.rule === Rules.MMA)
            return Math.round((this.striking + this.grappling) / RULES.NUMBER_OF_SKILLS.MMA);
        else if (this.rule === Rules.Boxing || this.rule === Rules.Kickboxing)
            return this.striking;
        else return this.grappling;
    }


    constructor(fighter?: Fighter) {
        if(fighter){
            this.id = fighter.id;
            this.name = fighter.name;
            if(fighter.pictureSrc)
                this.pictureSrc = fighter.pictureSrc;
            else
                this.pictureSrc = DEFAULT.FIGHTER.PICTURE_SRC;
            this.rule = fighter.rule;
            this.weightclass = fighter.weightclass;
            this.striking = fighter.striking;
            this.grappling = fighter.grappling;
        }
        else{
            this.id = DEFAULT.FIGHTER.ID;
            this.name = DEFAULT.FIGHTER.NAME,
            this.pictureSrc = DEFAULT.FIGHTER.PICTURE_SRC,
            this.striking = DEFAULT.FIGHTER.STRIKING,
            this.grappling = DEFAULT.FIGHTER.GRAPPLING
        }
    }
}
