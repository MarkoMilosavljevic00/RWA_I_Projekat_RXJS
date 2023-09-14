import { fromEvent, map, merge, Observable, switchMap } from "rxjs";
import { AppComponent } from "../components/app.component";
import { PickerComponent } from "../components/picker.component";
import { Opponent } from "../models/opponent";
import { CLASS_NAMES, POINTS } from "../utilities/constants";
import { getRandomValue, showElement } from "../utilities/helpers";
import { getOpponentsObs } from "./api.service";

export function changeDifficultyHandler(app: AppComponent) {
    let difficultySelects = app.getElements(CLASS_NAMES.SELECTS.DIFFICULTY) as NodeListOf<HTMLSelectElement>;
    let changeEvents: Observable<Event>[] = [];

    difficultySelects
        .forEach((difficultySelect) => {
            changeEvents.push(fromEvent(difficultySelect, "change"));
        });

    merge(...changeEvents).subscribe((eventChange: Event) => {
        let selectedValue = (eventChange.target as HTMLSelectElement).value;
        difficultySelects
            .forEach((difficultySelect) => {
                difficultySelect.value = selectedValue;
            });
    });
}

export function resetPointsHandler(app: AppComponent) {
    let restartScoreClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.RESTART_SCORE), "click");
    let findNewOpponentClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),"click");

    merge(restartScoreClick$, findNewOpponentClick$)
        .subscribe(
            () => app.setPoints(POINTS.INITIAL)
        );
}

export function goToPickerHandler(app: AppComponent) {
    let playAgainClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.PLAY_AGAIN), "click");
    let startClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.START), "click");
    let findNewOpponentClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),"click");

    merge(playAgainClick$, startClick$, findNewOpponentClick$)
        .subscribe(() => {
            showElement(app.getElement(CLASS_NAMES.MAIN_SCOREBOARD));
            app.enableTabs(CLASS_NAMES.TABS.NAV_LINKS.PICKER);
            app.disableTabs(CLASS_NAMES.TABS.NAV_LINKS.START);
            app.activateTab(CLASS_NAMES.TABS.NAV_LINKS.PICKER, CLASS_NAMES.TABS.PANES.PICKER);
        });
}

export function getOpponentHandler(app: AppComponent) {
    let startClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.START), "click");
    let findNewOpponentClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),"click");
    merge(startClick$, findNewOpponentClick$)
        .pipe(
            switchMap(() => {
                let difficulty = app.getDifficulty();
                return getOpponentsObs(difficulty);
            }),
            map((opponents) => getRandomValue<Opponent>(opponents))
        )
        .subscribe((opponent: Opponent) => {
            app.setOpponent(opponent);
        });
}

export function resetFightCardHandler(app: AppComponent, picker: PickerComponent) {
    let playAgainClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.PLAY_AGAIN), "click");
    let findNewOpponentClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),"click");

    merge(playAgainClick$, findNewOpponentClick$)
        .subscribe(
            () => picker.resetFightCard()
        );
}
