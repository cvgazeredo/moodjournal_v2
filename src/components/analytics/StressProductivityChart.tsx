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
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { format, subDays, subMonths, isWeekend } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface StressProductivityChartProps {
  timeRange: string;
}

interface StressDataPoint {
  date: string;
  stress: number;
  productivity: number;
  isWeekend: boolean;
}

export function StressProductivityChart({ timeRange }: StressProductivityChartProps) {
  const [data, setData] = useState<StressDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStressData() {
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

        // Generate sample data - we'll show the last 14 days regardless of timeRange
        // but in a real app, you'd aggregate data for longer periods
        const displayDays = Math.min(days, 14);
        const sampleData: StressDataPoint[] = [];
        
        let weekdayStressSum = 0;
        let weekdayCount = 0;
        let weekendStressSum = 0;
        let weekendCount = 0;
        
        let highStressDays = 0;
        let lowStressDays = 0;

        for (let i = 0; i < displayDays; i++) {
          const date = subDays(now, displayDays - i - 1);
          const weekend = isWeekend(date);
          
          // Generate more realistic stress data
          // Weekdays tend to have higher stress
          const baseStress = weekend ? 3 : 6;
          const randomVariation = Math.random() * 4 - 2; // -2 to +2
          const stress = Math.max(0, Math.min(10, baseStress + randomVariation));
          
          // Productivity is inversely related to stress, but only to a point
          // Moderate stress can increase productivity, but high stress decreases it
          let productivity;
          if (stress < 3) {
            productivity = 5 + Math.random() * 2; // Low stress: moderate productivity
          } else if (stress < 7) {
            productivity = 7 + Math.random() * 2; // Moderate stress: high productivity
          } else {
            productivity = 10 - (stress - 7) * 2 + Math.random() * 2; // High stress: decreasing productivity
          }
          productivity = Math.max(0, Math.min(10, productivity));
          
          sampleData.push({
            date: format(date, 'MMM dd'),
            stress,
            productivity,
            isWeekend: weekend,
          });
          
          // Calculate statistics for insights
          if (weekend) {
            weekendStressSum += stress;
            weekendCount++;
          } else {
            weekdayStressSum += stress;
            weekdayCount++;
          }
          
          if (stress >= 7) {
            highStressDays++;
          } else if (stress <= 3) {
            lowStressDays++;
          }
        }
        
        setData(sampleData);
        
        // Generate insights
        if (weekdayCount > 0 && weekendCount > 0) {
          const weekdayAvg = weekdayStressSum / weekdayCount;
          const weekendAvg = weekendStressSum / weekendCount;
          
          if (weekdayAvg > weekendAvg) {
            const difference = Math.round((weekdayAvg - weekendAvg) * 10) / 10;
            setInsight(`Your stress levels are ${difference} points higher on weekdays compared to weekends.`);
          }
        } else if (highStressDays >= 3) {
          setInsight(`You had ${highStressDays} high-stress days recently. Consider relaxation techniques on these days.`);
        } else if (lowStressDays >= displayDays / 2) {
          setInsight(`Great job! You've maintained low stress levels for ${lowStressDays} days.`);
        }
      } catch (error) {
        console.error('Error generating stress data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStressData();
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
          <p className="font-medium">{label} {dataPoint.isWeekend ? '(Weekend)' : '(Weekday)'}</p>
          <div className="space-y-1 mt-1">
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span>Stress: {dataPoint.stress}/10</span>
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>Productivity: {dataPoint.productivity}/10</span>
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
        <AreaChart
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
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <defs>
            <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="stress" 
            name="Stress Level" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorStress)" 
          />
          <Area 
            type="monotone" 
            dataKey="productivity" 
            name="Productivity" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorProductivity)" 
          />
        </AreaChart>
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