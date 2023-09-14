import { combineLatest, fromEvent, map, merge, Observable, startWith, switchMap, withLatestFrom } from "rxjs";
import { PickerComponent } from "../components/picker.component";
import { Corner } from "../enums/corner.enum";
import { Fighter } from "../models/fighter";
import { CLASS_NAMES } from "../utilities/constants";
import { setSelectOptions, setSelectsOptionsFromValues } from "../utilities/helpers";
import { getFightersByRulesAndWeightclass } from "./api.service";

export function getWeightclassesAndRoundsHandler(picker: PickerComponent) {
    fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RULES), "change").subscribe(
        (eventChange: Event) => {
            let rule = picker.getRules();
            picker.setSelectOptionsForRounds(rule);
        }
    );
}

export function getFightersHandler(picker: PickerComponent){
    let changeRule$ = fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RULES), "change");
    let changeWeightclasse$ = fromEvent(picker.getElement(CLASS_NAMES.SELECTS.WEIGHTCLASS),"change");

    let changeFighter$ = merge(
        fromEvent(picker.getElement(CLASS_NAMES.SELECTS.RED_CORNER),"change"),
        fromEvent(picker.getElement(CLASS_NAMES.SELECTS.BLUE_CORNER),"change")
    );

    let getFightersByRulesAndWeightclass$ = combineLatest([changeRule$, changeWeightclasse$])
        .pipe(
            switchMap(() => {
                let rules = picker.getRules();
                let weightclass = picker.getWeightclass();
                return getFightersByRulesAndWeightclass(rules, weightclass);
            }),
            startWith(([new Fighter()]))
        );

    let getSelectedFighter$ = changeFighter$
        .pipe(
            withLatestFrom(getFightersByRulesAndWeightclass$),
            map(([eventChange, fighters]: [Event, Fighter[]]) => {
                let select = eventChange.target as HTMLSelectElement;
                let id = select.value;
                let selectedFighter: Fighter = fighters.find(fighter => fighter.id.toString() === id);
                let fighter = new Fighter(selectedFighter);
                // console.log(selectedFighter);
                // console.log(fighter);
                
                if(select.classList.contains(CLASS_NAMES.SELECTS.RED_CORNER))
                    return [fighter, Corner.RedCorner];
                else 
                    return [fighter, Corner.BlueCorner];
            })
        );

    getFightersByRulesAndWeightclass$.subscribe((fighters) => {
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
            picker.setFighter(fighters[0], Corner.RedCorner);
            picker.setFighter(fighters[0], Corner.BlueCorner);
        }
    });

    getSelectedFighter$.subscribe(([fighter, corner] : [Fighter, Corner]) => picker.setFighter(fighter, corner));
}
