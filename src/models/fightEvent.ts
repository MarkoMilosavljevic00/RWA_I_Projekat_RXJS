import { Corner } from "../enums/corner.enum";
import { FightEventType, KickType, PunchType, SubmissionType, TakedownType } from "../enums/fight-event-type.enum";

export class FightEvent<T extends FightEventType>{
    eventType: T;
    eventSubType: T extends FightEventType.Punch ? PunchType 
                : T extends FightEventType.Kick ? KickType
                : T extends FightEventType.Takedown ? TakedownType
                : T extends FightEventType.Submission ? SubmissionType
                : never
    damage: number;
    energySpent: number;
    attacker: Corner;
}