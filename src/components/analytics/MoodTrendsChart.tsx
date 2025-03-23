'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface MoodTrendsChartProps {
  timeRange: string;
}

interface MoodDataPoint {
  date: string;
  mood: number;
  exercise?: boolean;
  sleepHours?: number;
}

// Emoji mapping for mood ratings
const moodEmojis = ['😞', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '😃', '😆', '🥳'];

export function MoodTrendsChart({ timeRange }: MoodTrendsChartProps) {
  const [data, setData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string | null>(null);
  const [averageMood, setAverageMood] = useState<number>(0);

  useEffect(() => {
    async function fetchMoodData() {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API
        // For now, we'll generate sample data
        const now = new Date();
        let startDate = now;
        let days = 7;
        
        switch (timeRange) {
          case 'week':
            startDate = subDays(now, 7);
            days = 7;
            break;
          case 'month':
            startDate = subMonths(now, 1);
            days = 30;
            break;
          case '3months':
            startDate = subMonths(now, 3);
            days = 90;
            break;
          case '6months':
            startDate = subMonths(now, 6);
            days = 180;
            break;
          case 'year':
            startDate = subMonths(now, 12);
            days = 365;
            break;
        }

        // Generate sample data
        const sampleData: MoodDataPoint[] = [];
        let sum = 0;
        let exerciseDaysMoodSum = 0;
        let exerciseDaysCount = 0;
        let nonExerciseDaysMoodSum = 0;
        let nonExerciseDaysCount = 0;
        let goodSleepMoodSum = 0;
        let goodSleepCount = 0;
        let poorSleepMoodSum = 0;
        let poorSleepCount = 0;

        for (let i = 0; i < days; i++) {
          const date = subDays(now, days - i - 1);
          const isWeekend = [0, 6].includes(date.getDay());
          
          // Generate more realistic mood data
          // Weekends tend to have better moods
          const baseMood = isWeekend ? 7 : 5;
          const randomVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const mood = Math.max(0, Math.min(10, baseMood + randomVariation));
          
          // Add exercise data (more likely on weekdays)
          const didExercise = Math.random() < (isWeekend ? 0.3 : 0.6);
          
          // Add sleep data (varies between 5-9 hours)
          const sleepHours = 5 + Math.floor(Math.random() * 4);
          
          sampleData.push({
            date: format(date, timeRange === 'week' ? 'EEE' : 'MMM dd'),
            mood,
            exercise: didExercise,
            sleepHours,
          });
          
          // Calculate statistics for insights
          sum += mood;
          
          if (didExercise) {
            exerciseDaysMoodSum += mood;
            exerciseDaysCount++;
          } else {
            nonExerciseDaysMoodSum += mood;
            nonExerciseDaysCount++;
          }
          
          if (sleepHours >= 7) {
            goodSleepMoodSum += mood;
            goodSleepCount++;
          } else {
            poorSleepMoodSum += mood;
            poorSleepCount++;
          }
        }
        
        setData(sampleData);
        
        // Calculate average mood
        const avg = sum / days;
        setAverageMood(avg);
        
        // Generate insights
        if (exerciseDaysCount > 0 && nonExerciseDaysCount > 0) {
          const exerciseAvg = exerciseDaysMoodSum / exerciseDaysCount;
          const nonExerciseAvg = nonExerciseDaysMoodSum / nonExerciseDaysCount;
          
          if (exerciseAvg > nonExerciseAvg) {
            const improvement = Math.round((exerciseAvg - nonExerciseAvg) * 10);
            setInsight(`Your mood was ${improvement}% better on days you exercised.`);
          }
        } else if (goodSleepCount > 0 && poorSleepCount > 0) {
          const goodSleepAvg = goodSleepMoodSum / goodSleepCount;
          const poorSleepAvg = poorSleepMoodSum / poorSleepCount;
          
          if (goodSleepAvg > poorSleepAvg) {
            const improvement = Math.round((goodSleepAvg - poorSleepAvg) * 10);
            setInsight(`Your mood was ${improvement}% higher on days with 7+ hours of sleep.`);
          }
        }
      } catch (error) {
        console.error('Error generating mood data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMoodData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <div className="flex items-center mt-1">
            <span className="text-xl mr-2">{moodEmojis[dataPoint.mood]}</span>
            <span className="font-semibold">Mood: {dataPoint.mood}/10</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Sleep: {dataPoint.sleepHours} hours</p>
            <p>Exercise: {dataPoint.exercise ? 'Yes' : 'No'}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => moodEmojis[value]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={averageMood} stroke="#8884d8" strokeDasharray="3 3" label="Average" />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 4 }}
            activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {insight && (
        <div className="bg-primary/10 p-3 rounded-lg">
          <p className="text-sm font-medium text-primary flex items-center">
            <span className="mr-2">💡</span>
            {insight}
          </p>
        </div>
      )}
    </div>
  );
} 