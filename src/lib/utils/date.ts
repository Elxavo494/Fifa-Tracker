import { startOfWeek, isAfter, isBefore } from "date-fns"

export function getCurrentWeekStart() {
  const now = new Date()
  // Get Monday 8am GMT+1 of the current week
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // 1 = Monday
  weekStart.setHours(8, 0, 0, 0)
  // Adjust for GMT+1
  weekStart.setHours(weekStart.getHours() + 1)
  return weekStart
}

export function isInCurrentWeek(date: Date | string) {
  const weekStart = getCurrentWeekStart()
  const nextWeekStart = new Date(weekStart)
  nextWeekStart.setDate(nextWeekStart.getDate() + 7)
  
  const checkDate = new Date(date)
  return isAfter(checkDate, weekStart) && isBefore(checkDate, nextWeekStart)
}