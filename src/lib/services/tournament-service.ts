import { supabase } from "@/lib/supabase"
import type { Tournament, TournamentMatch } from "@/types/tournament"
import type { User } from "@/types"

export async function createTournament(
  tournament: Tournament,
  userId: string
): Promise<void> {
  const { error: tournamentError } = await supabase
    .from("tournaments")
    .insert({
      id: tournament.id,
      name: "Tournament",
      player_count: tournament.rounds[0].matches.length * 2,
      status: "ongoing",
      user_id: userId,
      updated_at: new Date().toISOString()
    })

  if (tournamentError) throw tournamentError

  // Flatten all matches from all rounds
  const allMatches = tournament.rounds.flatMap((round, roundIndex) =>
    round.matches.map((match) => ({
      id: match.id,
      tournament_id: tournament.id,
      round: roundIndex + 1,
      match_number: round.matches.indexOf(match) + 1,
      player1_id: match.players[0]?.id,
      player2_id: match.players[1]?.id,
      next_match_id: match.nextMatchId,
      updated_at: new Date().toISOString()
    }))
  )

  const { error: matchesError } = await supabase
    .from("tournament_matches")
    .insert(allMatches)

  if (matchesError) {
    // Rollback tournament creation
    await supabase
      .from("tournaments")
      .delete()
      .eq("id", tournament.id)
    throw matchesError
  }
}

export async function updateTournamentMatch(
  tournamentId: string,
  matchId: string,
  scores: [number, number],
  winnerId: string
): Promise<void> {
  // First, update the current match with scores and winner
  const { error } = await supabase
    .from("tournament_matches")
    .update({
      player1_score: scores[0],
      player2_score: scores[1],
      winner_id: winnerId,
      updated_at: new Date().toISOString()
    })
    .eq("tournament_id", tournamentId)
    .eq("id", matchId)

  if (error) throw error

  // Get the current match information including the next match ID
  const { data: currentMatch } = await supabase
    .from("tournament_matches")
    .select(`
      id,
      round,
      match_number,
      player1_id,
      player2_id,
      winner_id
    `)
    .eq("id", matchId)
    .single()

  if (!currentMatch) return

  // Find the next match in the next round
  const { data: nextMatch } = await supabase
    .from("tournament_matches")
    .select("id, player1_id, player2_id")
    .eq("tournament_id", tournamentId)
    .eq("round", currentMatch.round + 1)
    .eq("match_number", Math.ceil(currentMatch.match_number / 2))
    .single()

  if (!nextMatch) return

  // First, update the current match with the next_match_id
  const { error: updateNextMatchIdError } = await supabase
    .from("tournament_matches")
    .update({ next_match_id: nextMatch.id })
    .eq("id", matchId)

  if (updateNextMatchIdError) throw updateNextMatchIdError

  // Then update the next match with the winning player
  const isEvenMatch = currentMatch.match_number % 2 === 0
  const updates = {
    ...(isEvenMatch ? { player1_id: winnerId } : { player2_id: winnerId }),
    updated_at: new Date().toISOString()
  }

  const { error: nextMatchError } = await supabase
    .from("tournament_matches")
    .update(updates)
    .eq("id", nextMatch.id)

  if (nextMatchError) throw nextMatchError
}

export async function completeTournament(
  tournamentId: string,
  winnerId: string
): Promise<void> {
  const { error } = await supabase
    .from("tournaments")
    .update({
      status: "completed",
      winner_id: winnerId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", tournamentId)

  if (error) throw error
}

export async function getTournaments(userId?: string) {
  const query = supabase
    .from("tournaments")
    .select(`
      *,
      winner:winner_id(id, username, avatar_url),
      tournament_matches(
        id,
        round,
        match_number,
        player1:player1_id(id, username, avatar_url),
        player2:player2_id(id, username, avatar_url),
        player1_score,
        player2_score,
        winner:winner_id(id, username, avatar_url),
        next_match_id
      )
    `)
    .order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) throw error
  if (!data) return []

  return data.map(tournament => ({
    id: tournament.id,
    status: tournament.status,
    created_at: tournament.created_at,
    winner: tournament.winner ? {
      id: tournament.winner.id,
      name: tournament.winner.username,
      avatarUrl: tournament.winner.avatar_url
    } : undefined,
    rounds: transformMatchesToRounds(tournament.tournament_matches)
  }))
}

function transformMatchesToRounds(matches: any[]): Tournament["rounds"] {
  const roundsMap = new Map<number, TournamentMatch[]>()

  matches.forEach(match => {
    const tournamentMatch: TournamentMatch = {
      id: match.id,
      players: [
        match.player1 ? {
          id: match.player1.id,
          name: match.player1.username,
          avatarUrl: match.player1.avatar_url
        } : null,
        match.player2 ? {
          id: match.player2.id,
          name: match.player2.username,
          avatarUrl: match.player2.avatar_url
        } : null
      ],
      scores: match.player1_score !== null ? [match.player1_score, match.player2_score] : undefined,
      winner: match.winner ? (match.winner.id === match.player1?.id ? 0 : 1) : undefined,
      nextMatchId: match.next_match_id
    }

    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, [])
    }
    roundsMap.get(match.round)?.push(tournamentMatch)
  })

  return Array.from(roundsMap.values()).map(matches => ({ matches }))
}