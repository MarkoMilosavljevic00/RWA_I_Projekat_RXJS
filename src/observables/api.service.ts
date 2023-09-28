import { from, Observable } from "rxjs";
import { DifficultyLevel } from "../enums/difficulty-level.enum";
import { Rules } from "../enums/rules.enum";
import { Weightclass } from "../enums/weightclass.enum";
import { Fighter } from "../models/fighter";
import { Opponent } from "../models/opponent";
import { API_URL } from "../utilities/environment";

export function getOpponentsObs(difficulty: DifficultyLevel): Observable<Opponent[]> {
    return from(
        fetch(`${API_URL}/opponents/?difficulty=${difficulty}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else throw new Error("Fetch error");
            })
            .catch((err) => console.error(err))
    );
}

export function getFightersByRulesAndWeightclass(rules: Rules,weightclass: Weightclass): Observable<Fighter[]> {
    return from(
        fetch(`${API_URL}/fighters/?weightclass=${weightclass}&rule=${rules}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else throw new Error("Fetch error");
            })
            .catch((err) => console.error(err))
    );
}

export function getFighterById(id: number): Observable<Fighter[]> {
    return from(
        fetch(`${API_URL}/fighters/?id=${id}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else throw new Error("Fetch error");
            })
            .catch((err) => console.error(err))
    );
}

export function getTwoFightersByIds(
    redCornerId : number,
    blueCornerId: number
  ): Observable<Fighter[]> {
    return from(
      fetch(`${API_URL}/fighters/?id=${blueCornerId}&id=${redCornerId}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else throw new Error("Fetch error");
        })
        .catch((err) => console.error(err))
    );
  }
