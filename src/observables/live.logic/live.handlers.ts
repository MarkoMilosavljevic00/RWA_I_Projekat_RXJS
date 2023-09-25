import { Subject } from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { Position } from "../../enums/position.enum";
import { mapRulesToNumberOfRounds, mapRulesToRoundDuration, Rules } from "../../enums/rules.enum";
import { Fight } from "../../models/fight";
import { FightCard } from "../../models/fightCard";
import { FightEvent } from "../../models/fightEvent";
import { TIME } from "../../utilities/constants";
import { getStartFightsObs } from "./live.observables";

export function startFightsHandler(picker: PickerComponent, live: LiveComponent, endOfFight$: Subject<any>, endOfFightCard$: Subject<boolean>){
    getStartFightsObs(picker, live, endOfFight$, endOfFightCard$)
        .subscribe(([time ,fightEvent]: [{secondsElapsed: number, round: number},FightEvent]) => {
            if(fightEvent){
                live.addFightEvent(fightEvent);
                live.getWinnerFromFinish(fightEvent);
            }
            if(time.secondsElapsed === TIME.INITIAL.SECONDS){
                console.log("GOTOVA RUNDA", time);
                live.getWinnerOfRound();
                live.changePosition(Position.Standup);
            }
            live.setTimer(time);
            // live.addSecond();
            // if(live.secondsElapsed === TIME.TICKS_IN_MINUTE * mapRulesToRoundDuration(rule)){
            //     console.log("GOTOVA RUNDA");
            //     live.getWinnerOfRound();
            //     if(!live.isLastRound())
            //         live.addRound();
            // }
        });
}



