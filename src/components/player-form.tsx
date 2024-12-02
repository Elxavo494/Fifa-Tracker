import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { Player } from '@/types';

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
}

export function PlayerForm({ onAddPlayer }: PlayerFormProps) {
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a player name',
        variant: 'destructive',
      });
      return;
    }

    onAddPlayer({
      id: crypto.randomUUID(),
      name: name.trim(),
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-between gap-2">
      <Input
        placeholder="Enter player name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className=""
      />
      <Button type="submit">
        <Plus className="mr-2 h-4 w-4" />
        Add Player
      </Button>
    </form>
  );
}
