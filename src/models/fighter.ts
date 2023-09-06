import { Rules } from "../enums/rules.enum";
import { Weightclass } from "../enums/weightclass.enum";
import { RULES } from "../utilities/constants";

export class Fighter {
    id: number;
    name: string;
    pictureSrc: string;
    rule: Rules;
    weightclass: Weightclass;
    striking: number;
    grappling: number;
    get overall(): number {
        if (this.rule === Rules.MMA)
            return Math.round(
                (this.striking + this.grappling) / RULES.NUMBER_OF_SKILLS.MMA
            );
        else if (this.rule === Rules.Boxing || this.rule === Rules.Kickboxing)
            return this.striking;
        else return this.grappling;
    }

    constructor(
        id: number,
        name: string,
        pictureSrc: string,
        rule: Rules,
        weightclass: Weightclass,
        striking: number,
        grappling: number
    ) {
        this.id = id;
        this.name = name;
        this.pictureSrc = pictureSrc;
        this.rule = rule;
        this.weightclass = weightclass;
        this.striking = striking;
        this.grappling = grappling;
    }

    getSkillsStrings():string[] {
      let skills = [this.striking, this.grappling, this.overall];
      let skillsString: string[] = [];
      skills.forEach((skill, index) => {
          skillsString.push(`${skill}%`)
      })
      return skillsString;
  }
}
