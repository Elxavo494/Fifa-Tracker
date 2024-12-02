import { useMemo } from "react"
import { format, eachDayOfInterval, isWithinInterval } from "date-fns"
import type { Match } from "@/types"
import type { DateRange } from "react-day-picker"

interface MatchDataPoint {
  date: string
  wins: number
  losses: number
  total: number
}

export function useMatchData(
  matches: Match[], 
  userId: string,
  dateRange: DateRange
): MatchDataPoint[] {
  return useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return []

    // Get all days in the date range
    const days = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to
    })

    return days.map(date => {
      const dayMatches = matches.filter(m => {
        const matchDate = new Date(m.date)
        return isWithinInterval(matchDate, {
          start: new Date(date.setHours(0, 0, 0, 0)),
          end: new Date(date.setHours(23, 59, 59, 999))
        })
      })

      const wins = dayMatches.filter(m => {
        const isTeam1 = m.team1.players.some(p => p.id === userId)
        return isTeam1 ? m.team1.score > m.team2.score : m.team2.score > m.team1.score
      }).length

      const losses = dayMatches.filter(m => {
        const isTeam1 = m.team1.players.some(p => p.id === userId)
        return isTeam1 ? m.team1.score < m.team2.score : m.team2.score < m.team1.score
      }).length

      return {
        date: format(date, "MMM dd"),
        wins,
        losses,
        total: dayMatches.length
      }
    })
  }, [matches, userId, dateRange])
}