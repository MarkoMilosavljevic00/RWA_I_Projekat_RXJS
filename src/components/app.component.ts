import { DifficultyLevel } from "../enums/difficulty-level.enum";
import { GameStats } from "../models/gameStats";
import { Opponent } from "../models/opponent";
import { CLASS_NAMES, PATHS } from "../utilities/constants";
import {
    selectElementByClass,
    setSelectsOptionsFromValues,
    selectElementsByClass,
    selectElementsByPartialClass,
} from "../utilities/helpers";
import { Component } from "./component";

export class AppComponent extends Component {
    stats: GameStats;

    constructor() {
        super();
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.APP);
        this.stats = {
            yourPoints: 0,
            opponentPoints: 0,
            opponent: undefined,
        };
        setSelectsOptionsFromValues(
            this.container,
            CLASS_NAMES.SELECTS.DIFFICULTY,
            CLASS_NAMES.OPTIONS.DIFFICULTY,
            DifficultyLevel
        );
    }

    getDifficulty(): DifficultyLevel {
        let difficultySelect = selectElementByClass(
            this.container,
            CLASS_NAMES.SELECTS.DIFFICULTY
        ) as HTMLSelectElement;
        return difficultySelect.value as DifficultyLevel;
    }

    disableTabs(...tabsClassNames: string[]) {
        tabsClassNames.forEach((tabClassName) => {
            const tab = selectElementByClass(this.container, tabClassName);
            if (
                !(
                    tab.classList.contains(CLASS_NAMES.STATES.DISABLED) &&
                    tab.classList.contains(CLASS_NAMES.STYLES.DARK_TEXT)
                )
            ) {
                tab.classList.add(CLASS_NAMES.STATES.DISABLED);
                tab.classList.add(CLASS_NAMES.STYLES.GRAY_TEXT);
            }
        });
    }

    enableTabs(...tabsClassNames: string[]) {
        tabsClassNames.forEach((tabClassName) => {
            let tab = selectElementByClass(this.container, tabClassName);
            if (
                tab.classList.contains(CLASS_NAMES.STATES.DISABLED) &&
                tab.classList.contains(CLASS_NAMES.STYLES.DARK_TEXT)
            ) {
                tab.classList.remove(CLASS_NAMES.STATES.DISABLED);
                tab.classList.remove(CLASS_NAMES.STYLES.GRAY_TEXT);
            }
        });
    }

    activateTab(tabNavLinkClassName: string, tabPaneClassName: string) {
        let tabNavLinks = selectElementsByPartialClass(
            this.container,
            CLASS_NAMES.TABS.NAV_LINKS.NAV_LINK
        );
        let tabPanes = selectElementsByPartialClass(
            this.container,
            CLASS_NAMES.TABS.PANES.TAB_PANE
        );
        tabNavLinks.forEach((tabNavItem, index) => {
            if (tabNavItem.classList.contains(CLASS_NAMES.STATES.ACTIVE))
                tabNavItem.classList.remove(CLASS_NAMES.STATES.ACTIVE);
            if (
                tabPanes[index].classList.contains(CLASS_NAMES.STATES.ACTIVE) &&
                tabPanes[index].classList.contains(CLASS_NAMES.STATES.SHOW)
            )
                tabPanes[index].classList.remove(
                    CLASS_NAMES.STATES.ACTIVE,
                    CLASS_NAMES.STATES.SHOW
                );
        });
        let tabNavLink = selectElementByClass(this.container, tabNavLinkClassName);
        tabNavLink.classList.add(CLASS_NAMES.STATES.ACTIVE);

        let tabPane = selectElementByClass(this.container, tabPaneClassName);
        tabPane.classList.add(CLASS_NAMES.STATES.ACTIVE);
        tabPane.classList.add(CLASS_NAMES.STATES.SHOW);
    }

    setPoints(points: number) {
        let yourPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_POINTS);
        let oppPointsLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.OPPONENT_POINTS
        );
        this.stats.opponentPoints = this.stats.yourPoints = points;
        yourPointsLabel.innerHTML = oppPointsLabel.innerHTML = points.toString();
    }

    setYourPoints(points: number) {
        let yourPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_POINTS);
        this.stats.yourPoints = points;
        yourPointsLabel.innerHTML = this.stats.yourPoints.toString();
    }

    setOpponentPoints(points: number) {
        let oppPointsLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.OPPONENT_POINTS
        );
        this.stats.opponentPoints = points;
        oppPointsLabel.innerHTML = this.stats.opponentPoints.toString();
    }

    addToYourPoints(points: number) {
        let yourPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_POINTS);
        this.stats.yourPoints += points;
        yourPointsLabel.innerHTML = this.stats.yourPoints.toString();
    }

    addToOpponentPoints(points: number) {
        let oppPointsLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.OPPONENT_POINTS
        );
        this.stats.opponentPoints += points;
        oppPointsLabel.innerHTML = this.stats.opponentPoints.toString();
    }

    setOpponent(opponent: Opponent) {
        let opponentImg = selectElementByClass(
            this.container,
            CLASS_NAMES.IMAGES.OPPONENT
        ) as HTMLImageElement;
        let opponentNameLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.OPPONENT_NAME
        );
        let opponentDiffLabel = selectElementByClass(
            this.container,
            CLASS_NAMES.LABELS.OPPONENT_DIFFICULTY
        );
        this.stats.opponent = opponent;
        opponentImg.src = `${PATHS.IMAGES.OPPONENTS + opponent.pictureSrc}`;
        opponentNameLabel.innerHTML = opponent.name;
        opponentDiffLabel.innerHTML = opponent.difficulty;
    }
}
