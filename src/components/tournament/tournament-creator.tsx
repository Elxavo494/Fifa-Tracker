import { useState } from 'react';
import { Flag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlayerSelector } from './player-selector';
import { generateBracket } from '@/lib/tournament/bracket-generator';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/animations';
import type { Tournament } from '@/types/tournament';
import type { User } from '@/types';

interface TournamentCreatorProps {
  onCreateTournament: (tournament: Tournament) => void;
}

type Step = 'count' | 'players';

export function TournamentCreator({
  onCreateTournament,
}: TournamentCreatorProps) {
  const [step, setStep] = useState<Step>('count');
  const [playerCount, setPlayerCount] = useState<string>('8'); // Changed to string for controlled input

  const handleCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('players');
  };

  const handlePlayersSubmit = (players: User[]) => {
    const tournament = generateBracket(players);
    onCreateTournament(tournament);
  };

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and ensure it's within bounds
    if (/^\d*$/.test(value)) {
      setPlayerCount(value);
    }
  };

  const parsedPlayerCount = parseInt(playerCount, 10);
  const isValidCount = !isNaN(parsedPlayerCount) && parsedPlayerCount >= 4 && parsedPlayerCount <= 32;

  if (step === 'players') {
    return (
      <div className={cn('space-y-4 bg-card rounded-lg border p-6', fadeIn)}>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Select Players
          </h2>
          <p className="text-sm text-muted-foreground">
            Select {parsedPlayerCount} players for the tournament. Players will be
            randomly matched in the bracket.
          </p>
        </div>

        <PlayerSelector
          requiredCount={parsedPlayerCount}
          onSubmit={handlePlayersSubmit}
          onBack={() => setStep('count')}
        />
      </div>
    );
  }

  return (
    <div className={cn('bg-card rounded-lg border p-6', fadeIn)}>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Flag className="h-6 w-6 text-primary" />
            Create Tournament
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 bg-card rounded-lg border w-full p-6">
          <form onSubmit={handleCountSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playerCount">Number of Players</Label>
              <Input
                id="playerCount"
                type="number"
                min="4"
                max="32"
                value={playerCount}
                onChange={handlePlayerCountChange}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Enter a number between 4 and 32
              </p>
            </div>

            <Button
              type="submit"
              disabled={!isValidCount}
              className="w-full sm:w-auto"
            >
              <Users className="mr-2 h-4 w-4" />
              Continue to Player Selection
            </Button>
          </form>

          <div className="space-y-4">
            <h3 className="font-medium">Tournament Format</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Single elimination
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Random seeding
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Best of 1 matches
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                No draws allowed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}