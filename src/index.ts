import { Subject } from "rxjs";
import { AppComponent } from "./components/app.component";
import { LiveComponent } from "./components/live.component";
import { PickerComponent } from "./components/picker.component";
import { ResultComponent } from "./components/result.component";
import { Corner } from "./enums/corner.enum";
import { DifficultyLevel } from "./enums/difficulty-level.enum";
import { Rules } from "./enums/rules.enum";
import { Weightclass } from "./enums/weightclass.enum";
import { FightCard } from "./models/fightCard";
import { Fighter } from "./models/fighter";
import { FightStats, Scorecard } from "./models/fightStats";
import { Opponent } from "./models/opponent";
import { changeDifficultyHandler, getOpponentHandler, goToPickerHandler, restartPointsHandler, resetFightcardHandler, goToLiveAndResultHandler } from "./observables/app.logic/app.handlers";
import { getChangeDifficultyObs, getGoToLiveAndResultObs, getRestartPointsObs } from "./observables/app.logic/app.observables";
import { startFightsHandler } from "./observables/live.logic/live.handlers";
import { changeFighterHandler, getFightersByFightInfoHandler, getChangeRulesHandler, getChangeMethodHandler } from "./observables/picker.logic/picker.handlers";
import { getChangeRulesObs } from "./observables/picker.logic/picker.observables";
import { fightCardIsOverHandler, getResultsHandler } from "./observables/result.logic/result.handlers";
import { getFightCardIsOverObs } from "./observables/result.logic/result.observables";
import { getRandomValueWithWeightedProbability } from "./utilities/helpers";

let fightCard: FightCard = new FightCard();
let picker: PickerComponent = new PickerComponent(fightCard);
let app = new AppComponent();
let live = new LiveComponent();
let result = new ResultComponent(fightCard);

changeDifficultyHandler(app);
goToPickerHandler(app);
goToLiveAndResultHandler(app, fightCard);
restartPointsHandler(app);
getOpponentHandler(app, result);

resetFightcardHandler(picker,result, live, app);
getChangeRulesHandler(picker);
getChangeMethodHandler(picker);
getFightersByFightInfoHandler(picker);
changeFighterHandler(picker);


let endOfFight$ = getResultsHandler(result);
let endOfFightCard$ = fightCardIsOverHandler(result, app);
startFightsHandler(picker, live, endOfFight$, endOfFightCard$);
