import { ELEMENTS, INDEXES, IMG_DIMENSIONS, SCORE } from "../environment";
import { DifficultyLevel } from "../enums/DifficultyLevelEnum";
import { Method } from "../enums/MethodEnum";
import { Round } from "../enums/RoundEnum";
import { WeightClass } from "../enums/WeightClassEnum";
import { Corner } from "../enums/CornerEnum";
import { Fight } from "../model/fight";
import { Result } from "../model/result";
import { initNewPickDiv } from "./initalizing.elements";
import {
  setSelectOptions,
  renderElements,
  getStringsOfMethods,
  getStringsOfRounds,
  roundWinner,
} from "./view";

export function createFindingOpponentElements(): HTMLElement[] {
  let findingOpponentLabel = document.createElement("label");
  findingOpponentLabel.innerHTML = "Choose Difficulty Level:";

  const difficulties = Object.values(DifficultyLevel);
  let findingOpponentSelect = createSelect(ELEMENTS.DIFFIULTY_SEL);
  setSelectOptions(findingOpponentSelect, difficulties, difficulties);

  let findingOpponentButton = document.createElement("button");
  findingOpponentButton.innerHTML = "Find Opponent";
  findingOpponentButton.className = ELEMENTS.FINDING_OPP_BTN;

  return [findingOpponentLabel, findingOpponentSelect, findingOpponentButton];
}

export function createTopElements(findingOpponentDiv: HTMLDivElement) {
  let pointsDivs = createPointsElements();
  let yourPointsDiv = pointsDivs[SCORE.INDEX.FIRST];
  let opponentPointsDiv = pointsDivs[SCORE.INDEX.SECOND];

  createRestartButton(findingOpponentDiv);

  let opponentStatsDiv = createOpponentStatsDiv();

  return [
    yourPointsDiv,
    findingOpponentDiv,
    opponentStatsDiv,
    opponentPointsDiv,
  ];
}

export function createRestartButton(findingOpponentDiv: HTMLDivElement) {
  let restartButton = document.createElement("button");
  restartButton.className = ELEMENTS.RESTART_BTN;
  restartButton.innerHTML = "Restart Game";
  findingOpponentDiv.appendChild(restartButton);
}

export function createOpponentStatsDiv() {
  let opponentStatsDiv = document.createElement("div");
  opponentStatsDiv.className = ELEMENTS.OPP_STATS_DIV;

  let opponentPicture = new Image(
    IMG_DIMENSIONS.OPP.WIDTH,
    IMG_DIMENSIONS.OPP.HEIGHT
  );
  opponentPicture.className = ELEMENTS.OPP_PICTURE;

  let opponentNameDiv = document.createElement("div");
  let opponentDifficultyDiv = document.createElement("div");

  let opponentNameText = document.createElement("label");
  opponentNameText.innerHTML = `Name: `;

  let opponentDifficultyText = document.createElement("label");
  opponentDifficultyText.innerHTML = `Difficulty: `;

  let opponentNameLabel = document.createElement("label");
  opponentNameLabel.classList.add(ELEMENTS.OPP_NAME_LABEL);

  let opponentDifficultyLabel = document.createElement("label");
  opponentDifficultyLabel.classList.add(ELEMENTS.OPP_DIFF_LABEL);

  renderElements(opponentNameDiv, opponentNameText, opponentNameLabel);
  renderElements(
    opponentDifficultyDiv,
    opponentDifficultyText,
    opponentDifficultyLabel
  );

  renderElements(
    opponentStatsDiv,
    opponentPicture,
    opponentNameDiv,
    opponentDifficultyDiv
  );

  return opponentStatsDiv;
}

export function createPointsElements() {
  let yourPointsDiv = document.createElement("div");
  yourPointsDiv.className = ELEMENTS.YOUR_POINTS_DIV;
  let opponentPointsDiv = document.createElement("div");
  opponentPointsDiv.className = ELEMENTS.OPP_POINTS_DIV;

  let yourPointsLabel = document.createElement("label");
  yourPointsLabel.innerHTML = "Your Points:";
  yourPointsDiv.appendChild(yourPointsLabel);
  let yourPoints = document.createElement("label");
  yourPoints.classList.add(ELEMENTS.YOUR_POINTS);
  yourPointsDiv.appendChild(yourPoints);

  let opponentPointsLabel = document.createElement("label");
  opponentPointsLabel.innerHTML = "Opponents Points:";
  opponentPointsDiv.appendChild(opponentPointsLabel);
  let opponentPoints = document.createElement("label");
  opponentPoints.classList.add(ELEMENTS.OPP_POINTS);
  opponentPointsDiv.appendChild(opponentPoints);

  return [yourPointsDiv, opponentPointsDiv];
}

