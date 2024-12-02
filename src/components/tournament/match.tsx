import { useState } from "react"
import { Check, Crown, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateTournamentMatch } from "@/lib/services/tournament-service"
import type { TournamentMatch } from "@/types/tournament"

interface MatchProps {
  match: TournamentMatch
  tournamentId: string // Add tournament ID prop
  onScoreSubmit?: (matchId: string, scores: [number, number]) => void
  isFinal?: boolean
}

export function Match({ match, tournamentId, onScoreSubmit, isFinal }: MatchProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scores, setScores] = useState<[string, string]>(
    match.scores ? [match.scores[0].toString(), match.scores[1].toString()] : ["", ""]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericScores: [number, number] = [parseInt(scores[0]), parseInt(scores[1])]
    
    if (isNaN(numericScores[0]) || isNaN(numericScores[1])) return
    
    try {
      setIsSubmitting(true)
      // Determine winner based on scores
      const winnerId = numericScores[0] > numericScores[1] 
        ? match.players[0]?.id 
        : match.players[1]?.id

      if (!winnerId) throw new Error("No winner could be determined")

      // Update score in database
      await updateTournamentMatch(
        tournamentId,
        match.id,
        numericScores,
        winnerId
      )

      // Update local state through parent component
      if (onScoreSubmit) {
        onScoreSubmit(match.id, numericScores)
      }
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating match score:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Only allow score input if both players are present
  const canEnterScore = match.players[0] && match.players[1]
  const hasWinner = match.winner !== undefined

  return (
    <div className={cn(
      "w-full md:w-[250px] rounded-lg border bg-background p-4 transition-shadow",
      canEnterScore && "hover:shadow-md",
      isFinal && hasWinner && "bg-gradient-to-br from-yellow-500/10 via-background to-background border-yellow-500/50",
    )}>
      <form onSubmit={handleSubmit} className="space-y-2">
        {match.players.map((player, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-2 rounded transition-colors",
              match.winner === index && "bg-primary/10"
            )}
          >
            {player ? (
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatarUrl || ""} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                {isFinal && match.winner === index && (
                  <Crown className="absolute -top-2 -right-2 h-4 w-4 text-yellow-500" />
                )}
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">TBD</span>
              </div>
            )}
            
            <span className="font-medium flex-1">{player?.name || "TBD"}</span>
            
            {player && (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="number"
                    min="0"
                    value={scores[index]}
                    onChange={(e) => {
                      const newScores = [...scores] as [string, string]
                      newScores[index] = e.target.value
                      setScores(newScores)
                    }}
                    className="w-16 h-8"
                  />
                ) : (
                  <span className={cn(
                    "text-sm w-8 text-center",
                    match.winner === index ? "text-green-500 font-medium" : "text-muted-foreground"
                  )}>
                    {match.scores?.[index] ?? "-"}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {canEnterScore && (
          <div className="flex justify-end gap-2 mt-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                {match.scores ? "Edit Score" : "Enter Score"}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}