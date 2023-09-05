import { Corner, mapStringToCorner } from "../enums/corner.enum";
import { Message } from "../enums/message.enum";
import { mapStringToMethod, Method } from "../enums/method.enum";
import { Rules } from "../enums/rules.enum";
import { Fight } from "../models/fight";
import { FightCard } from "../models/fightCard";
import { Fighter } from "../models/fighter";
import { Result } from "../models/result";
import { CLASS_NAMES, TYPE_OF_ELEMENTS } from "../utilities/constants";
import { getCheckedRadioValue, getSelectedValue, mapStringToEnum, selectElementByClass, selectElementByClassAndType, selectElementsByBeginOfClass, selectElementsByClass, showError } from "../utilities/helpers";

export class PickerComponent{
    fightCard: FightCard;
    fightNumber: number = 0;
    currentRedCorner: Fighter;
    currentBlueCorner: Fighter;
    container: HTMLElement;

    constructor(fightCard: FightCard){
        this.fightCard = fightCard;
        this.container = selectElementByClass(document.body, CLASS_NAMES.PICKER_CONTAINER)
    }

    setFighter(fighter: Fighter, corner: Corner){
        let cornerImg: HTMLImageElement;
        let skillBars: NodeListOf<HTMLElement>;
        let winnerLabel: HTMLLabelElement; 

        if(corner == Corner.RedCorner){
            this.currentRedCorner = fighter;
            cornerImg = selectElementByClass(this.container, CLASS_NAMES.RED_CORNER_IMG) as HTMLImageElement
            skillBars = selectElementsByClass(this.container, CLASS_NAMES.RED_CORNER_SKILL_BARS);
            winnerLabel = selectElementByClass(this.container, CLASS_NAMES.RED_CORNER_WINNER_LABEL) as HTMLLabelElement;
        }
        else{
            this.currentBlueCorner = fighter;
            cornerImg = selectElementByClass(this.container, CLASS_NAMES.BLUE_CORNER_IMG) as HTMLImageElement
            skillBars = selectElementsByClass(this.container, CLASS_NAMES.BLUE_CORNER_SKILL_BARS);
            winnerLabel = selectElementByClass(this.container, CLASS_NAMES.BLUE_CORNER_WINNER_LABEL) as HTMLLabelElement;
        }
        cornerImg.src = fighter.pictureSrc;
        winnerLabel.innerHTML = fighter.name;

        skillBars[0].style.width = fighter.striking.toString();
        skillBars[1].style.width = fighter.grappling.toString();
        skillBars[2].style.width = fighter.overall.toString();

        skillBars[0].innerHTML = fighter.striking.toString();
        skillBars[1].innerHTML = fighter.grappling.toString();
        skillBars[2].innerHTML = fighter.overall.toString();
    }