export function createYourPicksElements(): HTMLElement[] {
  let yourPicksLabel = document.createElement("label");
  yourPicksLabel.innerHTML = "Your Picks: ";

  let yourFightCardDiv = document.createElement("div");
  yourFightCardDiv.className = ELEMENTS.YOUR_FIGHTCARD_DIV;

  let playBtn = document.createElement("button");
  playBtn.innerHTML = "PLAY";
  playBtn.className = ELEMENTS.PLAY_BTN;

  let playAgainBtn = document.createElement("button");
  playAgainBtn.innerHTML = "Play Again";
  playAgainBtn.className = ELEMENTS.PLAY_AGAIN_BTN;
  playAgainBtn.style.visibility = "hidden";

  let newPickDiv = initNewPickDiv();

  return [yourPicksLabel, yourFightCardDiv, newPickDiv, playBtn, playAgainBtn];
}

export function createOpponentPicksElements() {
  let opponentPicksLabel = document.createElement("label");
  opponentPicksLabel.innerHTML = "Opponent Picks: ";

  let opponentFightCardDiv = document.createElement("div");
  opponentFightCardDiv.className = ELEMENTS.OPP_FIGHTCARD_DIV;

  return [opponentPicksLabel, opponentFightCardDiv];
}

export function createResultsElements() {
  let resultLabel: HTMLLabelElement = document.createElement("label");
  resultLabel.innerHTML = "Results: ";

  let resultFightCardDiv: HTMLDivElement = document.createElement("div");
  resultFightCardDiv.className = ELEMENTS.RESULT_FIGHTCARD_DIV;
  return [resultLabel, resultFightCardDiv];
}

export function createNewPickElements() {
  let topNewPickDiv = createTopNewPickDiv();
  let bottomNewPickDiv = createBottomNewPickDiv();

  let addFightPickBtn = document.createElement("button");
  addFightPickBtn.innerHTML = "Add new pick";
  addFightPickBtn.className = ELEMENTS.ADD_PICK_BTN;

  return [topNewPickDiv, bottomNewPickDiv, addFightPickBtn];
}

export function createBottomNewPickDiv() {
  let bottomNewPickDiv = document.createElement("div");
  bottomNewPickDiv.className = ELEMENTS.BOTTOM_NEW_PICK_DIV;

  let blueCornerDiv = createCornerDiv(
    ELEMENTS.BLUE_CORNER_DIV,
    ELEMENTS.BLUE_CORNER_SEL,
    Corner.BLUE_CORNER
  );
  let redCornerDiv = createCornerDiv(
    ELEMENTS.RED_CORNER_DIV,
    ELEMENTS.RED_CORNER_SEL,
    Corner.RED_CORNER
  );

  let outcomeDiv = createOutcomeDiv();

  renderElements(bottomNewPickDiv, blueCornerDiv, outcomeDiv, redCornerDiv);
  return bottomNewPickDiv;
}

export function createOutcomeDiv() {
  let outcomeDiv = document.createElement("div");
  outcomeDiv.className = ELEMENTS.OUTCOME_DIV;
  let methodesEnum = Object.values(Method);
  let methodes: string[] = getStringsOfMethods(methodesEnum);
  let methodSelect = createSelect(ELEMENTS.METHOD_SEL);
  setSelectOptions(methodSelect, methodes, methodesEnum);

  let roundsEnum = Object.values(Round);
  let rounds: string[] = getStringsOfRounds(roundsEnum);
  let roundSelect = createSelect(ELEMENTS.ROUND_SEL);
  setSelectOptions(roundSelect, rounds, roundsEnum);

  renderElements(outcomeDiv, methodSelect, roundSelect);

  return outcomeDiv;
}

export function createLiveElements() {
  let liveStreamText = document.createElement("h2");
  liveStreamText.innerHTML = "LIVE STREAM";

  let fightNumberDiv = createFightNumberDiv();
  let liveTimerDiv = createLiveTimerDiv();
  let streamDiv = createStreamDiv();

  return [liveStreamText, fightNumberDiv, liveTimerDiv, streamDiv];
}

