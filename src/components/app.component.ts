import { mapRulesToNumberOfRounds, Rules } from "../enums/rules.enum";
import { CLASS_NAMES } from "../utilities/constants";
import { selectElementByClass, selectElementsByClass, setSelectOptions } from "../utilities/helpers";

export class AppComponent{
    container: HTMLElement;

    constructor(){
        this.container = selectElementByClass(document.body, CLASS_NAMES.APP_CONTAINER);
    }

    setSelectFromValues(selector: string, value: Object){
        const values = Object.values(value);
        let selects = selectElementsByClass(this.container, selector);
        selects.forEach(select => setSelectOptions(select as HTMLSelectElement, values, values));
    }

    setSelectForRounds(selector: string, rule: Rules){
        let selects = selectElementsByClass(this.container, selector);
        let values: string[] = [];
        for(let i = 1; i<= mapRulesToNumberOfRounds(rule); i++)
            values.push(i.toString());
        selects.forEach(select => setSelectOptions(select as HTMLSelectElement, values, values));
    }
    
}
