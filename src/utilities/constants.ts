export const CLASS_NAMES = {
    CONTAINERS: {
        APP: "app-container",
        PICKER: "picker-container",
        LIVE: "live-container",
        RESULT: "result-container",
    },
    TABS: {
        NAV_LINKS: {
            START: "start-tab-nav-link",
            PICKER: "picker-tab-nav-link",
            LIVE: "live-tab-nav-link",
            RESULT: "result-tab-nav-link",
            NAV_LINK: "nav-link",
        },
        PANES: {
            START: "start-tab-pane",
            PICKER: "picker-tab-pane",
            LIVE: "live-tab-pane",
            RESULT: "result-tab-pane",
            TAB_PANE: "tab-pane",
        },
    },
    IMAGES: {
        RED_CORNER: "red-corner-img",
        BLUE_CORNER: "blue-corner-img",
        OPPONENT: "opponent-img",
        EVENT: "event-img",
        WINNER: "winner-img",
        METHOD: "method-img",
        ROUND: "round-img",
    },
    PROGRESS_BARS: {
        RED_CORNER_SKILLS: "red-corner-skill-bars",
        BLUE_CORNER_SKILLS: "blue-corner-skill-bars",
        DAMAGE: "damage-bar",
    },
    SELECTS: {
        DIFFICULTY: "difficulty-level-select",
        RULES: "rules-select",
        WEIGHTCLASS: "weightclass-select",
        METHOD: "method-select",
        ROUND: "round-select",
        RED_CORNER: "red-corner-select",
        BLUE_CORNER: "blue-corner-select",
    },
    OPTIONS: {
        DIFFICULTY: "difficulty-level-option",
        RULES: "rules-option",
        WEIGHTCLASS: "weightclass-option",
        METHOD: "method-option",
        ROUND: "round-option",
        FIGHTER: "fighter-option",
    },
    ICONS: {
        STAR: "bi-star",
        STAR_FILL: "bi-star-fill",
        CHECK_SQUARE: "bi-check2-square",
        X_SQUARE: "bi-x-square",
    },
    STYLES: {
        RED_TEXT: "text-danger",
        BLUE_TEXT: "text-primary",
        DARK_TEXT: "text-black",
        GREEN_TEXT: "text-success",
        GRAY_TEXT: "text-secondary",
    },
    STATES: {
        DISABLED: "disabled",
        ACTIVE: "active",
        COLLAPSE: "collapse",
        SHOW: "show",
    },
    LABELS: {
        YOUR_POINTS: "your-points-label",
        OPPONENT_POINTS: "opponent-points-label",
        OPPONENT_NAME: "opponent-name-label",
        OPPONENT_DIFFICULTY: "opponent-difficulty-label",
        RED_CORNER_WINNER: "red-corner-winner-label",
        BLUE_CORNER_WINNER: "blue-corner-winner-label",
        RULES: "rules-label",
        WEIGHTCLASS: "weightclass-label",
        RED_CORNER_ODD: "red-corner-odd-label",
        BLUE_CORNER_ODD: "blue-corner-odd-label",
        RED_CORNER: "red-corner-label",
        BLUE_CORNER: "blue-corner-label",
        WINNER: "winner-label",
        METHOD: "method-label",
        ROUND: "round-label",
        TIME: "time-label",
        SIGNIFICIANT_STRIKES: "significiant-strikes-label",
        TAKEDOWNS: "takedowns-label",
        SUBMISSION: "submission-label",
        EVENT_DAMAGE: "event-damage-label",
        EVENT_ENERGY: "event-energy-label",
        EVENT_TYPE: "event-type-label",
        EVENT_SUBTYPE: "event-subtype-label",
        EVENT_TIME_LABEL: "event-time-label",
        WIN_INFO_LABEL: "win-info-label",
        YOUR_WINNER_POINTS: "your-winner-points-label",
        OPPONENT_WINNER_POINTS: "opponent-winner-points-label",
        YOUR_METHOD_POINTS: "your-method-points-label",
        OPPONENT_METHOD_POINTS: "opponent-method-points-label",
        YOUR_ROUND_POINTS: "your-round-points-label",
        OPPONENT_ROUND_POINTS: "opponent-round-points-label",
        TOTAL_POINTS: "total-points-label",
        YOUR_FIGHCARD_POINTS: "your-fightcard-points-label",
        OPPONENT_FIGHCARD_POINTS: "opponent-fightcard-points-label",
    },
    LISTS: {
        FIGHT: "fight-list",
        LIVE: "live-list",
        RESULT: "result-list",
        RED_CORNER_WINNER: "red-corner-winner-list",
        BLUE_CORNER_WINNER: "blue-corner-winner-list",
    },
    TEMPLATES: {
        FIGHT: "fight-template",
        RESULT: "result-template",
        LIVE: {
            ROUND: "round-template",
            RED_CORNER_EVENT: "red-corner-event-template",
            BLUE_CORNER_EVENT: "blue-corner-event-template",
            INFO_STANDUP_EVENT: "info-standup-event-template",
            INFO_GROUND_EVENT: "info-ground-event-template",
            INFO_ROUND_WINNER_EVENT: "info-round-winner-event-template",
        },
    },
    ITEMS: {
        FIGHT: "fight-item-",
        ROUND: "round-item-",
        RESULT: "result-item-",
    },
    BUTTONS: {
        START: "start-button",
        FIND_NEW_OPPONENT: "find-new-opponent-button",
        RESTART_SCORE: "restart-score-button",
        PLAY_AGAIN: "play-again-button",
        ADD_FIGHT: "add-fight-button",
        START_FIGHTS: "start-fights-button",
    },
    RED_CORNER_RADIO: "red-corner-radio",
    BLUE_CORNER_RADIO: "blue-corner-radio",
    WINNER_RADIO: "winner-radio",
    REMOVE_BUTTON: "remove-button",
    PICK_DIV: "pick-div",
    RESULT_FIGHT_DIV: "result-fight-div",
    RESULT_PICK_DIV: "result-pick-div",
    ROUND_DIV: "round-div",
    MAIN_SCOREBOARD: "main-scoreboard",
};

