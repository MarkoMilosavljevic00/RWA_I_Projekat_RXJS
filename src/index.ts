import { add, format } from "date-fns";
import { combineLatest, combineLatestAll, fromEvent, interval, merge, withLatestFrom, zip } from "rxjs";
import { initLogic } from "./controller/logic";

// let datum = new Date(0);
// let timer = document.body.querySelector(".timer");
// let timerOb$ = interval(1000);
// timerOb$.subscribe(() => {
//   datum = add(datum,{seconds:1});
//   timer.innerHTML = datum.getMinutes() + " : " + datum.getSeconds();
// });

// let button = document.body.querySelector("button");
// let buttonOb$ = fromEvent(button, "click");



initLogic();