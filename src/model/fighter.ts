import { FIGHTER,PERCENT, RULES } from "../environment";
import { WeightClass } from "../enums/WeightClassEnum";

export class Fighter {
  id: number;
  name: string;

  weightClass: WeightClass;

  standup: number;
  grappling: number;
  
  damagePercent: number = FIGHTER.DAMAGE.INITIAL;

  constructor(
    id: number,
    name: string,
    weightClass: WeightClass,
    standup: number,
    grappling: number
  ) {
    this.id = id;
    this.name = name;
    this.weightClass = weightClass;
    this.standup = standup;
    this.grappling = grappling;
  }

  calcOverall() {
    let overall = Math.round((this.standup + this.grappling) / RULES.MMA.NUMBER_OF_RATINGS);
    return overall;
  }

  normalizeFighterDamage() {
    if (this.damagePercent > FIGHTER.DAMAGE.MAX) {
      this.damagePercent = FIGHTER.DAMAGE.MAX;
    }
  }

  isFighterFinished() {
    if(this.damagePercent === FIGHTER.DAMAGE.MAX){
      return true;
    } else return false;
  }
}
