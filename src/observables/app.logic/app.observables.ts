import { filter, fromEvent, map, merge, Observable, switchMap } from "rxjs";
import { AppComponent } from "../../components/app.component";
import { FightCard } from "../../models/fightCard";
import { Opponent } from "../../models/opponent";
import { CLASS_NAMES, POINTS } from "../../utilities/constants";
import { getRandomValue, showElement } from "../../utilities/helpers";
import { getOpponentsObs } from "../api.service";

export function getChangeDifficultyObs(
    app: AppComponent
): Observable<[Event, NodeListOf<HTMLSelectElement>]> {
    let difficultySelects = app.getElements(
        CLASS_NAMES.SELECTS.DIFFICULTY
    ) as NodeListOf<HTMLSelectElement>;
    let changeEvent$: Observable<Event>[] = [];

    difficultySelects.forEach((difficultySelect) => {
        changeEvent$.push(fromEvent(difficultySelect, "change"));
    });

    return merge(...changeEvent$).pipe(map((eventChange) => [eventChange, difficultySelects]));
}

export function getRestartPointsObs(app: AppComponent): Observable<Event> {
    let restartScoreClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.RESTART_SCORE), "click");
    let findNewOpponentClick$ = fromEvent(
        app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),
        "click"
    );

    return merge(restartScoreClick$, findNewOpponentClick$);
}

export function getGoToPickerObs(app: AppComponent): Observable<Event> {
    let playAgainClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.PLAY_AGAIN), "click");
    let startClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.START), "click");
    let findNewOpponentClick$ = fromEvent(
        app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),
        "click"
    );

    return merge(playAgainClick$, startClick$, findNewOpponentClick$);
}

export function getGoToLiveAndResultObs(
    app: AppComponent,
    fightCard: FightCard
): Observable<Event> {
    return fromEvent(app.getElement(CLASS_NAMES.BUTTONS.START_FIGHTS), "click").pipe(
        filter(() => fightCard.fights.length > 0)
    );
}

export function getOppponentObs(app: AppComponent): Observable<Opponent> {
    let startClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.START), "click");
    let findNewOpponentClick$ = fromEvent(
        app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),
        "click"
    );
    return merge(startClick$, findNewOpponentClick$).pipe(
        switchMap(() => {
            let difficulty = app.getDifficulty();
            return getOpponentsObs(difficulty);
        }),
        map((opponents) => getRandomValue<Opponent>(opponents))
    );
}

export function getResetFightcardObs(app: AppComponent): Observable<Event> {
    let playAgainClick$ = fromEvent(app.getElement(CLASS_NAMES.BUTTONS.PLAY_AGAIN), "click");
    let findNewOpponentClick$ = fromEvent(
        app.getElement(CLASS_NAMES.BUTTONS.FIND_NEW_OPPONENT),
        "click"
    );

    return merge(playAgainClick$, findNewOpponentClick$);
}
