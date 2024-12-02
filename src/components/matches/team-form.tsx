import { Plus, Minus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import type { User as UserType } from '@/types';

interface TeamFormProps {
  teamNumber: number;
  players: UserType[];
  selectedPlayers: UserType[];
  score: string;
  usedPlayerIds: Set<string>;
  onPlayerAdd: () => void;
  onPlayerRemove: (index: number) => void;
  onPlayerSelect: (index: number, playerId: string) => void;
  onScoreChange: (value: string) => void;
}

export function TeamForm({
  teamNumber,
  players,
  selectedPlayers,
  score,
  usedPlayerIds,
  onPlayerAdd,
  onPlayerRemove,
  onPlayerSelect,
  onScoreChange,
}: TeamFormProps) {
  const canAddPlayer = selectedPlayers.length < 4;
  const canRemovePlayer = selectedPlayers.length > 1;

  const getAvailablePlayers = (currentIndex: number) => {
    return players.filter((player) => {
      // Allow the currently selected player
      if (selectedPlayers[currentIndex]?.id === player.id) {
        return true;
      }
      // Filter out players that are already selected
      return !usedPlayerIds.has(player.id);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Team {teamNumber}</h3>
        <div className="flex items-center gap-2">
          {canRemovePlayer && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onPlayerRemove(selectedPlayers.length - 1)}
              className="rounded-full bg-primary hover:bg-primary/90 p-0 h-8 w-8"
            >
              <Minus className="h-4 w-4 text-primary-foreground" />
            </Button>
          )}
          {canAddPlayer && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onPlayerAdd}
              className="rounded-full bg-primary hover:bg-primary/90 p-0 h-8 w-8"
            >
              <Plus className="h-4 w-4 text-primary-foreground" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {selectedPlayers.map((selectedPlayer, index) => (
          <Select
            key={index}
            value={selectedPlayer?.id || ''}
            onValueChange={(value) => onPlayerSelect(index, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select player">
                {selectedPlayer?.id ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedPlayer.avatarUrl || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedPlayer.name}</span>
                  </div>
                ) : (
                  'Select player'
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {getAvailablePlayers(index).map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={player.avatarUrl || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{player.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Input
          type="number"
          placeholder="Score"
          value={score}
          onChange={(e) => onScoreChange(e.target.value)}
          min="0"
          className="mt-4"
        />
      </div>
    </div>
  );
}