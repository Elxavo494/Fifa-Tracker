import { Match } from './match';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Goal, TrendingUp } from 'lucide-react';
import { updateMatchScore } from '@/lib/tournament/tournament-service';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/animations';
import type { Tournament } from '@/types/tournament';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TournamentBracketProps {
  tournament: Tournament;
  onTournamentUpdate: (tournament: Tournament) => void;
  onFinalize?: (winnerId: string) => void;
  onBack: () => void;
}

export function TournamentBracket({
  tournament,
  onTournamentUpdate,
  onFinalize,
  onBack,
}: TournamentBracketProps) {
  const handleScoreSubmit = async (
    matchId: string,
    scores: [number, number]
  ) => {
    const updatedTournament = await updateMatchScore(
      tournament,
      matchId,
      scores
    );
    onTournamentUpdate(updatedTournament);
  };

  // Get the final match
  const finalRound = tournament.rounds[tournament.rounds.length - 1];
  const finalMatch = finalRound?.matches[0];
  const canFinalize =
    finalMatch?.winner !== undefined && tournament.status !== 'completed';

  // Get the winner if available
  const winner =
    finalMatch?.winner !== undefined
      ? finalMatch.players[finalMatch.winner]
      : null;

  function calculateTournamentStats(tournament: Tournament) {
    let totalMatches = 0;
    let completedMatches = 0;
    let totalGoals = 0;

    tournament.rounds.forEach(round => {
      round.matches.forEach(match => {
        totalMatches++;
        if (match.scores) {
          completedMatches++;
          totalGoals += match.scores[0] + match.scores[1];
        }
      });
    });

    return {
      totalMatches,
      completedMatches,
      totalGoals,
      averageGoals: completedMatches > 0 ? (totalGoals / completedMatches).toFixed(1) : '0'
    };
  }

  const stats = calculateTournamentStats(tournament);

  return (
    <div className="space-y-2">
      <div className={cn(
        'space-y-6 bg-card rounded-lg border p-6 pb-20',
        'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)]',
        'bg-[size:24px_24px]',
        'border-border',
        fadeIn
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-8 w-8" />
              Back
            </Button>
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Tournament Bracket</h2>
          </div>
          {canFinalize && winner && (
            <Button onClick={() => onFinalize?.(winner.id)} className="gap-2">
              <Trophy className="h-8 w-8" />
              Finalize Tournament
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {tournament.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="relative">
              <div className="text-sm font-medium text-muted-foreground mb-4 text-center">
                {roundIndex === tournament.rounds.length - 1
                  ? 'Final'
                  : roundIndex === tournament.rounds.length - 2
                  ? 'Semi Finals'
                  : roundIndex === tournament.rounds.length - 3
                  ? 'Quarter Finals'
                  : `Round ${roundIndex + 1}`}
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                {round.matches.map((match) => (
                  <div key={match.id} className="relative">
                    <Match
                      match={match}
                      tournamentId={tournament.id}
                      onScoreSubmit={handleScoreSubmit}
                      isFinal={roundIndex === tournament.rounds.length - 1}
                    />
                    {/* Draw connection lines */}
                    {roundIndex < tournament.rounds.length - 1 && (
                      <>
                        <div className="absolute left-1/2 top-full h-16 border-l border-border" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedMatches} / {stats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.completedMatches / stats.totalMatches) * 100).toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Goal className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              Across all matches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Goals per Match</CardTitle>
            <TrendingUp className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGoals}</div>
            <p className="text-xs text-muted-foreground">
              In completed matches
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}