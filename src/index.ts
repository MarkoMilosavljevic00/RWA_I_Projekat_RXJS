import { AppComponent } from "./components/app.component";
import { LiveComponent } from "./components/live.component";
import { PickerComponent } from "./components/picker.component";
import { ResultComponent } from "./components/result.component";
import { FightCard } from "./models/fightCard";
import { changeDifficultyHandler, getOpponentHandler, goToPickerHandler, restartPointsHandler, resetFightcardHandler, goToLiveAndResultHandler } from "./observables/app.logic/app.handlers";
import { startFightsHandler } from "./observables/live.logic/live.handlers";
import { changeFighterHandler, changeFightersByFightInfoHandler, changeRulesHandler, changeMethodHandler } from "./observables/picker.logic/picker.handlers";
import { endOfFightcardHandler, getResultsHandler } from "./observables/result.logic/result.handlers";

let fightCard: FightCard = new FightCard();
let pickerComponent: PickerComponent = new PickerComponent(fightCard);
let appComponent = new AppComponent();
let liveComponent = new LiveComponent();
let resultComponent = new ResultComponent(fightCard);

changeDifficultyHandler(appComponent);
goToPickerHandler(appComponent);
goToLiveAndResultHandler(appComponent, fightCard);
restartPointsHandler(appComponent);
getOpponentHandler(appComponent, resultComponent);

resetFightcardHandler(pickerComponent, resultComponent, liveComponent, appComponent);
changeRulesHandler(pickerComponent);
changeMethodHandler(pickerComponent);
changeFightersByFightInfoHandler(pickerComponent);
changeFighterHandler(pickerComponent);


let endOfFight$ = getResultsHandler(resultComponent);
let endOfFightCard$ = endOfFightcardHandler(resultComponent, appComponent);
startFightsHandler(liveComponent, pickerComponent, endOfFight$, endOfFightCard$);

