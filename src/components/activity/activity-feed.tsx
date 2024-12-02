import { Trophy, Users, Star, Crown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { scaleIn } from '@/lib/animations'
import { ACHIEVEMENTS } from '@/lib/constants/achievements'
import type { Match } from '@/types'
import type { PlayerAchievement } from '@/types/achievement'
import type { Tournament } from '@/types/tournament'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface ActivityItem {
  id: string
  type: 'match' | 'achievement' | 'tournament'
  timestamp: Date
  data: Match | PlayerAchievement | Tournament
}

interface ActivityFeedProps {
  matches: Match[]
  achievements: PlayerAchievement[]
  tournaments: Tournament[]
  className?: string
}

export function ActivityFeed({ matches, achievements, tournaments, className }: ActivityFeedProps) {
  // Combine and sort all activities by date
  const activities: ActivityItem[] = [
    ...matches.map(match => ({
      id: match.id,
      type: 'match' as const,
      timestamp: new Date(match.date),
      data: match
    })),
    ...achievements.map(achievement => ({
      id: achievement.id,
      type: 'achievement' as const,
      timestamp: new Date(achievement.unlocked_at),
      data: achievement
    })),
    ...tournaments.map(tournament => ({
      id: tournament.id,
      type: 'tournament' as const,
      timestamp: new Date(tournament.created_at),
      data: tournament
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  .slice(0, 10) // Show only last 10 activities

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'match':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 'tournament':
        return <Crown className="h-5 w-5 text-purple-500" />
    }
  }

  const getActivityContent = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'match': {
        const match = activity.data as Match
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {match.team1.players.map((player) => (
                    <Avatar key={player.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={player.avatarUrl || ""} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="hidden md:block">
                  {match.team1.players.map(p => p.name).join(" & ")}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">vs</span>
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {match.team2.players.map((player) => (
                    <Avatar key={player.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={player.avatarUrl || ""} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="hidden md:block">
                  {match.team2.players.map(p => p.name).join(" & ")}
                </span>
              </div>
            </div>
          </div>
        )
      }
      case 'tournament':
        const tournament = activity.data as Tournament
        return (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              New tournament started: <span className="font-medium text-foreground">{tournament.name}</span>
            </p>
            <div className="flex">
              {tournament.rounds[0].matches.flatMap(match => match.players)
                .filter((player): player is NonNullable<typeof player> => player !== null)
                .slice(0, 6)
                .map((player, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={player.avatarUrl || ""} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              {tournament.rounds[0].matches.flatMap(match => match.players).length > 6 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border-2 border-background">
                  <span className="text-[10px] text-muted-foreground">
                    +{tournament.rounds[0].matches.flatMap(match => match.players).length - 6}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      case 'achievement': {
        const playerAchievement = activity.data as PlayerAchievement
        const achievementDetails = ACHIEVEMENTS.find(a => a.id === playerAchievement.achievement_id)
        
        if (!achievementDetails) return null

        const rarityTextColors = {
          common: 'text-gray-500',
          rare: 'text-blue-500',
          epic: 'text-purple-500',
          legendary: 'text-yellow-500'
        };

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {playerAchievement.profiles && (
                <div className="flex items-center justify-center gap-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={playerAchievement.profiles.avatar_url || ""} />
                    <AvatarFallback>{playerAchievement.profiles.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{playerAchievement.profiles.username}</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">unlocked</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl">{achievementDetails.icon}</span>
                <span className={cn("font-medium", rarityTextColors[achievementDetails.rarity])}>
                  {achievementDetails.name}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {achievementDetails.description}
            </p>
          </div>
        )
      }
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border bg-card/50 transition-all hover:opacity-100",
                scaleIn
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                transform: 'translateY(0)'
              }}
            >
              {getActivityIcon(activity.type)}
              <div className="flex-1 space-y-1">
                {getActivityContent(activity)}
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 