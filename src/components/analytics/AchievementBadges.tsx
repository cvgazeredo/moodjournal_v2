'use client';

import { useEffect, useState } from 'react';
import { Loader2, Award, Lock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementBadgesProps {
  timeRange: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

export function AchievementBadges({ timeRange }: AchievementBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API
        // For now, we'll generate sample badges
        
        // Sample badges
        const badgeData: Badge[] = [
          {
            id: 1,
            name: 'Consistency Champion',
            description: 'Log your mood for 30 consecutive days',
            icon: '🏆',
            unlocked: true,
            progress: 30,
            total: 30
          },
          {
            id: 2,
            name: 'Sleep Master',
            description: 'Achieve 8+ hours of sleep for 10 days',
            icon: '😴',
            unlocked: true,
            progress: 10,
            total: 10
          },
          {
            id: 3,
            name: 'Hydration Hero',
            description: 'Meet your water intake goal for 14 days',
            icon: '💧',
            unlocked: false,
            progress: 10,
            total: 14
          },
          {
            id: 4,
            name: 'Exercise Enthusiast',
            description: 'Exercise 3+ times per week for 4 weeks',
            icon: '🏃',
            unlocked: false,
            progress: 9,
            total: 12
          },
          {
            id: 5,
            name: 'Mood Booster',
            description: 'Maintain a mood rating of 4+ for 7 consecutive days',
            icon: '😊',
            unlocked: true,
            progress: 7,
            total: 7
          },
          {
            id: 6,
            name: 'Reflection Guru',
            description: 'Add detailed notes to 20 daily entries',
            icon: '✍️',
            unlocked: false,
            progress: 15,
            total: 20
          }
        ];
        
        setBadges(badgeData);
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Award className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No achievements available yet. Keep using the app to earn badges!</p>
      </div>
    );
  }

  // Count unlocked badges
  const unlockedCount = badges.filter(badge => badge.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Your Achievements</h3>
        <span className="text-xs text-muted-foreground">{unlockedCount}/{badges.length} unlocked</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <TooltipProvider>
          {badges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div 
                  className={`aspect-square flex flex-col items-center justify-center p-2 rounded-lg border ${
                    badge.unlocked 
                      ? 'border-primary/30 bg-primary/5' 
                      : 'border-muted bg-muted/20'
                  }`}
                >
                  <div className="text-2xl mb-1 relative">
                    <span>{badge.icon}</span>
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {!badge.unlocked && badge.progress > 0 && (
                    <div className="w-full mt-1">
                      <Progress value={(badge.progress / badge.total) * 100} className="h-1" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {!badge.unlocked && (
                    <p className="text-xs font-medium">
                      Progress: {badge.progress}/{badge.total}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
} 