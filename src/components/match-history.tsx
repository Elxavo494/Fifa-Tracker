import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Match } from '@/types';

interface MatchHistoryProps {
  matches: Match[];
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Team 1</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Team 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                <span className="hidden md:inline">{format(new Date(match.date), 'PPp')}</span>
                <span className="md:hidden">{format(new Date(match.date), 'PP')}</span>
              </TableCell>
              <TableCell className="text-center">
                {match.team1.players[0].name} & {match.team1.players[1].name}
              </TableCell>
              <TableCell className="text-center">
                {match.team1.score} - {match.team2.score}
              </TableCell>
              <TableCell className="text-center">
                {match.team2.players[0].name} & {match.team2.players[1].name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
