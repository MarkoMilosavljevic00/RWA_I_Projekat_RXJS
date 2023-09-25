import { Corner } from "../enums/corner.enum";
import { Message } from "../enums/message.enum";
import { Method } from "../enums/method.enum";
import { mapRulesToMethods, mapRulesToNumberOfRounds, Rules } from "../enums/rules.enum";
import { Weightclass } from "../enums/weightclass.enum";
import { Fight } from "../models/fight";
import { FightCard } from "../models/fightCard";
import { Fighter } from "../models/fighter";
import { Result } from "../models/result";
import { CLASS_NAMES, TYPE_OF_ELEMENTS } from "../utilities/constants";
import { PATHS } from "../utilities/constants";
import { fillProgressBars, getCheckedRadioValue, getSelectedValue, mapStringToEnum, clearElement, selectElementByClass, selectElementByClassAndType, selectElementsByBeginOfClass, selectElementsByClass, selectElementsByPartialClass, setSelectOptionsToNumber, setSelectsOptionsFromValues, showError } from "../utilities/helpers";
import { Component } from "./component";

export class PickerComponent extends Component{
    fightCard: FightCard;
    numberOfFights: number = 0;
    currentRedCorner: Fighter;
    currentBlueCorner: Fighter;

    constructor(fightCard: FightCard){
        super();
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.PICKER);
        this.fightCard = fightCard;
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.WEIGHTCLASS, CLASS_NAMES.OPTIONS.WEIGHTCLASS, Weightclass);
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.RULES, CLASS_NAMES.OPTIONS.RULES, Rules);
    }

    resetFightList() {
        this.fightCard.reset();
        this.numberOfFights = 0;
        this.setFighter(new Fighter(), Corner.Red);
        this.setFighter(new Fighter(), Corner.Blue);
        clearElement(this.container, CLASS_NAMES.LISTS.FIGHT, CLASS_NAMES.ITEMS.FIGHT);
    }

    getRules(){
        return mapStringToEnum<Rules>(
                getSelectedValue(this.container, CLASS_NAMES.SELECTS.RULES), 
                Rules
            );
    }

    getWeightclass(){
        return mapStringToEnum<Weightclass>(
                getSelectedValue(this.container , CLASS_NAMES.SELECTS.WEIGHTCLASS),
                Weightclass
            );
    }

    getFightInfo(): Fight{
        let fight: Fight = new Fight();
        fight.rules = this.getRules();
        fight.redCorner = this.currentRedCorner;
        fight.blueCorner = this.currentBlueCorner;

        let winner = mapStringToEnum<Corner>(getCheckedRadioValue(CLASS_NAMES.WINNER_RADIO), Corner);
        let method = mapStringToEnum<Method>(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.SELECTS.METHOD), Method);
        let round
        if(method === Method.Decision)
            round = 0;
        else
            round = parseInt(getSelectedValue(this.container as HTMLDivElement, CLASS_NAMES.SELECTS.ROUND));

        let pick: Result = {
            winner,
            method,
            round,
        }
        fight.yourPick = pick;
        return fight
    }

    getFightCard(){
        return this.fightCard;
    }

    checkIsFightCardEmpty() {
        if(this.fightCard.fights.length === 0){
            return true;
        }
        return false;
    }

    setSelectOptionsForRounds(rule: Rules){
        let numberOfRounds = mapRulesToNumberOfRounds(rule);
        setSelectOptionsToNumber(this.container, CLASS_NAMES.SELECTS.ROUND, CLASS_NAMES.OPTIONS.ROUND, numberOfRounds);
    }

    setSelectOptionsForMethods(rule: Rules){
        let methods = mapRulesToMethods(rule);
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.METHOD, CLASS_NAMES.OPTIONS.METHOD, methods);
    }

    setFighter(fighter: Fighter, corner: Corner){
        let cornerImg: HTMLImageElement;
        let winnerLabel: HTMLLabelElement; 
        let skillBarsClassName: string;

        if(corner == Corner.Red){
            this.currentRedCorner = fighter;
            cornerImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.RED_CORNER) as HTMLImageElement
            winnerLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.RED_CORNER_WINNER) as HTMLLabelElement;
            skillBarsClassName = CLASS_NAMES.PROGRESS_BARS.RED_CORNER_SKILLS;
        }
        else{
            this.currentBlueCorner = fighter;
            cornerImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.BLUE_CORNER) as HTMLImageElement
            winnerLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.BLUE_CORNER_WINNER) as HTMLLabelElement;
            skillBarsClassName = CLASS_NAMES.PROGRESS_BARS.BLUE_CORNER_SKILLS;
        }
        cornerImg.src =`${PATHS.IMAGES.FIGHTERS + fighter.pictureSrc}` ;
        winnerLabel.innerHTML = fighter.name;

        fillProgressBars(this.container, skillBarsClassName, fighter.striking, fighter.grappling, fighter.overall);
    }

    addFight(newFight: Fight){
        let message = this.fightCard.addFight(newFight);

        if(message !== Message.Success)
            return showError(message);

        let fightListDiv = selectElementByClass(this.container, CLASS_NAMES.LISTS.FIGHT); 
        let fightTempDiv = selectElementByClass(this.container, CLASS_NAMES.TEMPLATES.FIGHT);
        let fightItem = fightTempDiv.cloneNode(true) as HTMLElement;

        fightItem.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
        fightItem.classList.remove(CLASS_NAMES.TEMPLATES.FIGHT);
        fightItem.classList.add(`${CLASS_NAMES.ITEMS.FIGHT + this.numberOfFights}`);

        this.renderFightInformation(fightItem, newFight);

        this.numberOfFights++;
        fightListDiv.appendChild(fightItem);
    }

    renderFightInformation(fightDiv: HTMLElement, newFight: Fight) {
        let rulesLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.RULES);
        let weightclassLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.WEIGHTCLASS);
        let redCornerImg = selectElementByClass(fightDiv, CLASS_NAMES.IMAGES.RED_CORNER) as HTMLImageElement;
        let blueCornerImg = selectElementByClass(fightDiv, CLASS_NAMES.IMAGES.BLUE_CORNER) as HTMLImageElement;
        let redCornerLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.RED_CORNER);
        let blueCornerLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.BLUE_CORNER);
        let winnerLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.WINNER);
        let methodLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.METHOD);
        let roundLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.ROUND);
        let redCornerOddLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.RED_CORNER_ODD);
        let blueCornerOddLabel = selectElementByClass(fightDiv, CLASS_NAMES.LABELS.BLUE_CORNER_ODD);
        let pickDiv = selectElementByClass(fightDiv, CLASS_NAMES.PICK_DIV);

        rulesLabel.innerHTML = newFight.rules;
        weightclassLabel.innerHTML = newFight.redCorner.weightclass;
        redCornerImg.src = `${PATHS.IMAGES.FIGHTERS + newFight.redCorner.pictureSrc}`;
        blueCornerImg.src = `${PATHS.IMAGES.FIGHTERS + newFight.blueCorner.pictureSrc}`;
        redCornerLabel.innerHTML = newFight.redCorner.name;
        blueCornerLabel.innerHTML = newFight.blueCorner.name;
        winnerLabel.innerHTML = newFight.yourPick.winner;
        methodLabel.innerHTML = newFight.yourPick.method;
        if(newFight.yourPick.method === Method.Decision){
            roundLabel.classList.add(CLASS_NAMES.STATES.COLLAPSE);
        }
        else
            roundLabel.innerHTML = `Round: ${newFight.yourPick.round}`;

        if (newFight.favourite === Corner.Red) {
            redCornerOddLabel.innerHTML = "Favourite";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            blueCornerOddLabel.innerHTML = "Underdog";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        else {
            blueCornerOddLabel.innerHTML = "Favourite";
            blueCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR_FILL);
            redCornerOddLabel.innerHTML = "Underdog";
            redCornerOddLabel.classList.add(CLASS_NAMES.ICONS.STAR);
        }
        // console.log(newFight.yourPick.winner);
        if (newFight.yourPick.winner === Corner.Red)
            pickDiv.classList.add(CLASS_NAMES.STYLES.RED_TEXT);

        else
            pickDiv.classList.add(CLASS_NAMES.STYLES.BLUE_TEXT);
    }

    renderUndoButton() {
        let undoButton = selectElementByClass(this.container, CLASS_NAMES.BUTTONS.UNDO);
        if(this.checkIsFightCardEmpty())
            undoButton.classList.add(CLASS_NAMES.STATES.COLLAPSE);
        else
            undoButton.classList.remove(CLASS_NAMES.STATES.COLLAPSE);
    }

    removeFight(fightIndex: number = this.numberOfFights - 1){
        this.fightCard.removeFight(fightIndex);
        let fightDiv = selectElementByClass(this.container, CLASS_NAMES.ITEMS.FIGHT + fightIndex);
        fightDiv.remove();
        this.updateFightDivsIds(fightIndex, CLASS_NAMES.ITEMS.FIGHT);
        this.numberOfFights--;
    }

    updateFightDivsIds(fightIndex: number, partOfClassName: string) {
        let fightDivs = selectElementsByPartialClass(this.container, partOfClassName)
        fightDivs.forEach(fightDiv => {
          const classes = fightDiv.className.split(' ');
          const fightClasses = classes.filter(className => className.startsWith(partOfClassName));
          if (fightClasses.length === 1) {
            const currentFightIndex = parseInt(fightClasses[0].substring(partOfClassName.length), 10);
            if (currentFightIndex >= fightIndex) {
              fightDiv.classList.remove(`${partOfClassName}${currentFightIndex}`);
              const newFightIndex = currentFightIndex - 1;
              fightDiv.classList.add(`${partOfClassName}${newFightIndex}`);
            }
          }
        });
      }
}