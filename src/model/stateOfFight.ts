import { add } from "date-fns";
import { ro } from "date-fns/locale";
import { FightPosition } from "../enums/FightPositionEnum";
import { Round } from "../enums/RoundEnum";
import { Rules } from "../enums/RulesEnum";
import { RULES } from "../environment";

export class StateOfFight {
  round: Round = Round.Round_1;
  time: Date = new Date(0);
  position: FightPosition = FightPosition.StandUp;

  fightIsOver: boolean = false;

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

  isOver() {
    return this.fightIsOver;
  }

  addSecond() {
    this.time = add(this.time, { seconds: 1 });
  }

  tickSecond(container: HTMLElement, rules: Rules) {
    this.addSecond();
    if (this.isRoundOver(rules)) {
      this.nextRound();
    }
  }

  isRoundOver(rules: Rules) {
    switch (rules) {
      case Rules.MMA:
        if (
          this.time.getMinutes() === RULES.MMA.ROUND_LENGTH.MINUTES &&
          this.time.getSeconds() === RULES.MMA.ROUND_LENGTH.SECONDS
        ) {
          return true;
        } else return false;
      case Rules.Boxing:
        break;
      case Rules.KickBoxing:
        break;
      case Rules.Grappling:
        break;
    }
  }

  nextRound() {
    //round++
    switch (this.round) {
      case Round.Round_1:
        this.resetTime();
        //this.currentState.addRound();
        this.setRound(Round.Round_2);
        return false;
      case Round.Round_2:
        this.resetTime();
        //this.currentState.addRound();
        this.setRound(Round.Round_3);
        return false;
      case Round.Round_3:
        this.fightIsOver = true;
        return true;
  }
}
