import type { Achievement } from '@/types/achievement';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first match',
    icon: '🏆',
    rarity: 'common',
    condition: (stats) => stats.wins > 0
  },
  {
    id: 'second_win',
    name: 'Second Victory',
    description: 'Win your second match',
    icon: '🥈',
    rarity: 'common',
    condition: (stats) => stats.wins >= 2
  },
  {
    id: 'third_win',
    name: 'Third Victory',
    description: 'Win your third match',
    icon: '🥉',
    rarity: 'common',
    condition: (stats) => stats.wins >= 3
  },
  {
    id: 'five_wins',
    name: 'High Five Champion',
    description: 'Win 5 matches',
    icon: '🌟',
    rarity: 'common',
    condition: (stats) => stats.wins >= 5
  },
  {
    id: 'ten_wins',
    name: 'Perfect Ten',
    description: 'Win 10 matches',
    icon: '🎯',
    rarity: 'common',
    condition: (stats) => stats.wins >= 10
  },
  {
    id: 'goal_machine',
    name: 'Goal Machine',
    description: 'Score 50 goals',
    icon: '⚽',
    rarity: 'rare',
    condition: (stats) => stats.goalsScored >= 50
  },
  {
    id: 'goal_centurion',
    name: 'Goal Striker',
    description: 'Score 100 goals',
    icon: '🏟️',
    rarity: 'epic',
    condition: (stats) => stats.goalsScored >= 100
  },
  {
    id: 'goal_legend',
    name: 'Goal Legend',
    description: 'Score 500 goals',
    icon: '⭐',
    rarity: 'legendary',
    condition: (stats) => stats.goalsScored >= 500
  },
  {
    id: 'tournament_master',
    name: 'Tournament Master',
    description: 'Win 3 tournaments',
    icon: '👑',
    rarity: 'epic',
    condition: (stats) => stats.tournamentsWon >= 3
  },
  {
    id: 'undefeated',
    name: 'Undefeated',
    description: 'Win 10 matches in a row',
    icon: '🔥',
    rarity: 'legendary',
    condition: (stats) => stats.winStreak >= 10
  },
  {
    id: 'clean_sheet',
    name: 'Clean Sheet',
    description: 'Win a match without conceding any goals',
    icon: '🛡️',
    rarity: 'rare',
    condition: (stats) => stats.cleanSheets > 0
  },
  {
    id: 'goal_fest',
    name: 'Goal Fest',
    description: 'Score 5 or more goals in a single match',
    icon: '🎪',
    rarity: 'epic',
    condition: (stats) => stats.highestGoalsInMatch >= 5
  },
  {
    id: 'marathon_player',
    name: 'Marathon Player',
    description: 'Play 100 matches',
    icon: '🏃',
    rarity: 'rare',
    condition: (stats) => stats.gamesPlayed >= 100
  },
  {
    id: 'defensive_master',
    name: 'Defensive Master',
    description: 'Win 5 matches while conceding 2 or fewer goals',
    icon: '🛡️',
    rarity: 'epic',
    condition: (stats) => stats.lowScoringWins >= 5
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play 500 matches',
    icon: '🎖️',
    rarity: 'legendary',
    condition: (stats) => stats.gamesPlayed >= 500
  },
  {
    id: 'perfect_season',
    name: 'Perfect Season',
    description: 'Win 20 matches in a row',
    icon: '🌠',
    rarity: 'legendary',
    condition: (stats) => stats.winStreak >= 20
  },
  {
    id: 'golden_boot',
    name: 'Golden Boot',
    description: 'Score 1000 goals total',
    icon: '👢',
    rarity: 'legendary',
    condition: (stats) => stats.goalsScored >= 1000
  },
  {
    id: 'goal_difference_king',
    name: 'Goal Difference King',
    description: 'Win a match with a 5+ goal difference',
    icon: '📊',
    rarity: 'epic',
    condition: (stats) => stats.highestGoalDifference >= 5
  },
  {
    id: 'consistent_scorer',
    name: 'Consistent Scorer',
    description: 'Score at least one goal in 10 consecutive matches',
    icon: '📈',
    rarity: 'legendary',
    condition: (stats) => stats.consecutiveScoringGames >= 10
  },
  {
    id: 'defensive_wall',
    name: 'Defensive Wall',
    description: 'Get 10 clean sheets',
    icon: '🧱',
    rarity: 'epic',
    condition: (stats) => stats.cleanSheets >= 10
  },
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Win all matches in a calendar month (minimum 10 matches)',
    icon: '📅',
    rarity: 'legendary',
    condition: (stats) => stats.perfectMonthAchieved
  }
]; 