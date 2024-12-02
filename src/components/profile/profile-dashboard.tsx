import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { ProfileHeader } from './profile-header';
import { MatchGraph } from './match-graph';
import { ProfileAvatar } from './profile-avatar';
import { ProfileStatsTabs } from './stats/profile-stats-tabs';
import { useProfile } from '@/hooks/use-profile';
import { useMatches } from '@/hooks/use-matches';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import type { PlayerStats, Match } from '@/types';
import { AchievementsCard } from './achievements-card';
import { useAchievements } from '@/hooks/use-achievements';
import { supabase } from '@/lib/supabase';

interface ProfileDashboardProps {
  onBack: () => void;
  onTournamentClick: () => void;
}

export function ProfileDashboard({ onBack, onTournamentClick }: ProfileDashboardProps) {
  const { profile, isLoading: profileLoading } = useProfile();
  const { matches, isLoading: matchesLoading } = useMatches(profile?.id);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const { signOut } = useAuth();
  const { user } = useAuth();
  const { achievements, validateAchievements } = useAchievements(user?.id || "", stats);

  useEffect(() => {
    if (profile && matches.length > 0) {
      calculateStats(matches);
    }
  }, [profile, matches]);

  useEffect(() => {
    if (stats) {
      validateAchievements(stats);
    }
  }, [stats, validateAchievements]);

  const calculateStats = async (matches: Match[]) => {
    if (!profile) return;

    // Get tournaments won by the player
    const { data: tournamentsWon } = await supabase
      .from("tournaments")
      .select("id")
      .eq("winner_id", profile.id)
      .eq("status", "completed");

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalGoalsScored = 0;
    let totalGoalsConceded = 0;
    let currentWinStreak = 0;
    let maxWinStreak = 0;
    let highestGoalsInMatch = 0;
    let lowScoringWins = 0;
    let highestGoalDifference = 0;

    // Sort matches by date in ascending order to properly calculate streaks
    const sortedMatches = [...matches].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedMatches.forEach((match) => {
      const isTeam1 = match.team1.players.some((p: { id: string }) => p.id === profile.id);
      const myTeam = isTeam1 ? match.team1 : match.team2;
      const opposingTeam = isTeam1 ? match.team2 : match.team1;

      // Track goals
      totalGoalsScored += myTeam.score;
      totalGoalsConceded += opposingTeam.score;

      // Track highest goals in a single match
      if (myTeam.score > highestGoalsInMatch) {
        highestGoalsInMatch = myTeam.score;
      }

      // Track match result
      if (myTeam.score > opposingTeam.score) {
        wins++;
        currentWinStreak++;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        
        // Track low scoring wins (2 or fewer goals conceded)
        if (opposingTeam.score <= 2) {
          lowScoringWins++;
        }
      } else {
        currentWinStreak = 0;
        if (myTeam.score < opposingTeam.score) losses++;
        else draws++;
      }

      const goalDifference = myTeam.score - opposingTeam.score;
      if (goalDifference > highestGoalDifference) {
        highestGoalDifference = goalDifference;
      }
    });

    // Calculate consecutive scoring games
    let currentScoringStreak = 0;
    let maxScoringStreak = 0;
    
    // Sort matches by date ascending for proper streak calculation
    sortedMatches.forEach(match => {
      const isTeam1 = match.team1.players.some((p: { id: string }) => p.id === profile.id)
      const myTeam = isTeam1 ? match.team1 : match.team2;
      
      if (myTeam.score > 0) {
        currentScoringStreak++;
        maxScoringStreak = Math.max(maxScoringStreak, currentScoringStreak);
      } else {
        currentScoringStreak = 0;
      }
    });

    // Calculate perfect month
    const monthlyMatches = new Map<string, { wins: number; total: number }>();
    
    sortedMatches.forEach(match => {
      const monthKey = new Date(match.date).toISOString().slice(0, 7); // YYYY-MM format
      const isTeam1 = match.team1.players.some(p => p.id === profile.id);
      const myTeam = isTeam1 ? match.team1 : match.team2;
      const opposingTeam = isTeam1 ? match.team2 : match.team1;
      
      const monthStats = monthlyMatches.get(monthKey) || { wins: 0, total: 0 };
      monthStats.total++;
      
      if (myTeam.score > opposingTeam.score) {
        monthStats.wins++;
      }
      
      monthlyMatches.set(monthKey, monthStats);
    });

    // Check if any month had all wins (minimum 10 matches)
    const hasPerfectMonth = Array.from(monthlyMatches.values()).some(
      stats => stats.total >= 10 && stats.wins === stats.total
    );

    setStats({
      id: profile.id,
      name: profile.username || '',
      avatarUrl: profile.avatar_url,
      matches: matches.length,
      wins,
      draws,
      losses,
      points: wins * 3 + draws,
      goalsScored: totalGoalsScored,
      goalsConceded: totalGoalsConceded,
      tournamentsWon: tournamentsWon?.length || 0,
      winStreak: currentWinStreak,
      maxWinStreak: maxWinStreak,
      cleanSheets: matches.filter(match => {
        const isTeam1 = match.team1.players.some(p => p.id === profile.id);
        const opposingTeam = isTeam1 ? match.team2 : match.team1;
        return opposingTeam.score === 0;
      }).length,
      highestGoalsInMatch,
      gamesPlayed: matches.length,
      lowScoringWins,
      consecutiveScoringGames: maxScoringStreak,
      perfectMonthAchieved: hasPerfectMonth,
      highestGoalDifference,
    });
  };

  if (profileLoading || matchesLoading || !profile || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileHeader 
        onBack={onBack} 
        onProfileClick={() => {}} 
        onTournamentClick={onTournamentClick} 
      />
      <div className="container mx-auto max-w-8xl py-8 px-4 pt-24">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="space-y-3 md:col-span-2">
              <ProfileAvatar />
              
              {stats && (
                <ProfileStatsTabs
                  stats={stats}
                  matches={matches}
                  userId={profile?.id}
                />
              )}
            </div>

            <div className="space-y-3 md:col-span-3">
              <div className="rounded-lg border bg-card p-6 h-full ">
                <h3 className="font-semibold mb-4">Match History</h3>
                <MatchGraph matches={matches} userId={profile?.id} />
              </div>
            </div>
          </div>

          <AchievementsCard achievements={achievements} />
          
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Need to leave? You can always come back later
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}