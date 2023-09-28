import { PickerComponent } from "../../components/picker.component";
import { Corner } from "../../enums/corner.enum";
import { Method } from "../../enums/method.enum";
import { Fighter } from "../../models/fighter";
import { CLASS_NAMES } from "../../utilities/constants";
import { hideElement, setSelectOptions, showElement } from "../../utilities/helpers";
import {
    getChangeFighterObs,
    getChangeFightInfoObs,
    getChangeMethodObs,
    getChangeRulesObs,
} from "./picker.observables";

export function changeRulesHandler(picker: PickerComponent) {
    getChangeRulesObs(picker).subscribe(() => {
        let rule = picker.getRules();
        picker.setSelectOptionsForRounds(rule);
        picker.setSelectOptionsForMethods(rule);
    });
}

export function changeMethodHandler(picker: PickerComponent) {
    getChangeMethodObs(picker).subscribe((method) => {
        if (method === Method.Decision) hideElement(picker.getElement(CLASS_NAMES.SELECTS.ROUND));
        else showElement(picker.getElement(CLASS_NAMES.SELECTS.ROUND));
    });
}

export function changeFightersByFightInfoHandler(picker: PickerComponent) {
    getChangeFightInfoObs(picker).subscribe((fighters) => {
        let redCornerSelect = picker.getElement(
            CLASS_NAMES.SELECTS.RED_CORNER
        ) as HTMLSelectElement;
        let blueCornerSelect = picker.getElement(
            CLASS_NAMES.SELECTS.BLUE_CORNER
        ) as HTMLSelectElement;
        let fighterNames: string[] = [];
        let fighterIds: string[] = [];

        fighters.forEach((fighter) => {
            fighterNames.push(fighter.name);
            fighterIds.push(fighter.id.toString());
        });

        setSelectOptions(redCornerSelect, fighterNames, fighterIds, CLASS_NAMES.OPTIONS.FIGHTER);
        setSelectOptions(blueCornerSelect, fighterNames, fighterIds, CLASS_NAMES.OPTIONS.FIGHTER);

        picker.setFighter(new Fighter(), Corner.Red);
        picker.setFighter(new Fighter(), Corner.Blue);
    });
}

export function changeFighterHandler(picker: PickerComponent) {
    getChangeFighterObs(picker).subscribe(([fighter, corner]: [Fighter, Corner]) =>
        picker.setFighter(fighter, corner)
    );
}
