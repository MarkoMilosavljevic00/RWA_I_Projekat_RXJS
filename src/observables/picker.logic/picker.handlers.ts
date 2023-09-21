import { AppComponent } from "../../components/app.component";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { ResultComponent } from "../../components/result.component";
import { Corner } from "../../enums/corner.enum";
import { mapRulesToNumberOfRounds, mapRulesToRoundDuration, Rules } from "../../enums/rules.enum";
import { Fighter } from "../../models/fighter";
import { FightEvent } from "../../models/fightEvent";
import { CLASS_NAMES, DEFAULT, RULES, TIME } from "../../utilities/constants";
import { setSelectOptions } from "../../utilities/helpers";
import { getResetFightcardObs } from "../app.logic/app.observables";
import { getStartFightsObs } from "../live.logic/live.observables";
import { getAddFightObs, getChangeFighterObs, getChangeFightInfoObs, getChangeRulesObs } from "./picker.observables";

export function resetFightcardHandler(picker: PickerComponent, app: AppComponent){
    getResetFightcardObs(app).subscribe(
        () => picker.resetFightCard()
    );
}

export function getChangeRulesHandler(picker: PickerComponent){
    getChangeRulesObs(picker).subscribe(
        () => {
            let rule = picker.getRules();
            picker.setSelectOptionsForRounds(rule);
            picker.setSelectOptionsForMethods(rule);
    });
}

export function getFightersByFightInfoHandler(picker: PickerComponent){
    getChangeFightInfoObs(picker).subscribe((fighters) => {
        let redCornerSelect = picker.getElement(CLASS_NAMES.SELECTS.RED_CORNER) as HTMLSelectElement;
        let blueCornerSelect = picker.getElement(CLASS_NAMES.SELECTS.BLUE_CORNER) as HTMLSelectElement;
        let fighterNames: string[] = [];
        let fighterIds: string[] = [];

        fighters.forEach((fighter) => {
            fighterNames.push(fighter.name);
            fighterIds.push(fighter.id.toString());
        });
        
        setSelectOptions(redCornerSelect, fighterNames, fighterIds, CLASS_NAMES.OPTIONS.FIGHTER);
        setSelectOptions(blueCornerSelect, fighterNames, fighterIds, CLASS_NAMES.OPTIONS.FIGHTER);

        picker.setFighter(new Fighter(), Corner.RedCorner);
        picker.setFighter(new Fighter(), Corner.BlueCorner);
    });
}

export function changeFighterHandler(picker: PickerComponent){
    getChangeFighterObs(picker).subscribe(([fighter, corner]: [Fighter, Corner]) => 
        picker.setFighter(fighter, corner)
    );
}