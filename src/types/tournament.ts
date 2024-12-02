import type { User } from "./index"

export interface TournamentMatch {
  id: string
  players: [User | null, User | null]
  scores?: [number, number]
  winner?: number
  nextMatchId?: string
}

export interface TournamentRound {
  matches: TournamentMatch[]
}

export interface Tournament {
  id: string
  status: 'ongoing' | 'completed'
  created_at: string
  name: string
  rounds: TournamentRound[]
  winner?: {
    id: string
    name: string
    avatarUrl?: string
  }
  finalMatch: TournamentMatch
}