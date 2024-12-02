import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthForm } from "@/components/auth-form"
import { ProfilePage } from "@/components/profile-page"
import { MainLayout } from "@/components/layout/main-layout"
import { MatchSection } from "@/components/matches/match-section"
import { StatsSection } from "@/components/stats/stats-section"
import { TournamentPage } from "@/components/tournament/tournament-page"
import { useAuth } from "@/contexts/auth-context"
import { useMatches } from "@/hooks/use-matches"
import { getUsers } from "@/lib/users"
import { calculatePlayerStats } from "@/lib/utils/stats"
import { ActivityFeed } from "@/components/activity/activity-feed"
import { useAchievements } from "@/hooks/use-achievements"
import { useTournament } from "@/hooks/use-tournament"
import type { User } from "@/types"

function MainApp() {
  const [users, setUsers] = useState<User[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [showTournament, setShowTournament] = useState(false)
  const { user } = useAuth()
  const { matches, addMatch } = useMatches()
  const { achievements } = useAchievements(user?.id || "")
  const { tournaments } = useTournament()

  useEffect(() => {
    if (user) {
      getUsers().then(setUsers)
    }
  }, [user])

  if (!user) {
    return <AuthForm />
  }

  if (showProfile) {
    return (
      <ProfilePage 
        onBack={() => setShowProfile(false)} 
        onTournamentClick={() => {
          setShowProfile(false)
          setShowTournament(true)
        }}
      />
    )
  }

  if (showTournament) {
    return (
      <TournamentPage 
        onBack={() => setShowTournament(false)} 
        onProfileClick={() => {
          setShowTournament(false)
          setShowProfile(true)
        }}
      />
    )
  }

  return (
    <MainLayout 
      onProfileClick={() => setShowProfile(true)}
      onTournamentClick={() => setShowTournament(true)}
    >
      <div className="space-y-2">
        <MatchSection
          users={users}
          onAddMatch={addMatch}
        />
        <StatsSection
          matches={matches}
          players={calculatePlayerStats(matches, users)}
        />
        <ActivityFeed 
          matches={matches}
          achievements={achievements}
          tournaments={tournaments}
          className="mt-4"
        />
      </div>
    </MainLayout>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App