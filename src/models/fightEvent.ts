import { Corner } from "../enums/corner.enum";
import {
    FightEventType,
    GettingUpType,
    GroundAndPoundType,
    KickType,
    PunchType,
    SubmissionType,
    TakedownType,
} from "../enums/fight-event-type.enum";

export class FightEvent {
    attacker: Corner;
    defender: Corner;
    type: FightEventType;
    subType?:
        | PunchType
        | KickType
        | TakedownType
        | SubmissionType
        | GroundAndPoundType
        | GettingUpType;
    damage: number;
    energySpent: number;
}