export const TYPE_OF_ELEMENTS = {
    DIV: "div",
    IMG: "img",
};

export const RULES = {
    NUMBER_OF_SKILLS: {
        MMA: 2,
        BOXING: 1,
        GRAPPLING: 1,
        KICKBOXING: 1,
    },
    NUMBER_OF_ROUNDS: {
        MMA: 2,
        Boxing: 12,
        Grappling: 1,
        Kickboxing: 5,
    },
    ROUND_DURATION: {
        MMA: 1,
        Boxing: 3,
        Grappling: 10,
        Kickboxing: 3,
    },
};

export const PATHS = {
    IMAGES: {
        ICONS: "./src/assets/icons/",
        FIGHTERS: "./src/assets/fighters/",
        OPPONENTS: "./src/assets/opponents/",
    },
};

export const IMAGES = {
    PUNCH: "punch-w.png",
    KICK: "kick-w.png",
    TAKEDOWN: "takedown-w.png",
    SUBMISSION_ATTEMPT: "submission-w.png",
    GETTING_UP: "getting-up-w.png",
    WINNER: "winner-g.png",
    DECISION: "decision-g.png",
    KO: "ko-g.png",
    SUBMISSION: "submission-g.png",
    ROUND: "round-g.png",
};

export const TIME = {
    SECONDS_IN_MINUTE: 60,
    SECOND_DURATION: 100,
    EVENT_FREQ: 100,
};

export const INDEXES = {
    FIGHTERS: {
        RED_CORNER: 0,
        BLUE_CORNER: 1,
    },
    PLAYERS: {
        YOUR: 0,
        OPPONENT: 1,
    },
    HITS: {
        WINNER: 0,
        METHOD: 1,
        ROUND: 2,
    },
};

export const KEYS = {
    RED_CORNER: "redCorner",
    BLUE_CORNER: "blueCorner",
    DAMAGE: "damage",
    SIGNIFICIANT_STRIKES: "significiantStrikes",
    TAKEDOWNS: "takedowns",
    SUBMISSION_ATTEMPTS: "submissionAttempts",
    WINNER: "winner",
};

export const POINTS = {
    INITIAL: 0,
    ROUND: {
        WINNER: 10,
        LOSER: 9,
        CONVICING_LOSER: 8,
    },
    HITS: {
        WINNER: 10,
        METHOD: 5,
        ROUND: 5,
    },
};

export const PROBABILITY = {
    DIFFICULTY: {
        EASY: 0.5,
        MEDIUM: 0.7,
        HARD: 0.9,
    },
    EVENT_HAPPEN: 1,
};

export const DEFAULT = {
    FIGHTER: {
        ID: 0,
        NAME: "Choose Fighter...",
        PICTURE_SRC: "default-fighter.png",
        STRIKING: 50,
        GRAPPLING: 50,
    },
};

export const DAMAGE = {
    MAX: 100,
};
