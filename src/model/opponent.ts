import { DifficultyLevel } from "../enums/DifficultyLevelEnum";

export interface Opponent {
  id: number;
  name: string;
  difficulty: DifficultyLevel;
  pictureSrc: string;
}
