import { DifficultyLevel } from "../enums/difficulty-level.enum";
import { GameStats } from "../models/gameStats"
import { Method } from "../enums/method.enum";
import { mapRulesToNumberOfRounds, Rules } from "../enums/rules.enum";
import { Weightclass } from "../enums/weightclass.enum";
import { Opponent } from "../models/opponent";
import { CLASS_NAMES, PATHS } from "../utilities/constants";
import { selectElementByClass, setSelectsOptionsFromValues, setSelectOptionsToNumber } from "../utilities/helpers";

export class AppComponent{
    container: HTMLElement;
    stats: GameStats;

    constructor(){
        this.stats ={
            yourPoints: 0,
            opponentPoints: 0,
            opponent: undefined
        };
        this.container = selectElementByClass(document.body, CLASS_NAMES.CONTAINERS.APP);
    }

    setSelects(){
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.WEIGHTCLASS, Weightclass);
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.DIFF_LEVEL, DifficultyLevel);
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.RULES, Rules);
        setSelectsOptionsFromValues(this.container, CLASS_NAMES.SELECTS.METHOD, Method);
    }

    setSelectOptionsForRounds(rule: Rules){
        let numberOfRounds = mapRulesToNumberOfRounds(rule);
        setSelectOptionsToNumber(this.container, CLASS_NAMES.SELECTS.ROUND, numberOfRounds);
    }

    disableTabs(...tabsClassNames: string[]) {
        tabsClassNames.forEach(tabClassName => {
            const tab = selectElementByClass(this.container, tabClassName);
            if(!(tab.classList.contains(CLASS_NAMES.STATES.DISABLED) && tab.classList.contains(CLASS_NAMES.STYLES.DARK_TEXT))){
                tab.classList.add(CLASS_NAMES.STATES.DISABLED);
                tab.classList.add(CLASS_NAMES.STYLES.DARK_TEXT);
            }
        });
    }

    enableTabs(...tabsClassNames: string[]){
        tabsClassNames.forEach(tabClassName => {
            const tab = selectElementByClass(this.container, tabClassName);
            if(tab.classList.contains(CLASS_NAMES.STATES.DISABLED) && tab.classList.contains(CLASS_NAMES.STYLES.DARK_TEXT)){
                tab.classList.remove(CLASS_NAMES.STATES.DISABLED);
                tab.classList.remove(CLASS_NAMES.STYLES.DARK_TEXT);
            }
        });
    }

    activateTab(tabClassName: string){
        const tab = selectElementByClass(this.container, tabClassName);
        if(!tab.classList.contains(CLASS_NAMES.STATES.ACTIVE))
            tab.classList.add(CLASS_NAMES.STATES.ACTIVE);
    }

    setPoints(points: number){
        let yourPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_POINTS);
        let oppPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.OPPONENT_POINTS);
        this.stats.opponentPoints = this.stats.yourPoints = points;
        yourPointsLabel.innerHTML = oppPointsLabel.innerHTML = points.toString();
    }

    setYourPoints(points: number){
        let yourPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_POINTS);
        this.stats.yourPoints = points;
        yourPointsLabel.innerHTML = this.stats.yourPoints.toString();
    }

    setOpponentPoints(points: number){
        let oppPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.OPPONENT_POINTS);
        this.stats.opponentPoints = points;
        oppPointsLabel.innerHTML = this.stats.opponentPoints.toString();
    }

    addToYourPoints(points: number){
        let yourPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.YOUR_POINTS);
        this.stats.yourPoints += points;
        yourPointsLabel.innerHTML = this.stats.yourPoints.toString()
    }

    addToOpponentPoints(points: number){
        let oppPointsLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.OPPONENT_POINTS);
        this.stats.opponentPoints += points;
        oppPointsLabel.innerHTML = this.stats.opponentPoints.toString();
    }

    setOpponent(opponent: Opponent){
        let opponentImg = selectElementByClass(this.container, CLASS_NAMES.IMAGES.OPPONENT) as HTMLImageElement;
        let opponentNameLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.OPPONENT_NAME);
        let opponentDiffLabel = selectElementByClass(this.container, CLASS_NAMES.LABELS.OPPONENT_DIFFICULTY);
        this.stats.opponent = opponent;
        opponentImg.src = `${PATHS.IMAGES.OPPONENTS + opponent.pictureSrc}`;
        opponentNameLabel.innerHTML = opponent.name;
        opponentDiffLabel.innerHTML = opponent.difficulty;
    }
}
