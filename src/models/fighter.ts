import { Rules } from "../enums/rules.enum";
import { Weightclass } from "../enums/weightclass.enum";
import { RULES } from "../utilities/constants";

export class Fighter {
  id: number;
  name: string;
  rule: Rules;
  weightclass: Weightclass;
  pictureSrc: string;
  striking: number;
  grappling: number;

  get overall(): number {
    if(this.rule === Rules.MMA)
        return Math.round((this.striking + this.grappling) / RULES.NUMBER_OF_SKILLS.MMA);
    else if(this.rule === Rules.Boxing || this.rule === Rules.Kickboxing)
        return this.striking;
    else 
        return this.grappling
  }
}
