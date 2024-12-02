import { isInCurrentWeek } from "./date"
import type { Match, PlayerStats, User } from "@/types"

export function calculatePlayerStats(matches: Match[], users: User[]): PlayerStats[] {
  const stats = new Map<string, PlayerStats>()

  // Initialize stats for all users
  users.forEach((user) => {
    stats.set(user.id, {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      goalsScored: 0,
      goalsConceded: 0,
      cleanSheets: 0
    })
  })

  matches.forEach((match) => {
    const team1Players = match.team1.players
    const team2Players = match.team2.players
    const team1Score = match.team1.score
    const team2Score = match.team2.score

    const updateStats = (playerId: string, result: "win" | "draw" | "loss", goalsFor: number, goalsAgainst: number) => {
      const playerStats = stats.get(playerId)
      if (!playerStats) return

      playerStats.matches++
      playerStats.goalsScored += goalsFor
      playerStats.goalsConceded += goalsAgainst

      if (goalsAgainst === 0) {
        playerStats.cleanSheets++
      }

      if (result === "win") {
        playerStats.wins++
        playerStats.points += 3
      } else if (result === "draw") {
        playerStats.draws++
        playerStats.points += 1
      } else {
        playerStats.losses++
      }
    }

    if (team1Score > team2Score) {
      team1Players.forEach(p => updateStats(p.id, "win", team1Score, team2Score))
      team2Players.forEach(p => updateStats(p.id, "loss", team2Score, team1Score))
    } else if (team2Score > team1Score) {
      team1Players.forEach(p => updateStats(p.id, "loss", team1Score, team2Score))
      team2Players.forEach(p => updateStats(p.id, "win", team2Score, team1Score))
    } else {
      team1Players.forEach(p => updateStats(p.id, "draw", team1Score, team2Score))
      team2Players.forEach(p => updateStats(p.id, "draw", team2Score, team1Score))
    }
  })

  return Array.from(stats.values())
}

export function calculateWeeklyStats(matches: Match[], users: User[]): PlayerStats[] {
  const weeklyMatches = matches.filter(match => isInCurrentWeek(match.date))
  return calculatePlayerStats(weeklyMatches, users)
}

interface StreakStats {
  currentStreak: number
  currentType: 'win' | 'loss' | null
  bestWinStreak: number
  bestLoseStreak: number
}

export function calculateStreaks(matches: Match[], userId: string) {
  // Sort matches by date in ascending order
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let currentStreak = 0
  let bestStreak = 0
  let isWinning = true

  // Iterate through matches in reverse (most recent first)
  for (let i = sortedMatches.length - 1; i >= 0; i--) {
    const match = sortedMatches[i]
    const isTeam1 = match.team1.players.some(p => p.id === userId)
    const myTeam = isTeam1 ? match.team1 : match.team2
    const opposingTeam = isTeam1 ? match.team2 : match.team1
    
    const isWin = myTeam.score > opposingTeam.score
    const isDraw = myTeam.score === opposingTeam.score

    if (isDraw) {
      // A draw breaks the streak
      break
    }

    if (isWin && isWinning) {
      currentStreak++
      bestStreak = Math.max(bestStreak, currentStreak)
    } else if (!isWin && !isWinning) {
      currentStreak++
    } else {
      // Streak broken
      break
    }
  }

  return {
    currentStreak: currentStreak,
    currentType: isWinning ? 'win' : 'loss',
    bestWinStreak: bestStreak,
    bestLoseStreak: bestStreak
  }
}

export function calculateGoalDifferenceTrend(matches: Match[], userId: string) {
  return matches
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(match => {
      const isTeam1 = match.team1.players.some(p => p.id === userId)
      const myTeam = isTeam1 ? match.team1 : match.team2
      const opposingTeam = isTeam1 ? match.team2 : match.team1
      
      return {
        date: match.date,
        difference: myTeam.score - opposingTeam.score
      }
    })
}