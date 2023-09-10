// import { fromEvent, merge } from "rxjs";

import { AppComponent } from "./components/app.component";
import { LiveComponent } from "./components/live.component";
import { PickerComponent } from "./components/picker.component";
import { ResultComponent } from "./components/result.component";
import { Corner } from "./enums/corner.enum";
import { DifficultyLevel } from "./enums/difficulty-level.enum";
import { FightEventType, KickType, SubmissionType } from "./enums/fight-event-type.enum";
import { Method } from "./enums/method.enum";
import { Position } from "./enums/position.enum";
import { Rules } from "./enums/rules.enum";
import { Weightclass } from "./enums/weightclass.enum";
import { FightCard } from "./models/fightCard";
import { Fighter } from "./models/fighter";
import { FightEvent } from "./models/fightEvent";
import { Opponent } from "./models/opponent";
import { Result } from "./models/result";

let fightCard: FightCard = new FightCard();
let picker: PickerComponent = new PickerComponent(fightCard);
let app: AppComponent = new AppComponent();
let live: LiveComponent = new LiveComponent();
let result: ResultComponent = new ResultComponent(fightCard);

app.setSelectOptionsForRounds(Rules.Boxing);
app.setSelects();

app.setYourPoints(500);
app.addToYourPoints(40);
app.addToOpponentPoints(75);

let opponent1: Opponent = new Opponent(0,"Mirko Klisura",DifficultyLevel.Easy,"img1.jpg")

app.setOpponent(opponent1);

//app.disableTabs(CLASS_NAMES.TABS.PICKER_TAB, CLASS_NAMES.TABS.RESULT_TAB);

let fighter1: Fighter = new Fighter(1, "Conor McGregor", "mcgregor.png", Rules.MMA, Weightclass.Featherweight, 86, 72);
let fighter2: Fighter = new Fighter(2, "Max Holloway", "holloway.png", Rules.MMA, Weightclass.Featherweight, 90, 72);
let fighter3: Fighter = new Fighter(3, "Khabib Nurmagomedov", "nurmagomedov.png", Rules.MMA, Weightclass.Lightweight, 70, 100);
let fighter4: Fighter = new Fighter(4, "Tony Ferguson", "ferguson.png", Rules.MMA, Weightclass.Lightweight, 80, 85);
let fighter5: Fighter = new Fighter(5, "Tyron Woodley", "woodley.png", Rules.MMA, Weightclass.Welterweight, 85, 80);
let fighter6: Fighter = new Fighter(6, "Colby Covington", "covington.png", Rules.MMA, Weightclass.Welterweight, 75, 85);
let fighter7: Fighter = new Fighter(7, "Israel Adesanya", "adesanya.jpg", Rules.MMA, Weightclass.Middleweight, 95, 75);
let fighter8: Fighter = new Fighter(8, "Robert Whittaker", "whittaker.jpg", Rules.MMA, Weightclass.Middleweight, 85, 83);
let fighter9: Fighter = new Fighter(9, "Stipe Miocic", "miocic.jpg", Rules.MMA, Weightclass.Heavyweight, 85, 80);
let fighter10: Fighter = new Fighter(10, "Francis Ngannou", "ngannou.jpg", Rules.MMA, Weightclass.Heavyweight, 95, 75);
let fighter11: Fighter = new Fighter(11, "Floyd Mayweather Jr.", "mayweather.jpg", Rules.Boxing, Weightclass.Welterweight, 95, 0);
let fighter12: Fighter = new Fighter(12, "Manny Pacquiao", "pacquiao.jpg", Rules.Boxing, Weightclass.Welterweight, 90, 0);
let fighter13: Fighter = new Fighter(13, "Canelo Alvarez", "alvarez.jpg", Rules.Boxing, Weightclass.Middleweight, 90, 0);
let fighter14: Fighter = new Fighter(14, "Gennady Golovkin", "golovkin.jpg", Rules.Boxing, Weightclass.Middleweight, 85, 0);
let fighter15: Fighter = new Fighter(15, "Anthony Joshua", "joshua.jpg", Rules.Boxing, Weightclass.Heavyweight, 85, 0);
let fighter16: Fighter = new Fighter(16, "Tyson Fury", "fury.jpg", Rules.Boxing, Weightclass.Heavyweight, 80, 0);
let fighter17: Fighter = new Fighter(17, "Giorgio Petrosyan", "petrosyan.jpg", Rules.Kickboxing, Weightclass.Middleweight, 95, 0);
let fighter18: Fighter = new Fighter(18, "Buakaw Banchamek", "buakaw.jpg", Rules.Kickboxing, Weightclass.Middleweight, 90, 0);



picker.setFighter(fighter1, Corner.BlueCorner)
picker.setFighter(fighter2, Corner.RedCorner)
let fight = picker.getFightInfo();
picker.addFight(fight);
live.setNewFight(fight);
picker.setFighter(fighter3, Corner.BlueCorner)
picker.setFighter(fighter4, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter5, Corner.BlueCorner)
picker.setFighter(fighter6, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter7, Corner.BlueCorner)
picker.setFighter(fighter8, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter9, Corner.BlueCorner)
picker.setFighter(fighter10, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter11, Corner.BlueCorner)
picker.setFighter(fighter12, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter13, Corner.BlueCorner)
picker.setFighter(fighter14, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter15, Corner.BlueCorner)
picker.setFighter(fighter16, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter17, Corner.BlueCorner)
picker.setFighter(fighter18, Corner.RedCorner)
 fight = picker.getFightInfo();
picker.addFight(fight);
picker.setFighter(fighter1, Corner.BlueCorner)
picker.setFighter(fighter2, Corner.RedCorner)

live.addRound();
live.addSecond(82);
let event: FightEvent = {
    attacker: Corner.BlueCorner,
    eventType: FightEventType.GettingUp,
    eventSubType: KickType.RundhouseKick,
    damage: 10,
    energySpent: 1,
}
live.addFightEvent(event, 3);
live.changePosition(Position.Standup);
live.renderWinner(Method.Submission, 1);

let r = result.getResultFromScorecards(live.roundStats);
let r1: Result = {
    winner:Corner.RedCorner,
    round: 3,
    method: Method.KO_TKO  
}
result.addResult(r1, 0, opponent1);
result.addResult(r1, 1, opponent1);