    getFightPredict(fight: Fight) : Fight{
        let pick: Result = new Result();
        pick.winner = mapStringToEnum<Corner>(getCheckedRadioValue(CLASS_NAMES.WINNER_RADIO), Corner);
        pick.method = mapStringToEnum<Method>(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.METHOD_SELECT), Method);
        pick.round = parseInt(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.ROUND_SELECT));
        fight.yourPick = pick;
        return fight;
    }

    getFight(): Fight{
        let fight: Fight = new Fight();
        fight.rules = mapStringToEnum<Rules>(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.RULES_SELECT), Rules);
        fight.redCorner = this.currentRedCorner;
        fight.blueCorner = this.currentBlueCorner;
        return fight
    }

    addFight(newFight: Fight){
        let message = this.fightCard.addFight(newFight);

        if(message !== Message.Success)
            return showError(message);

        let fightCardDiv = selectElementByClass(this.container, CLASS_NAMES.FIGHT_CARD); 
        let fightTempDiv = selectElementByClass(this.container, CLASS_NAMES.FIGHT_TEMPLATE);
        let fightDiv = fightTempDiv.cloneNode(true) as HTMLElement;

        let rulesLabel = selectElementByClass(fightDiv, CLASS_NAMES.RULES_LABEL);
        let weightclassLabel = selectElementByClass(fightDiv, CLASS_NAMES.WEIGHTCLASS_LABEL);
        let redCornerImg = selectElementByClass(fightDiv, CLASS_NAMES.RED_CORNER_IMG) as HTMLImageElement;
        let blueCornerImg = selectElementByClass(fightDiv, CLASS_NAMES.BLUE_CORNER_IMG) as HTMLImageElement;
        let redCornerLabel = selectElementByClass(fightDiv, CLASS_NAMES.RED_CORNER_LABEL);
        let blueCornerLabel = selectElementByClass(fightDiv, CLASS_NAMES.BLUE_CORNER_LABEL);
        let winnerLabel = selectElementByClass(fightDiv, CLASS_NAMES.WINNER_LABEL);
        let methodLabel = selectElementByClass(fightDiv, CLASS_NAMES.METHOD_LABEL);
        let roundLabel = selectElementByClass(fightDiv, CLASS_NAMES.ROUND_LABEL);
        let redCornerOddLabel = selectElementByClass(fightDiv, CLASS_NAMES.RED_CORNER_ODD_LABEL);
        let blueCornerOddLabel = selectElementByClass(fightDiv, CLASS_NAMES.BLUE_CORNER_ODD_LABEL);
        let removeButton = selectElementByClass(fightDiv, CLASS_NAMES.PICK_DIV);
        let pickDiv = selectElementByClass(fightDiv, CLASS_NAMES.PICK_DIV);

        rulesLabel.innerHTML = newFight.rules;
        weightclassLabel.innerHTML = newFight.redCorner.weightclass;
        redCornerImg.src = newFight.redCorner.pictureSrc;
        blueCornerImg.src = newFight.blueCorner.pictureSrc;
        redCornerLabel.innerHTML = newFight.redCorner.name;
        blueCornerLabel.innerHTML = newFight.blueCorner.name;
        winnerLabel.innerHTML = newFight.yourPick.winner;
        methodLabel.innerHTML = newFight.yourPick.method;
        roundLabel.innerHTML = newFight.yourPick.round.toString();

        if(newFight.favourite === Corner.RedCorner){
            redCornerOddLabel.innerHTML = "Favourite";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            blueCornerOddLabel.innerHTML = "Underdog";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        else{
            blueCornerOddLabel.innerHTML = "Favourite";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            redCornerOddLabel.innerHTML = "Underdog";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        if(newFight.yourPick.winner === Corner.RedCorner)
            pickDiv.classList.add(CLASS_NAMES.STYLES.RED_TEXT);
        else
            pickDiv.classList.add(CLASS_NAMES.STYLES.BLUE_TEXT);

        fightDiv.classList.remove(CLASS_NAMES.STYLES.COLLAPSE);
        fightDiv.classList.remove(CLASS_NAMES.FIGHT_TEMPLATE);
        fightDiv.classList.add(`${CLASS_NAMES.FIGHT_DIV + this.fightNumber}`);
        removeButton.id = this.fightNumber.toString();

        this.fightNumber++;
        fightCardDiv.appendChild(fightDiv);
    }

    removeFight(fightIndex: number){
        this.fightCard.removeFight(fightIndex);
        let fightDiv = selectElementByClass(this.container, CLASS_NAMES.FIGHT_DIV + fightIndex);
        fightDiv.remove();

        // let otherFightDivs = selectElementsByBeginOfClass(this.container, CLASS_NAMES.FIGHT_DIV);
        let otherFightDivs = this.container.querySelectorAll(`div[class^="${CLASS_NAMES.FIGHT_DIV}"]`);
        console.log(otherFightDivs);
        otherFightDivs.forEach(fightDiv => {
            let removeButton = selectElementByClass(fightDiv as HTMLDivElement, CLASS_NAMES.REMOVE_BUTTON);
            console.log(removeButton);
            let previousId = parseInt(removeButton.id);
            if(previousId > fightIndex){
                fightDiv.classList.remove(CLASS_NAMES.FIGHT_DIV + previousId);
                fightDiv.classList.add(CLASS_NAMES.FIGHT_DIV + (previousId-1));
                removeButton.id = (previousId-1).toString();
            }
        })
    }
}

