import { shuffle } from "@/lib/utils"
import type { Tournament, TournamentMatch } from "@/types/tournament"
import type { User } from "@/types"

function generateEmptyMatch(): TournamentMatch {
  return {
    id: crypto.randomUUID(),
    players: [null, null]
  }
}

function calculateRoundCount(playerCount: number): number {
  return Math.ceil(Math.log2(playerCount))
}

function assignPlayersToMatches(matches: TournamentMatch[], players: User[]): void {
  const shuffledPlayers = shuffle([...players])
  let playerIndex = 0

  for (const match of matches) {
    if (playerIndex < shuffledPlayers.length - 1) {
      match.players = [
        shuffledPlayers[playerIndex],
        shuffledPlayers[playerIndex + 1]
      ]
      playerIndex += 2
    } else if (playerIndex === shuffledPlayers.length - 1) {
      // Handle odd number of players with a bye
      match.players = [shuffledPlayers[playerIndex], null]
      match.winner = 0 // Auto-win for single player
      playerIndex++
    }
  }
}

export function generateBracket(players: User[]): Tournament {
  const playerCount = players.length
  const roundCount = calculateRoundCount(playerCount)
  const rounds: TournamentRound[] = []

  // Generate first round with actual players
  const firstRoundMatchCount = Math.ceil(playerCount / 2)
  const firstRoundMatches = Array(firstRoundMatchCount).fill(null).map(generateEmptyMatch)
  assignPlayersToMatches(firstRoundMatches, players)
  rounds.push({ matches: firstRoundMatches })

  // Generate remaining rounds
  for (let i = 1; i < roundCount; i++) {
    const matchCount = Math.pow(2, roundCount - i - 1)
    const matches = Array(matchCount).fill(null).map(generateEmptyMatch)
    rounds.push({ matches })
  }

  return {
    id: crypto.randomUUID(),
    rounds,
    finalMatch: rounds[rounds.length - 1].matches[0]
  }
}