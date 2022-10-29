export const API_URL = "http://localhost:3000";

export const ELEMENTS = {
  ORDER: {
    FIRST: 98,
    SECOND: 99,
  },
  INITIAL_DIV: "initial-div",
  CONTAINER: "container",
  TOP_DIV: "top-div",
  HOME_DIV: "home-div",
  FINDING_OPP_DIV: "finding-opponent-div",
  FINDING_OPP_BTN: "finding-opponent-button",
  DIFFIULTY_SEL: "difficulty-select",
  RESTART_BTN: "restart-button",
  OPP_STATS_DIV: "opponent-stats-div",
  OPP_PICTURE: "opponent-picture",
  OPP_NAME_LABEL: "opponent-name-label",
  OPP_DIFF_LABEL: "opponent-difficulty-label",
  YOUR_POINTS_DIV: "your-points-div",
  OPP_POINTS_DIV: "opponent-points-div",
  YOUR_POINTS: "your-points",
  OPP_POINTS: "opponent-points",
  YOUR_PICKS_DIV: "your-picks-div",
  OPP_PICKS_DIV: "opponent-picks-div",
  RESULT_DIV: "result-div",
  RESULT_FIGHTCARD_DIV: "result-fightcard-div",
  YOUR_FIGHTCARD_DIV: "your-fightcard-div",
  YOUR_FIGHT_DIV: "your-fight-div",
  OPP_FIGHT_DIV: "opponent-fight-div",
  RESULT_FIGHT_DIV: "result-fight-div",
  FIGHT_BLUE_DIV: "fight-blue-div",
  FIGHT_RED_DIV: "fight-red-div",
  FIGHT_PICK_DIV: "fight-pick-div",
  OPP_FIGHTCARD_DIV: "opponent-fightcard-div",
  ADD_PICK_BTN: "add-pick-button",
  PLAY_BTN: "play-button",
  PLAY_AGAIN_BTN: "play-again-button",
  NEW_PICK_DIV: "new-pick-div",
  WEIGHT_CLASS_SEL: "weightclass-select",
  BLUE_CORNER_SEL: "blue-corner-select",
  RED_CORNER_SEL: "red-corner-select",
  CORNER_SEL: "corner-select",
  TOP_NEW_PICK_DIV: "top-new-pick-div",
  BOTTOM_NEW_PICK_DIV: "bottom-new-pick-div",
  OUTCOME_DIV: "outcome-div",
  CORNER_RADIO: "corner-radio",
  METHOD_SEL: "method-select",
  ROUND_SEL: "round-select",
  RED_CORNER_DIV: "red-corner-div",
  BLUE_CORNER_DIV: "blue-corner-div",
  FIGHTER_STATS_DIV: "fighter-stats-div",
  STANDUP_LAB: "standup-label",
  GRAPPLING_LAB: "grappling-label",
  OVERALL_LAB: "overall-label",
  FIGHTER_LABEL: "fighter-label",
  POINTS_FOR_EACH_DIV: "points-for-each-div",
  LIVE_DIV: "live-div",
  LIVE_FIGHT_NUM_LAB: "live-fight-number-label",
  LIVE_FIGHT_NUM_DIV: "live-fight-number-div",
  LIVE_ROUND_LAB: "live-round-label",
  LIVE_TIMER_DIV: "live-timer-div",
  TIMER_SPAN: "timer-span",
  LIVE_COUNTER_LAB: "live-counter-label",
  BLUE_STREAM_DIV: "blue-stream-div",
  RED_STREAM_DIV: "red-stream-div",
  STREAM_DIV: "stream-div",
  BLUE_STREAM_NAME_DIV: "blue-stream-name-div",
  BLUE_STREAM_NAME_LAB: "blue-stream-name-label",
  BLUE_STREAM_ODDS_LAB: "blue-stream-odds-label",
  BLUE_STREAM_EVENTS_DIV: "blue-stream-events-div",
  BLUE_STREAM_DAMAGE_SPAN: "blue-stream-damage-span",
  BLUE_STREAM_DAMAGE_TEXT: "blue-stream-damage-text",
  BLUE_STREAM_DAMAGE_LAB: "blue-stream-damage-label",
  RED_STREAM_NAME_DIV: "red-stream-name-div",
  RED_STREAM_NAME_LAB: "red-stream-name-label",
  RED_STREAM_ODDS_LAB: "red-stream-odds-label",
  RED_STREAM_EVENTS_DIV: "red-stream-events-div",
  RED_STREAM_DAMAGE_SPAN: "red-stream-damage-span",
  RED_STREAM_DAMAGE_TEXT: "red-stream-damage-text",
  RED_STREAM_DAMAGE_LAB: "red-stream-damage-label",
};

export const SCORE = {
  INDEX: {
    FIRST: 0,
    SECOND: 1,
  },
  INITIAL: 0,
};

