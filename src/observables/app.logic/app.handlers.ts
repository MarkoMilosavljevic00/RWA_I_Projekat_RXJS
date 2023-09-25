import { AppComponent } from "../../components/app.component";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { ResultComponent } from "../../components/result.component";
import { FightCard } from "../../models/fightCard";
import { Opponent } from "../../models/opponent";
import { CLASS_NAMES, POINTS } from "../../utilities/constants";
import { disableElement, enableElement, showElement } from "../../utilities/helpers";
import {
    getChangeDifficultyObs,
    getGoToLiveAndResultObs,
    getGoToPickerObs,
    getOppponentObs,
    getResetFightcardObs,
    getRestartPointsObs,
} from "./app.observables";

export function changeDifficultyHandler(app: AppComponent) {
    getChangeDifficultyObs(app).subscribe(([eventChange, difficultySelects]) => {
        let selectedValue = (eventChange.target as HTMLSelectElement).value;
        difficultySelects.forEach((difficultySelect) => (difficultySelect.value = selectedValue));
    });
}

export function resetFightcardHandler(
    picker: PickerComponent,
    result: ResultComponent,
    live: LiveComponent,
    app: AppComponent
) {
    getResetFightcardObs(app).subscribe(() => {
        picker.resetFightList();
        picker.renderUndoButton();
        result.resetResultList();
        live.resetEventList();
    });
}

export function restartPointsHandler(app: AppComponent) {
    getRestartPointsObs(app).subscribe(() => app.setPoints(POINTS.INITIAL));
}

export function goToPickerHandler(app: AppComponent) {
    getGoToPickerObs(app).subscribe(() => {
        showElement(app.getElement(CLASS_NAMES.MAIN_SCOREBOARD));
        let tabs = Object.values(CLASS_NAMES.TABS.NAV_LINKS);
        app.disableTabs(...tabs);
        app.enableTabs(CLASS_NAMES.TABS.NAV_LINKS.PICKER);
        app.activateTab(CLASS_NAMES.TABS.NAV_LINKS.PICKER, CLASS_NAMES.TABS.PANES.PICKER);
        enableElement(app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT));
    });
}

export function goToLiveAndResultHandler(app: AppComponent, fightCard: FightCard) {
    getGoToLiveAndResultObs(app, fightCard).subscribe(() => {
        let tabs = Object.values(CLASS_NAMES.TABS.NAV_LINKS);
        app.disableTabs(...tabs);
        app.enableTabs(CLASS_NAMES.TABS.NAV_LINKS.LIVE);
        app.enableTabs(CLASS_NAMES.TABS.NAV_LINKS.RESULT);
        app.activateTab(CLASS_NAMES.TABS.NAV_LINKS.LIVE, CLASS_NAMES.TABS.PANES.LIVE);
        disableElement(app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT));
    });
}

export function getOpponentHandler(app: AppComponent, result: ResultComponent) {
    getOppponentObs(app).subscribe((opponent: Opponent) => {
        app.setOpponent(opponent);
        result.setOpponent(opponent);
    });
}
