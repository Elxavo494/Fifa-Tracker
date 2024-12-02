import { supabase } from "@/lib/supabase"
import type { Match, User, Team } from "@/types"

function mapProfileToUser(profile: any): User {
  return {
    id: profile.id,
    name: profile.username || "Unknown User",
    avatarUrl: profile.avatar_url
  }
}

export async function createMatch(match: Match, userId: string) {
  const { data: matchData, error: matchError } = await supabase
    .from("matches")
    .insert({
      id: match.id,
      date: match.date,
      team1_score: match.team1.score,
      team2_score: match.team2.score,
      user_id: userId
    })
    .select()
    .single()

  if (matchError) throw matchError

  // Insert players for team 1
  const team1Players = match.team1.players.map(player => ({
    match_id: match.id,
    player_id: player.id,
    team: 1
  }))

  // Insert players for team 2
  const team2Players = match.team2.players.map(player => ({
    match_id: match.id,
    player_id: player.id,
    team: 2
  }))

  const { error: playersError } = await supabase
    .from("match_players")
    .insert([...team1Players, ...team2Players])

  if (playersError) {
    // Rollback match creation if player insertion fails
    await supabase.from("matches").delete().eq("id", match.id)
    throw playersError
  }
}

export async function createDummyMatches(matches: Match[], userId: string) {
  for (const match of matches) {
    await createMatch(match, userId)
  }
}

async function getMatchTeam(matchId: string, teamNumber: number): Promise<Team> {
  const { data: players, error } = await supabase
    .from("match_players")
    .select(`
      player:profiles(*)
    `)
    .eq("match_id", matchId)
    .eq("team", teamNumber)

  if (error) throw error

  return {
    players: players.map(p => mapProfileToUser(p.player)),
    score: 0 // Will be updated with match data
  }
}

export async function getMatches() {
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .order("date", { ascending: false })

  if (matchesError) throw matchesError
  if (!matches) return []

  const formattedMatches = await Promise.all(
    matches.map(async match => {
      const team1 = await getMatchTeam(match.id, 1)
      const team2 = await getMatchTeam(match.id, 2)

      return {
        id: match.id,
        date: match.date,
        team1: { ...team1, score: match.team1_score },
        team2: { ...team2, score: match.team2_score }
      }
    })
  )

  return formattedMatches
}

export async function getMatchesByUserId(userId: string) {
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select(`
      *,
      match_players!inner(
        player_id
      )
    `)
    .eq("match_players.player_id", userId)
    .order("date", { ascending: false })

  if (matchesError) throw matchesError
  if (!matches) return []

  const formattedMatches = await Promise.all(
    matches.map(async match => {
      const team1 = await getMatchTeam(match.id, 1)
      const team2 = await getMatchTeam(match.id, 2)

      return {
        id: match.id,
        date: match.date,
        team1: { ...team1, score: match.team1_score },
        team2: { ...team2, score: match.team2_score }
      }
    })
  )

  return formattedMatches
}