import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUsers } from '@/lib/users';
import { shuffle } from '@/lib/utils';
import type { User } from '@/types';

interface PlayerSelectorProps {
  requiredCount: number;
  onSubmit: (players: User[]) => void;
  onBack: () => void;
}

export function PlayerSelector({
  requiredCount,
  onSubmit,
  onBack,
}: PlayerSelectorProps) {
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUsers().then((users) => {
      setAvailablePlayers(users);
      setIsLoading(false);
    });
  }, []);

  const togglePlayer = (playerId: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else if (selectedPlayers.size < requiredCount) {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleSelectAll = () => {
    if (availablePlayers.length <= requiredCount) {
      setSelectedPlayers(new Set(availablePlayers.map((p) => p.id)));
    } else {
      const shuffledPlayers = shuffle([...availablePlayers]);
      const selectedIds = shuffledPlayers
        .slice(0, requiredCount)
        .map((p) => p.id);
      setSelectedPlayers(new Set(selectedIds));
    }
  };

  const handleSubmit = () => {
    const players = availablePlayers.filter((p) => selectedPlayers.has(p.id));
    onSubmit(players);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px] rounded-lg border bg-card/50">
        <p className="text-muted-foreground">Loading players...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedPlayers.size} of {requiredCount} players selected
        </p>
        <Button variant="outline" onClick={handleSelectAll} className="gap-2">
          <Users className="h-4 w-4" />
          {availablePlayers.length <= requiredCount
            ? 'Select All Players'
            : `Randomly Select ${requiredCount} Players`}
        </Button>
      </div>

      <ScrollArea className="rounded-lg border bg-card/50 p-4">
        <RadioGroup className="grid grid-cols-2 gap-2">
          {availablePlayers.map((player) => (
            <label
              key={player.id}
              className={`
                flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer
                ${
                  !selectedPlayers.has(player.id) &&
                  selectedPlayers.size >= requiredCount
                    ? 'opacity-50'
                    : ''
                }
              `}
            >
              <RadioGroupItem
                value={player.id}
                id={player.id}
                checked={selectedPlayers.has(player.id)}
                onClick={() => togglePlayer(player.id)}
                disabled={
                  !selectedPlayers.has(player.id) &&
                  selectedPlayers.size >= requiredCount
                }
                className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <Avatar className="h-6 w-6">
                <AvatarImage src={player.avatarUrl || ''} />
                <AvatarFallback>{player.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{player.name}</span>
            </label>
          ))}
        </RadioGroup>
      </ScrollArea>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={selectedPlayers.size !== requiredCount}
          className="gap-2"
        >
          <Trophy className="h-4 w-4" />
          Generate Tournament ({selectedPlayers.size}/{requiredCount})
        </Button>
      </div>
    </div>
  );
}
