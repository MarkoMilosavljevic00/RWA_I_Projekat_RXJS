import { DifficultyLevel } from "../enums/difficulty-level.enum";

export interface Opponent {
  id: number;
  name: string;
  difficulty: DifficultyLevel;
  pictureSrc: string;
}