function createStreamDiv() {
  let streamDiv = document.createElement("div");
  streamDiv.className = ELEMENTS.STREAM_DIV;

  let blueStreamDiv = createFighterStreamDiv(ELEMENTS.BLUE_STREAM_DIV);
  let redStreamDiv = createFighterStreamDiv(ELEMENTS.RED_STREAM_DIV);

  renderElements(streamDiv, blueStreamDiv, redStreamDiv);
  return streamDiv;
}

function createFighterStreamDiv(selection: string) {
  let selectionStreamNameDiv,
    selectionStreamNameLabel,
    selectionStreamOddsLabel,
    selectionStreamEventsDiv,
    selectionStreamDamageSpan,
    selectionStreamDamageText,
    selectionStreamDamageLabel: string;
  if (selection === ELEMENTS.BLUE_STREAM_DIV) {
    selectionStreamNameDiv = ELEMENTS.BLUE_STREAM_NAME_DIV;
    selectionStreamNameLabel = ELEMENTS.BLUE_STREAM_NAME_LAB;
    selectionStreamOddsLabel = ELEMENTS.BLUE_STREAM_ODDS_LAB;
    selectionStreamEventsDiv = ELEMENTS.BLUE_STREAM_EVENTS_DIV;
    selectionStreamDamageSpan = ELEMENTS.BLUE_STREAM_DAMAGE_SPAN;
    selectionStreamDamageText = ELEMENTS.BLUE_STREAM_DAMAGE_TEXT;
    selectionStreamDamageLabel = ELEMENTS.BLUE_STREAM_DAMAGE_LAB;
  } else {
    selectionStreamNameDiv = ELEMENTS.RED_STREAM_NAME_DIV;
    selectionStreamNameLabel = ELEMENTS.RED_STREAM_NAME_LAB;
    selectionStreamOddsLabel = ELEMENTS.RED_STREAM_ODDS_LAB;
    selectionStreamEventsDiv = ELEMENTS.RED_STREAM_EVENTS_DIV;
    selectionStreamDamageSpan = ELEMENTS.RED_STREAM_DAMAGE_SPAN;
    selectionStreamDamageText = ELEMENTS.RED_STREAM_DAMAGE_TEXT;
    selectionStreamDamageLabel = ELEMENTS.RED_STREAM_DAMAGE_LAB;
  }

  let fighterStreamDiv = document.createElement("div");
  fighterStreamDiv.className = selection;

  let fighterStreamNameDiv = createFighterStreamNameDiv(
    selectionStreamNameDiv,
    selectionStreamNameLabel,
    selectionStreamOddsLabel,
    selectionStreamDamageSpan,
    // selectionStreamDamageText,
    selectionStreamDamageLabel
  );
  let fighterStreamEventsDiv = createFighterStreamEventsDiv(
    selectionStreamEventsDiv
  );

  renderElements(
    fighterStreamDiv,
    fighterStreamNameDiv,
    fighterStreamEventsDiv
  );
  return fighterStreamDiv;
}

function createFighterStreamEventsDiv(selectionStreamEventsDiv: string) {
  let fighterStreamEventsDiv = document.createElement("div");
  fighterStreamEventsDiv.className = selectionStreamEventsDiv;

  return fighterStreamEventsDiv;
}

function createFighterStreamNameDiv(
  selectionStreamNameDiv: string,
  selectionStreamNameLabel: string,
  selectionStreamOddsLabel: string,
  selectionStreamDamageSpan: string,
  // selectionStreamDamageText: string,
  selectionStreamDamageLabel: string
) {
  let fighterStreamNameDiv = document.createElement("div");
  fighterStreamNameDiv.className = selectionStreamNameDiv;

  let fighterStreamNameLabel = document.createElement("label");
  fighterStreamNameLabel.className = selectionStreamNameLabel;
  let fighterStreamOddsLabel = document.createElement("label");
  fighterStreamOddsLabel.className = selectionStreamOddsLabel;

  let fighterStreamDamageDiv = createStreamDamageSpan(
    fighterStreamNameDiv,
    selectionStreamDamageSpan,
    selectionStreamDamageLabel
  );

  renderElements(
    fighterStreamNameDiv,
    fighterStreamNameLabel,
    fighterStreamOddsLabel,
    fighterStreamDamageDiv,
  );

  return fighterStreamNameDiv;
}

