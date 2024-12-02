import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { createMatch, getMatches, getMatchesByUserId } from "@/lib/services/match-service"
import { useAuth } from "@/contexts/auth-context"
import type { Match } from "@/types"

export function useMatches(userId?: string) {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadMatches()
  }, [userId])

  const loadMatches = async () => {
    try {
      const data = userId ? await getMatchesByUserId(userId) : await getMatches()
      setMatches(data)
    } catch (error) {
      console.error("Error loading matches:", error)
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addMatch = async (match: Match) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add matches",
        variant: "destructive"
      })
      return
    }

    try {
      await createMatch(match, user.id)
      await loadMatches() // Reload matches to ensure consistency
      toast({
        title: "Success",
        description: "Match recorded successfully"
      })
    } catch (error) {
      console.error("Error adding match:", error)
      toast({
        title: "Error",
        description: "Failed to record match",
        variant: "destructive"
      })
    }
  }

  return {
    matches,
    isLoading,
    addMatch,
    refreshMatches: loadMatches
  }
}