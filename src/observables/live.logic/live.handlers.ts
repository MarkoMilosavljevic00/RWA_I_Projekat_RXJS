import { Subject } from "rxjs";
import { LiveComponent } from "../../components/live.component";
import { PickerComponent } from "../../components/picker.component";
import { Position } from "../../enums/position.enum";
import { FightEvent } from "../../models/fightEvent";
import { TIME } from "../../utilities/constants";
import { getStartFightsObs } from "../picker.logic/picker.observables";

export function startFightsHandler(live: LiveComponent, picker: PickerComponent, endOfFight$: Subject<any>, endOfFightCard$: Subject<boolean>){
    getStartFightsObs(live, picker, endOfFight$, endOfFightCard$)
        .subscribe(([time ,fightEvent]: [{secondsElapsed: number, round: number},FightEvent]) => {
            if(fightEvent){
                live.addFightEvent(fightEvent);
                live.getWinnerFromFinish(fightEvent);
            }
            if(time.secondsElapsed === TIME.INITIAL.SECONDS){
                live.getWinnerOfRound();
                live.changePosition(Position.Standup);
            }
            live.setTimer(time);
        });
}



