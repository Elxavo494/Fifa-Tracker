import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { isInCurrentWeek } from "@/lib/utils/date"
import type { Match } from "@/types"

interface MatchHistoryProps {
  matches: Match[]
}

function PlayerList({ players }: { players: Match["team1"]["players"] }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex -space-x-2">
        {players.map((player, i) => (
          <Avatar key={player.id} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={player.avatarUrl || ""} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="hidden md:block">
        {players.map(p => p.name).join(" & ")}
      </span>
    </div>
  )
}

function MatchTable({ matches }: { matches: Match[] }) {
  if (!matches.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No matches recorded yet</p>
      </div>
    )
  }

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
                <span className="md:hidden">{format(new Date(match.date), 'dd/MM/yy')}</span>
              </TableCell>
              <TableCell>
                <PlayerList players={match.team1.players} />
              </TableCell>
              <TableCell className="text-center">
                <span className={match.team1.score > match.team2.score ? "text-green-500 font-bold" : ""}>
                  {match.team1.score}
                </span>
                {" - "}
                <span className={match.team2.score > match.team1.score ? "text-green-500 font-bold" : ""}>
                  {match.team2.score}
                </span>
              </TableCell>
              <TableCell>
                <PlayerList players={match.team2.players} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  const weeklyMatches = matches.filter(match => isInCurrentWeek(match.date))

  return (
    <Tabs defaultValue="all-time">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger 
          value="all-time"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          All Time ({matches.length})
        </TabsTrigger>
        <TabsTrigger 
          value="weekly"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          This Week ({weeklyMatches.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all-time">
        <MatchTable matches={matches} />
      </TabsContent>
      <TabsContent value="weekly">
        <MatchTable matches={weeklyMatches} />
      </TabsContent>
    </Tabs>
  )
}