import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  createTournament,
  getTournaments,
  updateTournamentMatch,
  completeTournament
} from "@/lib/services/tournament-service"
import type { Tournament } from "@/types/tournament"

export function useTournament() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadTournaments()
    }
  }, [user])

  const loadTournaments = async () => {
    try {
      const data = await getTournaments()
      setTournaments(data.map(t => ({
        ...t,
        finalMatch: t.rounds[t.rounds.length - 1].matches[0]
      })))
    } catch (error) {
      console.error("Error loading tournaments:", error)
      toast({
        title: "Error",
        description: "Failed to load tournaments",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTournament = async (tournament: Tournament) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create tournaments",
        variant: "destructive"
      })
      return
    }

    try {
      await createTournament(tournament, user.id)
      await loadTournaments()
      toast({
        title: "Success",
        description: "Tournament created successfully"
      })
    } catch (error) {
      console.error("Error creating tournament:", error)
      toast({
        title: "Error",
        description: "Failed to create tournament",
        variant: "destructive"
      })
    }
  }

  const updateMatch = async (
    tournamentId: string,
    matchId: string,
    scores: [number, number],
    winnerId: string
  ) => {
    try {
      await updateTournamentMatch(tournamentId, matchId, scores, winnerId)
      await loadTournaments()
    } catch (error) {
      console.error("Error updating match:", error)
      toast({
        title: "Error",
        description: "Failed to update match",
        variant: "destructive"
      })
    }
  }

  const finishTournament = async (tournamentId: string, winnerId: string) => {
    try {
      await completeTournament(tournamentId, winnerId)
      await loadTournaments()
      toast({
        title: "Tournament Complete",
        description: "Tournament has been completed successfully"
      })
    } catch (error) {
      console.error("Error completing tournament:", error)
      toast({
        title: "Error",
        description: "Failed to complete tournament",
        variant: "destructive"
      })
    }
  }

  return {
    tournaments,
    isLoading,
    addTournament,
    updateMatch,
    finishTournament,
    refreshTournaments: loadTournaments
  }
}