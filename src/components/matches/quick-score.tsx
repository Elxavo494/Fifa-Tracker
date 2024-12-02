import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickScoreProps {
  onSelect: (team1Score: number, team2Score: number) => void;
}

interface ScoreOption {
  label: string;
  team1: number;
  team2: number;
}

const COMMON_SCORES: ScoreOption[] = [
  { label: '0 - 0', team1: 0, team2: 0 },
  { label: '1 - 0', team1: 1, team2: 0 },
  { label: '0 - 1', team1: 0, team2: 1 },
  { label: '2 - 0', team1: 2, team2: 0 },
  { label: '0 - 2', team1: 0, team2: 2 },
  { label: '2 - 1', team1: 2, team2: 1 },
  { label: '1 - 2', team1: 1, team2: 2 },
  { label: '3 - 0', team1: 3, team2: 0 },
  { label: '0 - 3', team1: 0, team2: 3 },
  { label: '3 - 1', team1: 3, team2: 1 },
  { label: '1 - 3', team1: 1, team2: 3 },
  { label: '3 - 2', team1: 3, team2: 2 },
  { label: '2 - 3', team1: 2, team2: 3 },
  { label: '4 - 0', team1: 4, team2: 0 },
  { label: '0 - 4', team1: 0, team2: 4 },
  { label: '4 - 1', team1: 4, team2: 1 },
  { label: '1 - 4', team1: 1, team2: 4 },
];

export function QuickScore({ onSelect }: QuickScoreProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleScoreClick = (e: React.MouseEvent, score: ScoreOption) => {
    e.preventDefault(); // Prevent form submission
    const value = `${score.team1}-${score.team2}`;
    setSelected(value);
    onSelect(score.team1, score.team2);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Quick Score Selection</p>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(60px,_1fr))] gap-2">
        {COMMON_SCORES.map((score) => (
          <Button
            key={score.label}
            variant="outline"
            size="sm"
            type="button" // Explicitly set type to button to prevent form submission
            className={cn(
              'transition-colors',
              selected === `${score.team1}-${score.team2}` &&
                'bg-primary text-primary-foreground'
            )}
            onClick={(e) => handleScoreClick(e, score)}
          >
            {score.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
