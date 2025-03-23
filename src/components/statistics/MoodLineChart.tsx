'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

interface MoodLineChartProps {
  timeRange: string;
}

interface MoodDataPoint {
  date: string;
  mood: number; // Changed from rating to mood to match dashboard
}

export function MoodLineChart({ timeRange }: MoodLineChartProps) {
  const [data, setData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoodData() {
      setLoading(true);
      try {
        // Calculate the start date based on the time range
        const now = new Date();
        let startDate = now;
        
        switch (timeRange) {
          case 'week':
            startDate = subDays(now, 7);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case '3months':
            startDate = subMonths(now, 3);
            break;
          case '6months':
            startDate = subMonths(now, 6);
            break;
          case 'year':
            startDate = subMonths(now, 12);
            break;
        }

        const response = await fetch(`/api/statistics/mood?start=${startDate.toISOString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mood data');
        }
        const moodData = await response.json();
        setData(moodData.map((entry: { date: string; rating: number }) => ({
          date: format(new Date(entry.date), timeRange === 'week' ? 'EEE' : 'MMM dd'),
          mood: entry.rating,
        })));
      } catch (error) {
        console.error('Error fetching mood data:', error);
        // Handle error state here
      } finally {
        setLoading(false);
      }
    }

    fetchMoodData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 10]}
          
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Mood
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Date
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].payload.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: "#8b5cf6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 