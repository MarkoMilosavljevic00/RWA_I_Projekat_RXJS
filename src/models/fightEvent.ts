import { Corner } from "../enums/corner.enum";
import { FightEventType, KickType, PunchType, SubmissionType, TakedownType } from "../enums/fight-event-type.enum";

export class FightEvent{
    eventType: FightEventType;
    eventSubType: PunchType | KickType | TakedownType | SubmissionType;
    attacker: Corner;
    damage: number;
    energySpent: number;
}