export const FIGHTER = {
  DAMAGE:{
    INITIAL: 0,
    MAX: 100,
  },
  INDEX: {
    BLUE_CORNER: 0,
    RED_CORNER: 1,
    INITIAL: 0,
  },
};

export const INDEXES = {
  FIRST_SCORE: 0,
  SECOND_SCORE: 1,
  BLUE_CORNER: 0,
  RED_CORNER: 1,
};

export const IMG_DIMENSIONS = {
  OPP: {
    WIDTH: 100,
    HEIGHT: 80,
  },
};

export const PERCENT = {
  OPP: {
    MAX: 100,
    EASY: 30,
    MEDIUM: 50,
    HARD: 70,
    WRONG_CHOICE: 0.5,
  },
  ROUND: {
    MAX: 90,
    FIRST: 30,
    SECOND: 60,
    THIRD: 90,
  },
};

export const TIME = {
  SECOND: 1000,
  PLAY_AGAIN: 2000,
  GO_TO_NEXT_FIGHT: 5000,
};

export const RULES = {
  MMA: {
    NUMBER_OF_RATINGS: 2,
    ROUND_LENGTH: {
      MINUTES: 10,
      SECONDS: 10,
    },
    PERCENT: {
      TO_TRY: {
        FROM_STANDUP: {
          SUBMISSION: 10,
          TAKEDOWN: 90,
        },
        FROM_GROUND: {
          PUNCH: 70,
          STAND: 40,
          SUBMISSION: 30,
        },
      },
      TO_SUCCES: {
        FROM_GROUND: {
          ADVANTAGE_ATTACK_PUNCH: 20,
          ADVANTAGE_DEFENSE_SUBMISSION: 30,
        },
        FROM_STANDUP: {
          ADVANTAGE_DEFENSE_SUBMISSION: 50,
          ADVANTAGE_DEFENSE_TAKEDOWN: 15,
        },
      },
    },
  },
  GRAPPLING: {
    ROUND_LENGTH: {
      MINUTES: 10,
      SECONDS: 10,
    },
    PERCENT: {
      SUCCES: {
        FROM_STANDUP: {},
      },
      FROM_STANDUP: {
        SUBMISSION: 25,
        TAKEDOWN: 75,
      },
      FROM_GROUND: {
        STAND: 5,
        SUBMISSION: 95,
      },
    },
  },
};

export const MAP_KEYS = {
  ODDS: {
    FAVOURITE: "favourite",
    UNDERDOG: "underdog",
    EQUAL: "equal",
  },
};

export const ATTACK = {
  FREQUENCY: 2000,
  FACTOR: {
    IMPORTANCE_OF_POSITON: 0.25,
    ADVANTAGE: 0.5,
  },
  PERCENT:{
    TO_HAPPEN: 20,
    NOT_TO_HAPPEN: 80,
  },
  DAMAGE: {
    FROM_STANDUP: {
      CLEAR_PUNCH: 7,
      BLOCKED_PUNCH: {
        SELF_DAMAGE: 3,
        OPP_DAMAGE: 1,
      },
      LANDED_TAKEDOWN: 6,
      DEFENDED_TAKEDOWN: {
        SELF_DAMAGE: 3,
        OPP_DAMAGE: 0,
      },
      UNSUCCESSFUL_SUBMISSION: {
        SELF_DAMAGE: 10,
        OPP_DAMAGE: 5,
      },
    },
    FROM_GROUND: {
      CLEAR_PUNCH: 4,
      BLOCKED_PUNCH: {
        SELF_DAMAGE: 1,
        OPP_DAMAGE: 1,
      },
      UNSUCCESSFUL_STANDING: {
        SELF_DAMAGE: 2,
        OPP_DAMAGE: 0,
      },
      UNSUCCESSFUL_SUBMISSION: {
        SELF_DAMAGE: 10,
        OPP_DAMAGE: 0,
      },
    },
  },
  TYPE_OF:{
    SUBMISSION:{
      ARM_TRIANGLE: "Arm Triangle choke",
      REAR_NAKED: "Rear-naked choke",
      ARMBAR: "Armbar",
      GUILLOTINE: "Guillotine choke",
      TRIANGLE: "Triangle choke",
    },
    PUNCH:{
      JAB: "Jab",
      CROSS: "Cross",
      HOOK: "Hook",
      UPPERCUT: "Uppercut",
    },
    KICK:{
      ROUNDHOUSE: "Roundhouse kick", 
      PUSH: "Push kick",
      SPINNING_BACK: "Spinning back kick", 
      CALF: "Calf kick",
      HIGH: "High kick",
    },
    TAKEDOWN:{
      SINGLE_LEG: "Single leg",
      DOUBLE_LEG: "Double leg",
      ANKLE_PICK: "Ankle pick",
      LEG_TRIP: "Leg trip",
      SUPLEX: "Suplex",
    }
  }
};
