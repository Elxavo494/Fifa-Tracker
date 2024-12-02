import { PlayerStats } from ".";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: PlayerStats) => boolean;
}

export interface PlayerAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
} 