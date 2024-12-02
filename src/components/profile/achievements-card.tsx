import { Trophy, Eye, EyeOff, Info } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ACHIEVEMENTS } from '@/lib/constants/achievements';
import type { PlayerAchievement } from '@/types/achievement';
import { cn } from '@/lib/utils';
import { slideIn } from '@/lib/animations';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useEffect, useRef } from 'react';

interface AchievementsCardProps {
  achievements: PlayerAchievement[];
  className?: string;
}

export function AchievementsCard({ achievements, className }: AchievementsCardProps) {
  const [showLocked, setShowLocked] = useState(true);
  const [cardHeight, setCardHeight] = useState<number | undefined>();
  const contentRef = useRef<HTMLDivElement>(null);

  const rarityColors = {
    common: 'from-gray-500/10 via-background to-background border-gray-500/50',
    rare: 'from-blue-500/10 via-background to-background border-blue-500/50',
    epic: 'from-purple-500/10 via-background to-background border-purple-500/50',
    legendary: 'from-yellow-500/10 via-background to-background border-yellow-500/50'
  };

  const rarityTextColors = {
    common: 'text-gray-500',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-yellow-500'
  };

  const filteredAchievements = ACHIEVEMENTS
    .filter(achievement => {
      const isUnlocked = achievements.find(a => a.achievement_id === achievement.id);
      return showLocked || isUnlocked;
    })
    .sort((a, b) => {
      const aUnlocked = achievements.find(ach => ach.achievement_id === a.id);
      const bUnlocked = achievements.find(ach => ach.achievement_id === b.id);
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return 0;
    });

  const updateCardHeight = () => {
    if (contentRef.current) {
      const headerHeight = 100; // Approximate height of the header
      const contentHeight = contentRef.current.scrollHeight;
      setCardHeight(headerHeight + contentHeight);
    }
  };

  useEffect(() => {
    updateCardHeight();
  }, [filteredAchievements, showLocked]);

  useEffect(() => {
    window.addEventListener('resize', updateCardHeight);
    return () => window.removeEventListener('resize', updateCardHeight);
  }, []);

  return (
    <Card 
      className={cn(
        'w-full relative transition-[height] duration-300', 
        className
      )}
      style={{ height: cardHeight ? `${cardHeight}px` : 'auto' }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-locked"
              checked={showLocked}
              onCheckedChange={setShowLocked}
            />
            {showLocked ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {achievements.length} / {ACHIEVEMENTS.length} achievements unlocked
        </p>
      </CardHeader>
      <CardContent ref={contentRef}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {filteredAchievements.map((achievement, index) => {
            const unlocked = achievements.find(a => a.achievement_id === achievement.id);
            const unlockedDate = unlocked?.unlocked_at ? new Date(unlocked.unlocked_at) : null;
            const rarityColor = rarityColors[achievement.rarity].replace('bg-', '');

            return (
              <div
                key={`${achievement.id}-${showLocked}`}
                className={cn(
                  'flex items-center gap-2 md:gap-4 p-3 rounded-lg transition-all duration-300 border hover:opacity-100 relative',
                  unlocked 
                    ? cn(
                        'bg-gradient-to-br opacity-100',
                        rarityColors[achievement.rarity]
                      )
                    : cn(
                        'bg-muted/50 opacity-50',
                        {
                          'hover:bg-gray-500/5 hover:border-gray-500': achievement.rarity === 'common',
                          'hover:bg-blue-500/5 hover:border-blue-500': achievement.rarity === 'rare',
                          'hover:bg-purple-500/5 hover:border-purple-500': achievement.rarity === 'epic',
                          'hover:bg-yellow-500/5 hover:border-yellow-500': achievement.rarity === 'legendary'
                        }
                      ),
                  slideIn("up"),
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  transform: 'translateY(0)'
                }}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="absolute top-2 right-2 cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] space-y-2 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-3xl">
                          {achievement.icon}
                        </div>
                        <div className="space-y-1.5">
                          <p className="font-semibold">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            achievement.rarity === 'common' && 'bg-gray-500/10 text-gray-500 border-gray-500',
                            achievement.rarity === 'rare' && 'bg-blue-500/10 text-blue-500 border-blue-500',
                            achievement.rarity === 'epic' && 'bg-purple-500/10 text-purple-500 border-purple-500',
                            achievement.rarity === 'legendary' && 'bg-yellow-500/10 text-yellow-500 border-yellow-500'
                          )}
                        >
                          {achievement.rarity}
                        </Badge>
                        {unlockedDate && (
                          <span className="text-xs text-muted-foreground">
                            Unlocked {unlockedDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex-shrink-0 text-xl md:text-2xl">{achievement.icon}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm md:text-base font-medium">{achievement.name}</h4>
                    {/* <Badge
                      variant="secondary"
                      className={cn(
                        'text-[10px]',
                        rarityColors[achievement.rarity]
                      )}
                    >
                      {achievement.rarity}
                    </Badge> */}
                  </div>
                  {/* {unlockedDate && (
                    <p className="text-xs text-muted-foreground">
                      Unlocked on {unlockedDate.toLocaleDateString()}
                    </p>
                  )} */}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 