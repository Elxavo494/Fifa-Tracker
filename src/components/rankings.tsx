import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Crown, Medal, Star } from 'lucide-react';
import type { Match, PlayerStats } from '@/types';

interface RankingsProps {
  matches: Match[];
  players: PlayerStats[];
}

export function Rankings({ players }: RankingsProps) {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Star className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead className="text-center">Player</TableHead>
            <TableHead className="text-center">Matches</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow key={player.id}>
              <TableCell className="flex items-center gap-2">
                {getRankIcon(index + 1)}
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-center">
                {player.name}
              </TableCell>
              <TableCell className="text-center">{player.matches}</TableCell>

              <TableCell className="text-green-500 text-center">
                {player.wins}
              </TableCell>
              <TableCell className="text-yellow-500 text-center">
                {player.draws}
              </TableCell>
              <TableCell className="text-red-500 text-center">
                {player.losses}
              </TableCell>
              <TableCell className="font-semibold text-center">
                {player.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
