import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Medal, Star } from "lucide-react"
import { RankingsSort, type SortOption } from "./rankings-sort"
import { useState } from "react"
import type { PlayerStats } from "@/types"

interface RankingsTableProps {
  players: PlayerStats[]
}

export function RankingsTable({ players }: RankingsTableProps) {
  const [sortBy, setSortBy] = useState<SortOption>("points")

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === "points") {
      return b.points - a.points
    }
    // Sort by win rate
    const aWinRate = a.matches > 0 ? (a.wins / a.matches) : 0
    const bWinRate = b.matches > 0 ? (b.wins / b.matches) : 0
    return bWinRate - aWinRate
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Star className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  if (sortedPlayers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No matches played yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RankingsSort currentSort={sortBy} onSortChange={setSortBy} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-center">Matches</TableHead>
              <TableHead className="text-center">W</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">Win Rate</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={player.avatarUrl || ""} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.name}</span>
                  </div>
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
                <TableCell className="text-center">
                  {player.matches > 0 ? `${Math.round((player.wins / player.matches) * 100)}%` : '0%'}
                </TableCell>
                <TableCell className="font-semibold text-center">
                  {player.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}