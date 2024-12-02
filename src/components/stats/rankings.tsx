import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RankingsTable } from "./rankings-table"
import type { Match, PlayerStats } from "@/types"
import { calculateWeeklyStats } from "@/lib/utils/stats"

interface RankingsProps {
  matches: Match[]
  players: PlayerStats[]
  onPeriodChange: (period: "all-time" | "weekly") => void
}

export function Rankings({ matches, players: allTimeStats, onPeriodChange }: RankingsProps) {
  const weeklyStats = calculateWeeklyStats(matches, allTimeStats.map(p => ({
    id: p.id,
    name: p.name,
    avatarUrl: p.avatarUrl
  })))

  return (
    <Tabs 
      defaultValue="all-time" 
      className="w-full"
      onValueChange={(value) => onPeriodChange(value as "all-time" | "weekly")}
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger 
          value="all-time"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          All Time
        </TabsTrigger>
        <TabsTrigger 
          value="weekly"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          This Week
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all-time" className="mt-0">
        <RankingsTable players={allTimeStats} />
      </TabsContent>
      <TabsContent value="weekly" className="mt-0">
        <RankingsTable players={weeklyStats} />
      </TabsContent>
    </Tabs>
  )
}