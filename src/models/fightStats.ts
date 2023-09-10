export interface FightStats{
    redCorner: FighterStats;
    blueCorner: FighterStats;
}

export interface Scorecard{
    redCorner: FighterRoundStats;
    blueCorner: FighterRoundStats;
}

interface FighterStats{
    damage: number;
    significantStrikes: number;
    takedowns: number;
    submissionAttempts: number;
}

interface FighterRoundStats extends FighterStats{
    roundPoints?: number;
}