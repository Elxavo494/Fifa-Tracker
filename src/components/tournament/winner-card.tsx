import { Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { slideIn } from "@/lib/animations"
import type { TournamentMatch } from "@/types/tournament"

interface WinnerCardProps {
  match: TournamentMatch
}

export function WinnerCard({ match }: WinnerCardProps) {
  if (match.winner === undefined) return null

  const winner = match.players[match.winner]
  if (!winner) return null

  const loser = match.players[match.winner === 0 ? 1 : 0]
  const score = match.scores

  return (
    <div className={cn(
      "bg-gradient-to-br from-yellow-500/10 via-background to-background rounded-lg border p-8",
      slideIn("down")
    )}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
          <Avatar className="h-24 w-24 ring-4 ring-yellow-500/50 transition-transform hover:scale-105">
            <AvatarImage src={winner.avatarUrl || ""} />
            <AvatarFallback className="text-2xl">{winner.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-1.5">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
            {winner.name}
          </h3>
          <p className="text-muted-foreground">Tournament Winner</p>
        </div>

        {score && loser && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Final Score:</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-medium",
                match.winner === 0 && "text-green-500"
              )}>
                {score[0]}
              </span>
              <span>-</span>
              <span className={cn(
                "font-medium",
                match.winner === 1 && "text-green-500"
              )}>
                {score[1]}
              </span>
            </div>
            <span>vs {loser.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}