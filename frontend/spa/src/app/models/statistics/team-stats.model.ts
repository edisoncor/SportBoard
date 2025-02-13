export type TeamStat =
  | "goalsFor"
  | "goalsAgainst"
  | "goalDifference"
  | "points"
  | "possession"
  | "shotsOnTarget"
  | "passesCompleted"
  | "yellowCards"
  | "redCards"

export interface TeamStats {
  team: string
  logo: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  possession: number
  shotsOnTarget: number
  passesCompleted: number
  yellowCards: number
  redCards: number
}

