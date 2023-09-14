import { AppComponent } from "../../components/app.component";
import { PickerComponent } from "../../components/picker.component";
import { Corner } from "../../enums/corner.enum";
import { Fighter } from "../../models/fighter";
import { CLASS_NAMES } from "../../utilities/constants";
import { setSelectOptions } from "../../utilities/helpers";
import { getResetFightcardObs } from "../app.logic/app.observables";
import { getChangeFighterObs, getChangeFightInfoObs, getChangeRulesObs } from "./picker.observables";

export function resetFightcardHandler(picker: PickerComponent, app: AppComponent){
    getResetFightcardObs(app).subscribe(
        () => picker.resetFightCard()
    );
}

export function getNumberOfRoundsHandler(picker: PickerComponent){
    getChangeRulesObs(picker).subscribe(
        () => {
            let rule = picker.getRules();
            picker.setSelectOptionsForRounds(rule);
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

        if (fighters.length === 0) {
            picker.setFighter(new Fighter(), Corner.RedCorner);
            picker.setFighter(new Fighter(), Corner.BlueCorner);
        } else {
            picker.setFighter(new Fighter(fighters[0]), Corner.RedCorner);
            picker.setFighter(new Fighter(fighters[0]), Corner.BlueCorner);
        }
    });
}

export function changeFighterHandler(picker: PickerComponent){
    getChangeFighterObs(picker).subscribe(([fighter, corner]: [Fighter, Corner]) => 
        picker.setFighter(fighter, corner)
    );
}
