export interface User {
  id: string
  name: string
  avatarUrl?: string | null
}

export interface Team {
  players: User[]
  score: number
}

export interface Match {
  id: string
  date: string
  team1: Team
  team2: Team
}

export interface PlayerStats {
  id: string
  name: string
  avatarUrl?: string | null
  matches: number
  wins: number
  draws: number
  losses: number
  points: number
  goalsScored: number
  goalsConceded: number
  tournamentsWon: number
  winStreak: number
  maxWinStreak: number
  cleanSheets: number
  highestGoalsInMatch: number
  gamesPlayed: number
  lowScoringWins: number
  perfectMonthAchieved: boolean;
  consecutiveScoringGames: number;
  highestGoalDifference: number;
}