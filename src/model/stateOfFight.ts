import { add } from "date-fns";
import { ro } from "date-fns/locale";
import { FightPosition } from "../enums/FightPositionEnum";
import { Round } from "../enums/RoundEnum";

export class StateOfFight {
  round: Round = Round.Round_1;
  time: Date = new Date(0);
  position: FightPosition = FightPosition.StandUp;

  getRound() {
    return this.round;
  }

  getTime() {
    return this.time;
  }

  getPosition(): FightPosition {
    return this.position;
  }

  setRound(round: Round) {
    this.round = round;
  }

  setPosition(position: FightPosition): FightPosition {
    return (this.position = position);
  }

  resetTime() {
    this.time = new Date(0);
  }

  addSecond() {
    this.time = add(this.time, { seconds: 1 });
  }
}
