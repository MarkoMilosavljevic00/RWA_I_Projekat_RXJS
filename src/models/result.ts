import { Corner } from "../enums/corner.enum";
import { Method } from "../enums/method.enum";

export interface Result {
    winner: Corner;
    method: Method;
    round: number;
}  