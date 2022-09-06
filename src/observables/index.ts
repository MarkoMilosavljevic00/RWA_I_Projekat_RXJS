import { from, fromEvent, map, Observable, switchMap } from "rxjs";
import { API_URL } from "../constants";
import { Opponent } from "../models/opponent";

export function findOppponent(
  buttonOpponent: HTMLButtonElement
){
  return fromEvent(buttonOpponent, "click").pipe(
    switchMap(() => getOpponent()
    ),
    map((opponent) => opponent[0])
  );
}

export function getOpponent(): Observable<Opponent[]> {
  let id = Math.round(Math.random() * 5 + 1);
  return from(
    fetch(`${API_URL}/opponents/?id=${id}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else throw new Error("Fetch error");
    })
    .catch((err) => (console.error(err)))
  );
}

