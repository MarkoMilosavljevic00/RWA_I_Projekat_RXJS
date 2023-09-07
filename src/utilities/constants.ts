export const CLASS_NAMES = {
    CONTAINERS:{
        APP: "app-container",
        PICKER: "picker-container",
        LIVE: "live-container"
    },
    TABS:{
        START_TAB: "start-tab",
        PICKER_TAB: "picker-tab",
        LIVE_TAB: "live-tab",
        RESULT_TAB: "result-tab"
    },
    IMAGES:{
        RED_CORNER: "red-corner-img",
        BLUE_CORNER: "blue-corner-img",
        OPPONENT: "opponent-img",
    },
    PROGRESS_BARS:{
        RED_CORNER_SKILLS: "red-corner-skill-bars",
        BLUE_CORNER_SKILLS: "blue-corner-skill-bars",
        DAMAGE: "damage-bar",
    },
    SELECTS:{
        DIFF_LEVEL: "difficulty-level-select",
        RULES: "rules-select",
        WEIGHTCLASS: "weightclass-select",
        METHOD: "method-select",
        ROUND: "round-select",
    },
    ICONS: {
        STAR: "bi-star",
        STAR_FILL: "bi-star-fill",
    },
    STYLES: {
        RED_TEXT: "text-danger",
        BLUE_TEXT: "text-primary",
        DARK_TEXT: "text-black",
    },
    STATES:{
        DISABLED:"disabled",
        ACTIVE:"active",
        COLLAPSE: "collapse",
    },
    LABELS:{
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
        SUBMISSION: "submission-label"
    },
    LISTS:{
        FIGHT: "fight-list",
        LIVE:"live-list",
    },
    TEMPLATES:{
        FIGHT: "fight-template",
        ROUND: "round-template",
    },
    CARDS:{
        FIGHT: "fight-card-",
        ROUND: "round-card-",
    },
    RED_CORNER_RADIO: "red-corner-radio",
    BLUE_CORNER_RADIO: "blue-corner-radio",
    WINNER_RADIO: "winner-radio",
    REMOVE_BUTTON: "remove-button",
    PICK_DIV:"pick-div",
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
    NUMBER_OF_ROUNDS:{
        MMA:3,
        BOXING: 12,
        GRAPPLING: 1,
        KICKBOXING: 5
    },
    DURATION_OF_ROUND:{
        MMA:5,
        BOXING:3,
        GRAPPLING: 10,
        KICKBOXING: 3,
    }
};

export const PATHS = {
    IMAGES:{
        FIGHTERS: "./src/assets/fighters/",
        OPPONENTS: "./src/assets/opponents/"
    }
}

export const TIME = {
    SECONDS_IN_MINUTE: 60,
}

export const INDEXES = {
    RED_CORNER: 0,
    BLUE_CORNER: 1,
}