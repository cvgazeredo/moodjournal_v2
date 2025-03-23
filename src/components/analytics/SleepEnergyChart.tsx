'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface SleepEnergyChartProps {
  timeRange: string;
}

interface SleepDataPoint {
  date: string;
  hours: number;
  quality: number;
  energy: number;
}

export function SleepEnergyChart({ timeRange }: SleepEnergyChartProps) {
  const [data, setData] = useState<SleepDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string | null>(null);
  const [averageSleep, setAverageSleep] = useState<number>(0);

  useEffect(() => {
    async function fetchSleepData() {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API
        // For now, we'll generate sample data
        const now = new Date();
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

        // Generate sample data - we'll show the last 7 days regardless of timeRange
        // but in a real app, you'd aggregate data for longer periods
        const displayDays = Math.min(days, 7);
        const sampleData: SleepDataPoint[] = [];
        let sleepSum = 0;
        let goodSleepEnergySum = 0;
        let goodSleepCount = 0;
        let poorSleepEnergySum = 0;
        let poorSleepCount = 0;

        for (let i = 0; i < displayDays; i++) {
          const date = subDays(now, displayDays - i - 1);
          const isWeekend = [0, 6].includes(date.getDay());
          
          // Generate more realistic sleep data
          // People tend to sleep more on weekends
          const baseHours = isWeekend ? 8 : 6.5;
          const randomVariation = Math.random() * 2 - 1; // -1 to +1
          const hours = Math.max(4, Math.min(10, baseHours + randomVariation));
          
          // Sleep quality (0-10)
          const quality = Math.min(10, Math.max(0, Math.floor(hours * 1.2 - 2 + (Math.random() * 4 - 2))));
          
          // Energy level (0-10) - correlated with sleep hours and quality
          const energy = Math.min(10, Math.max(0, Math.floor((hours * 0.7 + quality * 0.3) + (Math.random() * 2 - 1))));
          
          sampleData.push({
            date: format(date, 'EEE'),
            hours: parseFloat(hours.toFixed(1)),
            quality,
            energy,
          });
          
          // Calculate statistics for insights
          sleepSum += hours;
          
          if (hours >= 7) {
            goodSleepEnergySum += energy;
            goodSleepCount++;
          } else {
            poorSleepEnergySum += energy;
            poorSleepCount++;
          }
        }
        
        setData(sampleData);
        
        // Calculate average sleep
        const avg = sleepSum / displayDays;
        setAverageSleep(parseFloat(avg.toFixed(1)));
        
        // Generate insights
        if (goodSleepCount > 0 && poorSleepCount > 0) {
          const goodSleepAvg = goodSleepEnergySum / goodSleepCount;
          const poorSleepAvg = poorSleepEnergySum / poorSleepCount;
          
          if (goodSleepAvg > poorSleepAvg) {
            const improvement = Math.round((goodSleepAvg - poorSleepAvg) * 10);
            setInsight(`Your energy was ${improvement}% higher on days with 7+ hours of sleep.`);
          }
        }
      } catch (error) {
        console.error('Error generating sleep data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSleepData();
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
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span>Sleep: {payload[0].value} hours</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
              <span>Quality: {payload[1].value}/10</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>Energy: {payload[2].value}/10</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 10]}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12, fill: '#888888' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 10]}
            label={{ value: 'Rating', angle: 90, position: 'insideRight', offset: 5, fontSize: 12, fill: '#888888' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine yAxisId="left" y={averageSleep} stroke="#8884d8" strokeDasharray="3 3" label="Avg Sleep" />
          <ReferenceLine yAxisId="left" y={7} stroke="#82ca9d" strokeDasharray="3 3" label="Recommended" />
          <Bar yAxisId="left" dataKey="hours" name="Sleep Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="quality" name="Sleep Quality" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="energy" name="Energy Level" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
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