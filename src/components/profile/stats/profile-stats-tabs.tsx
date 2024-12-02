import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ProfileStats } from "../profile-stats"
import { calculateWeeklyStats } from "@/lib/utils/stats"
import type { Match } from "@/types"
import { Flame, TrendingUp } from "lucide-react"
import { calculateStreaks } from "@/lib/utils/stats"
import { cn } from "@/lib/utils"

interface ProfileStatsTabsProps {
  stats: {
    matches: number
    wins: number
    losses: number
    draws: number
    goalsScored: number
    goalsConceded: number
  }
  matches: Match[]
  userId: string
}

export function ProfileStatsTabs({ stats, matches, userId }: ProfileStatsTabsProps) {
  const weeklyStats = calculateWeeklyStats(matches, [{
    id: userId,
    name: "",
    avatarUrl: null
  }])[0]

  const streakStats = calculateStreaks(matches, userId)

  return (
    <Tabs defaultValue="all-time" className="space-y-2">
      <TabsList className="grid w-full grid-cols-2">
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

      <TabsContent value="all-time" className="grid grid-cols-2 gap-2">
        <ProfileStats
          title="Total Matches"
          value={stats.matches}
          icon="Users"
        />
        <ProfileStats
          title="Win Rate"
          value={stats.matches ? Math.round((stats.wins / stats.matches) * 100) : 0}
          suffix="%"
          icon="Trophy"
          trend={stats.wins ? "up" : "neutral"}
        />
        <ProfileStats
          title="Total Wins"
          value={stats.wins}
          icon="ArrowUp"
          className="text-green-500"
        />
        <ProfileStats
          title="Total Losses"
          value={stats.losses}
          icon="ArrowDown"
          className="text-red-500"
        />
        <ProfileStats
          title="Goals Scored"
          value={stats.goalsScored}
          icon="ArrowUp"
          className="text-green-500"
        />
        <ProfileStats
          title="Goals Conceded"
          value={stats.goalsConceded}
          icon="ArrowDown"
          className="text-red-500"
        />
        <ProfileStats
          title="Current Streak"
          value={streakStats.currentStreak}
          icon="Flame"
          trend={streakStats.currentType === 'win' ? "up" : "down"}
          className={cn(
            streakStats.currentType === 'win' && "text-green-500",
            streakStats.currentType === 'loss' && "text-red-500"
          )}
          suffix={streakStats.currentType === 'win' ? ' Wins' : ' Losses'}
        />
        <ProfileStats
          title="Best Win Streak"
          value={streakStats.bestWinStreak}
          icon="Trophy"
          trend="up"
          className="text-green-500"
          suffix=" Wins"
        />
      </TabsContent>

      <TabsContent value="weekly" className="grid grid-cols-2 gap-2">
        <ProfileStats
          title="Weekly Matches"
          value={weeklyStats.matches}
          icon="Users"
        />
        <ProfileStats
          title="Weekly Win Rate"
          value={weeklyStats.matches ? Math.round((weeklyStats.wins / weeklyStats.matches) * 100) : 0}
          suffix="%"
          icon="Trophy"
          trend={weeklyStats.wins ? "up" : "neutral"}
        />
        <ProfileStats
          title="Weekly Wins"
          value={weeklyStats.wins}
          icon="ArrowUp"
          className="text-green-500"
        />
        <ProfileStats
          title="Weekly Losses"
          value={weeklyStats.losses}
          icon="ArrowDown"
          className="text-red-500"
        />
        <ProfileStats
          title="Weekly Goals Scored"
          value={weeklyStats.goalsScored}
          icon="ArrowUp"
          className="text-green-500"
        />
        <ProfileStats
          title="Weekly Goals Conceded"
          value={weeklyStats.goalsConceded}
          icon="ArrowDown"
          className="text-red-500"
        />
        <ProfileStats
          title="Current Streak"
          value={streakStats.currentStreak}
          icon="Flame"
          trend={streakStats.currentType === 'win' ? "up" : "down"}
          className={cn(
            streakStats.currentType === 'win' && "text-green-500",
            streakStats.currentType === 'loss' && "text-red-500"
          )}
          suffix={streakStats.currentType === 'win' ? ' Wins' : ' Losses'}
        />
        <ProfileStats
          title="Best Win Streak"
          value={streakStats.bestWinStreak}
          icon="Trophy"
          trend="up"
          className="text-green-500"
          suffix=" Wins"
        />
      </TabsContent>
    </Tabs>
  )
}