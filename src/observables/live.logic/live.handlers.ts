import { Subject } from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { mapRulesToNumberOfRounds, mapRulesToRoundDuration, Rules } from "../../enums/rules.enum";
import { Fight } from "../../models/fight";
import { FightCard } from "../../models/fightCard";
import { FightEvent } from "../../models/fightEvent";
import { TIME } from "../../utilities/constants";
import { getStartFightsObs } from "./live.observables";

export function startFightsHandler(picker: PickerComponent, live: LiveComponent, endOfFight$: Subject<any>, endOfFightCard$: Subject<FightCard>){
    getStartFightsObs(picker, live, endOfFight$, endOfFightCard$)
        .subscribe(([fightEvent, rule]: [FightEvent, Rules]) => {
            console.log(fightEvent, rule);
            if(fightEvent)
                live.addFightEvent(fightEvent);
            live.addSecond();
            if(live.secondsElapsed + 1 === TIME.SECONDS_IN_MINUTE * mapRulesToRoundDuration(rule)){
                live.getWinnerOfRound();
                live.addRound();
            }
        });
}



