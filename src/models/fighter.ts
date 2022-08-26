import { WeightClass } from "../enums/WeightClassesEnum";

export class Fighter{
    id: number;
    name: string;
    weightclass: WeightClass;
    standup: number;
    grappling: number;

    constructor(
        id: number,
        name: string,
        weightclass: WeightClass,
        standup: number,
        grappling: number,
    ){
        this.id = id;
        this.name = name;
        this.weightclass = weightclass;
        this.standup = standup;
        this.grappling = grappling;
    }

    rating(){
        return (this.standup + this. grappling)/2;
    }
}