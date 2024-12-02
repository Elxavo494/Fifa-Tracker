import type { Tournament, TournamentMatch } from "@/types/tournament"

function findMatchById(tournament: Tournament, matchId: string): TournamentMatch | null {
  for (const round of tournament.rounds) {
    const match = round.matches.find(m => m.id === matchId)
    if (match) return match
  }
  return null
}

function findNextMatch(tournament: Tournament, currentRoundIndex: number, matchIndex: number): TournamentMatch | null {
  if (currentRoundIndex >= tournament.rounds.length - 1) return null
  
  const nextRoundIndex = currentRoundIndex + 1
  const nextMatchIndex = Math.floor(matchIndex / 2)
  return tournament.rounds[nextRoundIndex].matches[nextMatchIndex]
}

function determineWinner(scores: [number, number]): number {
  return scores[0] > scores[1] ? 0 : 1
}

export async function updateMatchScore(
  tournament: Tournament,
  matchId: string,
  scores: [number, number]
): Promise<Tournament> {
  const updatedTournament = JSON.parse(JSON.stringify(tournament)) as Tournament
  
  // Find the current match and its position
  let currentMatch: TournamentMatch | null = null
  let currentRoundIndex = -1
  let currentMatchIndex = -1

  for (let i = 0; i < updatedTournament.rounds.length; i++) {
    const matchIndex = updatedTournament.rounds[i].matches.findIndex(m => m.id === matchId)
    if (matchIndex !== -1) {
      currentMatch = updatedTournament.rounds[i].matches[matchIndex]
      currentRoundIndex = i
      currentMatchIndex = matchIndex
      break
    }
  }

  if (!currentMatch) return tournament

  // Update the current match
  currentMatch.scores = scores
  currentMatch.winner = determineWinner(scores)

  // Find and update the next match if it exists
  const nextMatch = findNextMatch(updatedTournament, currentRoundIndex, currentMatchIndex)
  if (nextMatch) {
    const winningPlayer = currentMatch.players[currentMatch.winner]
    const nextMatchPlayerIndex = currentMatchIndex % 2 === 0 ? 0 : 1
    nextMatch.players = [...nextMatch.players] as [typeof winningPlayer, typeof winningPlayer]
    nextMatch.players[nextMatchPlayerIndex] = winningPlayer
  }

  return updatedTournament
}