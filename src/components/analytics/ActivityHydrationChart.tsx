'use client';

import { useEffect, useState } from 'react';
import { Loader2, Droplets, Activity } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ActivityHydrationChartProps {
  timeRange: string;
}

interface ActivityData {
  daysWithExercise: number;
  totalDays: number;
  exerciseStreak: number;
  waterGoalDays: number;
  waterIntakeAvg: string;
}

export function ActivityHydrationChart({ timeRange }: ActivityHydrationChartProps) {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivityData() {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API
        // For now, we'll generate sample data
        let days = 7;
        
        switch (timeRange) {
          case 'week':
            days = 7;
            break;
          case 'month':
            days = 30;
            break;
          case '3months':
            days = 90;
            break;
          case '6months':
            days = 180;
            break;
          case 'year':
            days = 365;
            break;
        }

        // Generate sample data
        const daysWithExercise = Math.floor(days * 0.6); // 60% of days had exercise
        const exerciseStreak = Math.min(5, Math.floor(Math.random() * 10)); // Current streak
        const waterGoalDays = Math.floor(days * 0.7); // 70% of days met water goal
        
        // Water intake average (less-than-1l, 1l-1.5l, 1.5l-2l, 2l-plus)
        const waterIntakeOptions = ['less-than-1l', '1l-1.5l', '1.5l-2l', '2l-plus'];
        const waterIntakeAvg = waterIntakeOptions[Math.floor(Math.random() * 3) + 1]; // Bias toward middle options
        
        setData({
          daysWithExercise,
          totalDays: days,
          exerciseStreak,
          waterGoalDays,
          waterIntakeAvg,
        });
      } catch (error) {
        console.error('Error generating activity data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No activity data available</p>
      </div>
    );
  }

  // Format water intake for display
  const waterIntakeDisplay = {
    'less-than-1l': 'Less than 1L',
    '1l-1.5l': '1L - 1.5L',
    '1.5l-2l': '1.5L - 2L',
    '2l-plus': '2L or more',
  }[data.waterIntakeAvg];

  // Calculate percentages
  const exercisePercentage = Math.round((data.daysWithExercise / data.totalDays) * 100);
  const waterPercentage = Math.round((data.waterGoalDays / data.totalDays) * 100);

  return (
    <div className="space-y-6">
      {/* Exercise Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-sm font-medium">Physical Activity</h3>
          </div>
          <span className="text-sm font-medium">{exercisePercentage}%</span>
        </div>
        
        <Progress value={exercisePercentage} className="h-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {data.daysWithExercise}/{data.totalDays} days with exercise
          </span>
          <span>
            {data.exerciseStreak > 0 ? `${data.exerciseStreak} day streak 🔥` : 'No current streak'}
          </span>
        </div>
      </div>

      {/* Hydration Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-sm font-medium">Hydration</h3>
          </div>
          <span className="text-sm font-medium">{waterPercentage}%</span>
        </div>
        
        <Progress value={waterPercentage} className="h-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {data.waterGoalDays}/{data.totalDays} days met water goal
          </span>
          <span>
            Avg: {waterIntakeDisplay}
          </span>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-primary/10 p-3 rounded-lg">
        {exercisePercentage >= 60 ? (
          <p className="text-sm font-medium text-primary flex items-center">
            <span className="mr-2">🏆</span>
            You exercised on {exercisePercentage}% of days! Keep it up!
          </p>
        ) : waterPercentage >= 70 ? (
          <p className="text-sm font-medium text-primary flex items-center">
            <span className="mr-2">💧</span>
            Great job staying hydrated on {waterPercentage}% of days!
          </p>
        ) : (
          <p className="text-sm font-medium text-primary flex items-center">
            <span className="mr-2">🎯</span>
            Try to exercise 3x this week and drink 2L of water daily!
          </p>
        )}
      </div>
    </div>
  );
} 