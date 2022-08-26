import { Difficult } from "../enums/DifficultEnum";

export interface Opponent{
    id: number;
    name: string;
    difficult: Difficult;
}