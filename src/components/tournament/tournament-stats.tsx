import { Trophy, Goal, TrendingUp, Users, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Tournament } from "@/types/tournament"
import { cn } from "@/lib/utils"
import { fadeIn } from "@/lib/animations"

interface TournamentStatsProps {
  tournaments: Tournament[]
}

export function TournamentStats({ tournaments }: TournamentStatsProps) {
  const calculateStats = () => {
    let totalMatches = 0
    let totalGoals = 0
    const tournamentWins = new Map<string, number>()
    const tournamentParticipation = new Map<string, number>()

    tournaments.forEach(tournament => {
      // Count tournament wins
      if (tournament.status === "completed" && tournament.winner) {
        tournamentWins.set(
          tournament.winner.id, 
          (tournamentWins.get(tournament.winner.id) || 0) + 1
        )
      }

      // Track tournament participation
      tournament.rounds[0].matches.forEach(match => {
        match.players.forEach(player => {
          if (player) {
            tournamentParticipation.set(
              player.id, 
              (tournamentParticipation.get(player.id) || 0) + 1
            )
          }
        })
      })

      // Count matches and goals
      tournament.rounds.forEach(round => {
        round.matches.forEach(match => {
          if (match.scores) {
            totalMatches++
            totalGoals += match.scores[0] + match.scores[1]
          }
        })
      })
    })

    // Find player with most tournament wins
    let topPlayer = {
      name: "N/A",
      wins: 0,
      matches: 0,
      avatarUrl: ""
    }

    tournamentWins.forEach((wins, playerId) => {
      if (wins > topPlayer.wins) {
        const player = tournaments.find(t => 
          t.winner?.id === playerId
        )?.winner

        if (player) {
          topPlayer = {
            name: player.name,
            wins,
            matches: tournamentParticipation.get(playerId) || 0,
            avatarUrl: player.avatarUrl || ""
          }
        }
      }
    })

    return {
      totalTournaments: tournaments.length,
      completedTournaments: tournaments.filter(t => t.status === "completed").length,
      totalMatches,
      totalGoals,
      averageGoals: totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : "0",
      topPlayer
    }
  }

  const stats = calculateStats()

  return (
    <div className="">
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">

      <Card className="bg-gradient-to-br from-yellow-500/10 via-background to-background border-yellow-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
            <CardTitle className="tracking-tight text-md font-medium font-medium">Most Tournament Wins</CardTitle>
            <Crown className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={stats.topPlayer.avatarUrl} alt={stats.topPlayer.name} />
                <AvatarFallback>{stats.topPlayer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-2xl font-bold">{stats.topPlayer.name}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.topPlayer.wins} tournament wins in {stats.topPlayer.matches} tournaments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
            <CardTitle className="tracking-tight text-md font-medium font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedTournaments} / {stats.totalTournaments}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.completedTournaments / stats.totalTournaments) * 100).toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

       

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
            <CardTitle className="tracking-tight text-md font-medium font-medium">Total Goals</CardTitle>
            <Goal className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              Across all tournament matches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3">
            <CardTitle className="tracking-tight text-md font-medium font-medium">Avg. Goals per Match</CardTitle>
            <TrendingUp className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGoals}</div>
            <p className="text-xs text-muted-foreground">
              In completed matches
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 