import { NUMBER_OF_RATINGS } from "../../environment";
import { WeightClass } from "../enums/WeightClassEnum";

export class Fighter {
  id: number;
  name: string;
  weightClass: WeightClass;
  standup: number;
  grappling: number;

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
    let overall = Math.round((this.standup + this.grappling) / NUMBER_OF_RATINGS);
    return overall;
  }
}
