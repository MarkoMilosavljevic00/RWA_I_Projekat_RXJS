// import { fromEvent, merge } from "rxjs";

import { AppComponent } from "./components/app.component";
import { PickerComponent } from "./components/picker.component";
import { Corner } from "./enums/corner.enum";
import { DifficultyLevel } from "./enums/difficulty-level.enum";
import { Method } from "./enums/method.enum";
import { Rules } from "./enums/rules.enum";
import { Weightclass } from "./enums/weightclass.enum";
import { FightCard } from "./models/fightCard";
import { Fighter } from "./models/fighter";
import { CLASS_NAMES, RULES } from "./utilities/constants";
import { getCheckedRadioValue, mapStringToEnum, selectElementByClass } from "./utilities/helpers";

// let startButton = document.querySelector(".start-button")
// let findNewOpponentButton = document.querySelector(".find-new-opp-button")

// console.log(findNewOpponentButton);


// const klik1$ = fromEvent(startButton, 'click');
// const klik2$ = fromEvent(findNewOpponentButton, 'click');

// merge(klik1$, klik2$)
//     .subscribe(() => {
//         alert("Sve ok");
//     })

let fightCard: FightCard = new FightCard();
let picker :PickerComponent = new PickerComponent(fightCard);
let app = new AppComponent();




let mirko: Fighter = {
    id: 1,
    name: "Mirko",
    pictureSrc: "https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3088812.png&w=350&h=254",
    rule: Rules.MMA,
    weightclass: Weightclass.Featherweight,
    striking:64,
    grappling:50,
    overall:0
}

let nenad: Fighter = {
    id: 2,
    name: "Nenad Jezdic",
    pictureSrc: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRwLeJuu2Zk5adv0jP7HDLtFUK8s4MfbTpzDSYoPaE3Ez97bVQ5gCTeigzP3KNh2JhsuaEdcNJp6y05LG0",
    rule: Rules.MMA,
    weightclass: Weightclass.Featherweight,
    striking:89,
    grappling:71,
    overall:1
}

let zarko: Fighter = {
    id: 3,
    name: "Zarko",
    pictureSrc: "https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3088812.png&w=350&h=254",
    rule: Rules.MMA,
    weightclass: Weightclass.Featherweight,
    striking:12,
    grappling:44,
    overall:5
}

let srzentic: Fighter = {
    id: 4,
    name: "Nenad Srzentic",
    pictureSrc: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRwLeJuu2Zk5adv0jP7HDLtFUK8s4MfbTpzDSYoPaE3Ez97bVQ5gCTeigzP3KNh2JhsuaEdcNJp6y05LG0",
    rule: Rules.MMA,
    weightclass: Weightclass.Featherweight,
    striking:11,
    grappling:14,
    overall:15
}

let nesa: Fighter = {
    id: 5,
    name: "Nesa Bridzis",
    pictureSrc: "https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3088812.png&w=350&h=254",
    rule: Rules.MMA,
    weightclass: Weightclass.Featherweight,
    striking:16,
    grappling:11,
    overall:99
}

let zoki: Fighter = {
    id: 6,
    name: "Zoki i Nena",
    pictureSrc: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRwLeJuu2Zk5adv0jP7HDLtFUK8s4MfbTpzDSYoPaE3Ez97bVQ5gCTeigzP3KNh2JhsuaEdcNJp6y05LG0",
    rule: Rules.MMA,
    weightclass: Weightclass.Featherweight,
    striking:92,
    grappling:71,
    overall:52
}

app.setSelectFromValues(CLASS_NAMES.WEIGHTCLASS_SELECT, Weightclass)
app.setSelectFromValues(CLASS_NAMES.DIFF_LEVEL_SELECT, DifficultyLevel)
app.setSelectFromValues(CLASS_NAMES.RULES_SELECT, Rules)
app.setSelectFromValues(CLASS_NAMES.METHOD_SELECT, Method)
app.setSelectForRounds(CLASS_NAMES.ROUND_SELECT, Rules.Boxing)

picker.setFighter(mirko, Corner.BlueCorner)
picker.setFighter(nenad, Corner.RedCorner)
let fight = picker.getFight();
picker.getFightPredict(fight);
picker.addFight(fight);

picker.setFighter(zarko, Corner.BlueCorner)
picker.setFighter(srzentic, Corner.RedCorner)
fight = picker.getFight();
picker.getFightPredict(fight);
picker.addFight(fight);

picker.setFighter(nesa, Corner.BlueCorner)
picker.setFighter(zoki, Corner.RedCorner)
fight = picker.getFight();
picker.getFightPredict(fight);
picker.addFight(fight);

picker.removeFight(0);

