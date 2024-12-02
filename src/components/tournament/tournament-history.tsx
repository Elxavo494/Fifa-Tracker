import { format } from 'date-fns';
import { Trophy, Crown, Check, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/animations';
import type { Tournament } from '@/types/tournament';

interface TournamentHistoryProps {
  tournaments: Tournament[];
  isLoading: boolean;
  onTournamentSelect: (tournament: Tournament) => void;
}

export function TournamentHistory({
  tournaments,
  isLoading,
  onTournamentSelect,
}: TournamentHistoryProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">Loading tournaments...</p>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No tournaments played yet</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4 bg-card rounded-lg border p-6', fadeIn)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Tournament History
        </h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((tournament) => {
              const firstRoundPlayers = tournament.rounds[0].matches.flatMap(
                (match) => match.players.filter(Boolean)
              );

              return (
                <TableRow 
                  key={tournament.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onTournamentSelect(tournament)}
                >
                  <TableCell>
                    <span className="hidden md:inline">{format(new Date(tournament.created_at), 'PPp')}</span>
                    <span className="md:hidden">{format(new Date(tournament.created_at), 'dd/MM/yy')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-1 overflow-hidden">
                      {firstRoundPlayers.slice(0, 4).map((player, i) => (
                        <Avatar
                          key={i}
                          className="h-5 w-5 ring-1 ring-background"
                        >
                          <AvatarImage src={player?.avatarUrl || ''} />
                          <AvatarFallback className="text-[10px]">
                            {player?.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {firstRoundPlayers.length > 4 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted ring-1 ring-background">
                          <span className="text-[8px] text-muted-foreground">
                            +{firstRoundPlayers.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {tournament.winner ? (
                      <div className="flex items-center gap-2 relative">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={tournament.winner.avatarUrl || ''}
                          />
                          <AvatarFallback className="text-[10px]">
                            {tournament.winner.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium relative">
                          {tournament.winner.name}                          
                        </span>
                        <Crown className="h-4 w-4 text-yellow-500 absolute -top-2 left-3" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">In Progress</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-end">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium md:block flex items-center justify-center p-[5px]',
                        tournament.status === 'completed'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      )}
                    >
                      <span className="hidden md:inline">
                        {tournament.status === 'completed' ? 'Completed' : 'Ongoing'}
                      </span>
                      <span className="md:hidden">
                        {tournament.status === 'completed' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}