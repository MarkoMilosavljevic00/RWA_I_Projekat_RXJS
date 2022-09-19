import { renderDivs, renderElements } from "../view/view";
import { Fight } from "./fight";

export class FightCard{
  fights: Fight[];
  
  constructor(){
    this.fights = [];
  }

  renderFightDivs(container: HTMLElement) {

    this.fights.forEach((fight) => {
      if(!container.contains(fight.fightDiv)){
        renderDivs(container, fight.fightDiv);
      }
    })
  }
}
