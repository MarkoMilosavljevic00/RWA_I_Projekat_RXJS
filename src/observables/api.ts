import { from, Observable } from "rxjs";
import { Weightclass } from "../enums/weightclass.enum";
import { Fighter } from "../models/fighter";
import { API_URL } from "../utilities/environment";

export function getFightersByWeightClass(
    weightClass: Weightclass
  ): Observable<Fighter[]> {
    return from(
      fetch(`${API_URL}/fighters/?weightClass=${weightClass}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else throw new Error("Fetch error");
        })
        .catch((err) => console.error(err))
    );
  }