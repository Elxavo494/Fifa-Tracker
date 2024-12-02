import { Crown, History } from "lucide-react"
import { Rankings } from "./rankings"
import { MatchHistory } from "../matches/match-history"
import type { Match, PlayerStats } from "@/types"
import { useState } from "react"

interface StatsSectionProps {
  matches: Match[]
  players: PlayerStats[]
}

export function StatsSection({ matches, players }: StatsSectionProps) {
  const [rankingPeriod, setRankingPeriod] = useState<"all-time" | "weekly">("all-time")

  return (
    <div className="space-y-6 p-6 rounded-md border bg-card">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <div className="flex gap-1">
            <Crown className="h-5 w-5 text-yellow-500" />
          </div>
          {rankingPeriod === "all-time" ? "All Time Rankings" : "Weekly Rankings"}
        </h2>
        <Rankings 
          matches={matches} 
          players={players} 
          onPeriodChange={setRankingPeriod}
        />
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          Match History
        </h2>
        <MatchHistory matches={matches} />
      </div>
    </div>
  )
}