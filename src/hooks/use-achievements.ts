import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ACHIEVEMENTS } from '@/lib/constants/achievements';
import type { PlayerAchievement, Achievement } from '@/types/achievement';
import type { PlayerStats } from '@/types';

export function useAchievements(userId: string, stats?: PlayerStats | null) {
  const [achievements, setAchievements] = useState<PlayerAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadAchievements();
    }
  }, [userId]);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select(`
          *,
          profiles:profile_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAchievements = async (playerStats: PlayerStats) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (achievement.condition(playerStats)) {
        unlockAchievement(achievement.id);
      }
    });
  };

  const unlockAchievement = async (achievementId: string) => {
    const existingAchievement = achievements.find(a => a.achievement_id === achievementId);
    if (existingAchievement) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .upsert({
          user_id: userId,
          profile_id: userId,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,achievement_id',
          ignoreDuplicates: true
        });

      if (error) throw error;
      await loadAchievements();
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  return {
    achievements,
    isLoading,
    validateAchievements
  };
} 