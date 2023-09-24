export enum FightEventType {
    Punch = "Punch",
    Kick = "Kick",
    Takedown = "Takedown",
    SubmissionAttempt = "Submission Attempt",
    GettingUp = "Getting Up",
    GroundAndPound = "Ground and Pound",
}

export enum FightEventTypeKey {
    Punch = "PUNCH",
    Kick = "KICK",
    Takedown = "TAKEDOWN",
    SubmissionAttempt = "SUBMISSION_ATTEMPT",
    GettingUp = "GETTING_UP",
    GroundAndPound = "GROUND_AND_POUND",
}

export function mapFightEventTypeToKey(fightEventType: FightEventType): FightEventTypeKey {
    switch (fightEventType) {
        case FightEventType.Punch:
            return FightEventTypeKey.Punch;
        case FightEventType.Kick:
            return FightEventTypeKey.Kick;
        case FightEventType.Takedown:
            return FightEventTypeKey.Takedown;
        case FightEventType.SubmissionAttempt:
            return FightEventTypeKey.SubmissionAttempt;
        case FightEventType.GettingUp:
            return FightEventTypeKey.GettingUp;
        case FightEventType.GroundAndPound:
            return FightEventTypeKey.GroundAndPound;
    }
}


export enum GroundAndPoundType {
    GroundAndPound = "Ground and Pound",
    Hammer = "Hammer Fists",
    Elbow = "Elbow Strikes",
}

export enum PunchType {
    Jab = "Jab",
    Cross = "Cross",
    Swing = "Swing",
    Uppercut = "Uppercut",
    Hook = "Hook",
}

export enum KickType {
    LowKick = "Low Kick",
    RundhouseKick = "Roundhouse Kick",
    PushKick = "Push Kick",
    AxeKick = "Axe Kick",
    CalfKick = "Calf Kick",
    SideKick = "Side Kick",
    SpinningBackKick = "Spinning Back Kick",
}


export enum TakedownType {
    SingleLeg = "Single Leg",
    DoubleLeg = "Double Leg",
    BodyLock = "Body Lock",
    Suplex = "Suplex",
    AnklePick = "Ankle Pick",
}

export enum SubmissionType{
    RearNaked = "Rear-Naked Choke",
    Armbar = "Armbar",
    Triangle = "Triangle Choke",
    Kimura = "Kimura",
    Guillotine = "Guillotine Choke", 
    HeelHook = "Heel Hook",
    Americana = "Americana",
    Kneebar = "Kneebar"
}

export enum GettingUpType{
    GetUp = "Get Up",
    Roll = "Roll",
    WallWalk = "Wall Walk",
    Turtle = "Turtle",
}