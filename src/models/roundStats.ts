import { Corner } from "../enums/corner.enum";
import { FightStats } from "./fightStats";

export interface RoundStats extends FightStats{
    winner: Corner
}