function createStreamDamageSpan(
  fighterStreamNameDiv: HTMLDivElement,
  selectionStreamDamageSpan: string,
  selectionStreamDamageLabel: string
) {
  let fighterStreamDamageSpan = document.createElement("span");
  fighterStreamDamageSpan.className = selectionStreamDamageSpan;
  let fighterStreamDamageText = document.createElement("label");
  // fighterStreamNameLabel.className = selectionStreamDamageText;
  fighterStreamDamageText.innerHTML = "Damage: ";

  let fighterStreamDamageLabSpan = document.createElement("span");
  let fighterStreamDamageLabel = document.createElement("label");
  fighterStreamDamageLabel.className = selectionStreamDamageLabel;
  let fighterStreamDamagePercent = document.createElement("label");
  fighterStreamDamagePercent.innerHTML = "%";
  renderElements(
    fighterStreamDamageLabSpan,
    fighterStreamDamageLabel,
    fighterStreamDamagePercent
  );

  renderElements(
    fighterStreamDamageSpan,
    fighterStreamDamageText,
    fighterStreamDamageLabSpan
  );
  
  return fighterStreamDamageSpan;
}

function createLiveTimerDiv() {
  let liveTimerDiv = document.createElement("div");
  liveTimerDiv.className = ELEMENTS.LIVE_TIMER_DIV;

  let roundSpan = document.createElement("div");
  roundSpan.className = ELEMENTS.TIMER_SPAN;
  let roundText = document.createElement("label");
  roundText.innerHTML = "Round: ";
  let roundLabel = document.createElement("label");
  roundLabel.className = ELEMENTS.LIVE_ROUND_LAB;
  renderElements(roundSpan, roundText, roundLabel);

  let counterSpan = document.createElement("div");
  counterSpan.className = ELEMENTS.TIMER_SPAN;
  let counterText = document.createElement("label");
  counterText.innerHTML = "Time: ";
  let counterLabel = document.createElement("label");
  counterLabel.className = ELEMENTS.LIVE_COUNTER_LAB;
  renderElements(counterSpan, counterText, counterLabel);

  renderElements(liveTimerDiv, roundSpan, counterSpan);
  return liveTimerDiv;
}

function createFightNumberDiv() {
  let fightNumberDiv = document.createElement("div");
  fightNumberDiv.className = ELEMENTS.LIVE_FIGHT_NUM_DIV;
  let fightNumberText = document.createElement("label");
  fightNumberText.innerHTML = "Fight Number ";
  let fightNumberLabel = document.createElement("label");
  fightNumberLabel.className = ELEMENTS.LIVE_FIGHT_NUM_LAB;
  renderElements(fightNumberDiv, fightNumberText, fightNumberLabel);

  return fightNumberDiv;
}

export function createCornerDiv(
  selectionDiv: string,
  selectionSel: string,
  valueRadio: string
) {
  let cornerDiv = document.createElement("div");
  cornerDiv.className = selectionDiv;
  let cornerSelect = createSelect(selectionSel);
  let cornerRadio = createRadio(valueRadio, ELEMENTS.CORNER_RADIO);
  let fighterStatsDiv = createFighterStats();

  renderElements(cornerDiv, cornerSelect, cornerRadio, fighterStatsDiv);
  return cornerDiv;
}
function createRadio(valueRadio: string, nameRadio: string) {
  let cornerRadio = document.createElement("input");
  cornerRadio.type = "radio";
  cornerRadio.name = nameRadio;
  cornerRadio.value = valueRadio;
  return cornerRadio;
}
function createFighterStats() {
  let fighterStatsDiv = document.createElement("div");
  fighterStatsDiv.className = ELEMENTS.FIGHTER_STATS_DIV;

  let standupRatingDiv = document.createElement("div");
  let standupRatingText = document.createElement("label");
  standupRatingText.innerHTML = "Standup: ";

  let grapplingRatingDiv = document.createElement("div");
  let grapplingRatingText = document.createElement("label");
  grapplingRatingText.innerHTML = "Grappling: ";

  let overallRatingDiv = document.createElement("div");
  let overallRatingText = document.createElement("label");
  overallRatingText.innerHTML = "Overall: ";

  let standupRating = document.createElement("label");
  standupRating.classList.add(ELEMENTS.STANDUP_LAB);
  let grapplingRating = document.createElement("label");
  grapplingRating.classList.add(ELEMENTS.GRAPPLING_LAB);
  let overallRating = document.createElement("label");
  overallRating.classList.add(ELEMENTS.OVERALL_LAB);

  renderElements(standupRatingDiv, standupRatingText, standupRating);
  renderElements(grapplingRatingDiv, grapplingRatingText, grapplingRating);
  renderElements(overallRatingDiv, overallRatingText, overallRating);

  renderElements(
    fighterStatsDiv,
    standupRatingDiv,
    grapplingRatingDiv,
    overallRatingDiv
  );

  return fighterStatsDiv;
}

