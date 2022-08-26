import { from, fromEvent, map, Observable, switchMap } from "rxjs";
import { consts } from "../constants";
import { Opponent } from "../models/opponent";

export function findOppponent(
    buttonOpponent: HTMLButtonElement,
): Observable<Opponent> {
    return fromEvent(buttonOpponent, "click").pipe(
        switchMap(() =>
            getOpponent()
        ),
    );
}

export function getOpponent(): Observable<Opponent>{
    let id = Math.round(Math.random()*5 + 1);
    return from(
        fetch(`${consts.API_URL}/opponents/?id=${id}`)
          .then((res) => {
            if (res.ok){
                return res.json();
            }
            else
                throw new Error("Fetch error");
          })
    );
}