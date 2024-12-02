import { subDays, addHours } from "date-fns"
import type { Match, User } from "@/types"

function getRandomScore(): number {
  // Weight towards more common football scores
  const scores = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5]
  return scores[Math.floor(Math.random() * scores.length)]
}

function getRandomPlayers(players: User[], exclude: string[] = []): [User, User] {
  const available = players.filter(p => !exclude.includes(p.id))
  const idx1 = Math.floor(Math.random() * available.length)
  const player1 = available[idx1]
  const remaining = available.filter(p => p.id !== player1.id)
  const idx2 = Math.floor(Math.random() * remaining.length)
  const player2 = remaining[idx2]
  return [player1, player2]
}

export function generateDummyMatches(players: User[], days: number = 30): Match[] {
  if (players.length < 4) {
    throw new Error("Need at least 4 players to generate matches")
  }

  const matches: Match[] = []
  const now = new Date()
  
  // Generate 2-4 matches per day
  for (let i = days; i >= 0; i--) {
    const matchesForDay = Math.floor(Math.random() * 3) + 2 // 2-4 matches
    const baseDate = subDays(now, i)
    
    for (let j = 0; j < matchesForDay; j++) {
      // Spread matches throughout the day (9am - 11pm)
      const hours = 9 + Math.floor(Math.random() * 14)
      const date = addHours(baseDate, hours)
      
      // Get random players for each team
      const [team1Player1, team1Player2] = getRandomPlayers(players)
      const [team2Player1, team2Player2] = getRandomPlayers(
        players, 
        [team1Player1.id, team1Player2.id]
      )

      const team1Score = getRandomScore()
      const team2Score = getRandomScore()

      matches.push({
        id: crypto.randomUUID(),
        date: date.toISOString(),
        team1: {
          players: [team1Player1, team1Player2],
          score: team1Score
        },
        team2: {
          players: [team2Player1, team2Player2],
          score: team2Score
        }
      })
    }
  }

  return matches.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}