export function createTopNewPickDiv() {
  let topNewPickDiv = document.createElement("div");
  topNewPickDiv.className = ELEMENTS.TOP_NEW_PICK_DIV;

  let chooseWeightClassLabel = document.createElement("label");
  chooseWeightClassLabel.innerHTML = "Choose Weight Class";

  const weightClasses = Object.values(WeightClass);
  let weightClassSelect = createSelect(ELEMENTS.WEIGHT_CLASS_SEL);
  setSelectOptions(weightClassSelect, weightClasses, weightClasses);
  renderElements(topNewPickDiv, chooseWeightClassLabel, weightClassSelect);
  return topNewPickDiv;
}

export function createFightElements(fight: Fight, pick: Result) {
  let blueCornerDiv = createFightCornerDiv(fight, ELEMENTS.FIGHT_BLUE_DIV);
  let redCornerDiv = createFightCornerDiv(fight, ELEMENTS.FIGHT_RED_DIV);
  let pickDiv = createPickDiv(pick);

  roundWinner(pick, blueCornerDiv, redCornerDiv);

  return [blueCornerDiv, redCornerDiv, pickDiv];
}

export function createPointsForEachDiv(score: number) {
  let pointsForEachDiv = document.createElement("div");

  let pointsForEachText = document.createElement("label");
  pointsForEachText.innerHTML = "Points: ";

  let pointsForEachLabel = document.createElement("label");

  pointsForEachLabel.innerHTML = `+ ${score.toString()}`;
  if (score > 0) {
    pointsForEachLabel.style.color = "green";
  } else {
    pointsForEachLabel.style.color = "red";
  }

  renderElements(pointsForEachDiv, pointsForEachText, pointsForEachLabel);
  return pointsForEachDiv;
}
function createPickDiv(pick: Result) {
  let pickDiv = document.createElement("div");
  pickDiv.className = ELEMENTS.FIGHT_PICK_DIV;

  let methodDiv = document.createElement("div");
  let methodText = document.createElement("label");
  methodText.innerHTML = "Method: ";

  let methodLabel = document.createElement("label");
  methodLabel.className = ELEMENTS.FIGHTER_LABEL;
  methodLabel.innerHTML = `${pick.methodOfVictory}`;
  renderElements(methodDiv, methodText, methodLabel);

  let roundDiv = document.createElement("div");
  let roundText = document.createElement("label");
  roundText.innerHTML = "Round: ";

  let roundLabel = document.createElement("label");
  roundLabel.innerHTML = `${pick.roundOfVictory}`;
  roundLabel.className = ELEMENTS.FIGHTER_LABEL;
  renderElements(roundDiv, roundText, roundLabel);

  renderElements(pickDiv, methodDiv, roundDiv);
  return pickDiv;
}
function createFightCornerDiv(fight: Fight, selection: string) {
  let cornerDiv = document.createElement("div");
  cornerDiv.className = selection;

  let cornerText = document.createElement("label");
  if (selection === ELEMENTS.FIGHT_BLUE_DIV) {
    cornerText.innerHTML = "Blue corner fighter: ";
  } else {
    cornerText.innerHTML = "Red corner fighter: ";
  }

  let cornerFighterLabel = document.createElement("label");
  if (selection === ELEMENTS.FIGHT_BLUE_DIV) {
    cornerFighterLabel.innerHTML = fight.blueCorner.name;
  } else {
    cornerFighterLabel.innerHTML = fight.redCorner.name;
  }
  cornerFighterLabel.className = ELEMENTS.FIGHTER_LABEL;
  renderElements(cornerDiv, cornerText, cornerFighterLabel);

  return cornerDiv;
}

export function createSelect(classEl: string) {
  let select = document.createElement("select");
  select.className = classEl;
  return select;
}
