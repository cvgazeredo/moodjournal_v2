'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
  ComposedChart,
} from 'recharts';
import { Loader2 } from 'lucide-react';

interface MoodSleepCorrelationChartProps {
  timeRange: string;
}

interface DataPoint {
  date: string;
  mood: number;
  sleepHours: number;
  sleepQuality: number;
}

// Emoji mapping for mood ratings
const moodEmojis = ['😞', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '😃', '😆', '🥳'];

// Sleep quality descriptions
const sleepQualityDescriptions: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export function MoodSleepCorrelationChart({ timeRange }: MoodSleepCorrelationChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string | null>(null);
  const [correlation, setCorrelation] = useState<number>(0);
  const [averageMood, setAverageMood] = useState<number>(0);
  const [averageSleepQuality, setAverageSleepQuality] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Calculate the start date based on the time range
        const now = new Date();
        let startDate = now;
        
        switch (timeRange) {
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case '3months':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          case '6months':
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        }

        const response = await fetch(`/api/statistics/mood-sleep?start=${startDate.toISOString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mood-sleep data');
        }
        
        const fetchedData = await response.json();
        
        // Order data by date
        const orderedData = [...fetchedData].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        setData(orderedData);
        
        // Calculate averages
        if (orderedData.length > 0) {
          const avgMood = orderedData.reduce((sum, d) => sum + d.mood, 0) / orderedData.length;
          const avgSleepQuality = orderedData.reduce((sum, d) => sum + d.sleepQuality, 0) / orderedData.length;
          
          setAverageMood(parseFloat(avgMood.toFixed(1)));
          setAverageSleepQuality(parseFloat(avgSleepQuality.toFixed(1)));
        }
        
        // Calculate correlation coefficient between sleep quality and mood
        if (fetchedData.length > 1) {
          const correlation = calculateCorrelation(
            fetchedData.map((d: DataPoint) => d.sleepQuality),
            fetchedData.map((d: DataPoint) => d.mood)
          );
          
          setCorrelation(correlation);
          
          // Generate insight based on correlation
          if (correlation > 0.7) {
            setInsight('Strong correlation detected: Your mood tends to be significantly better on days with higher sleep quality.');
          } else if (correlation > 0.4) {
            setInsight('Moderate correlation detected: Better sleep quality appears to contribute to improved mood.');
          } else if (correlation > 0.2) {
            setInsight('Weak correlation detected: There may be a slight relationship between your sleep quality and mood.');
          } else {
            setInsight('No significant correlation: Your mood doesn\'t seem to be strongly affected by sleep quality alone.');
          }
        }
      } catch (error) {
        console.error('Error fetching mood-sleep correlation data:', error);
        // Handle error state here
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  // Calculate Pearson correlation coefficient
  function calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;
    
    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate numerator and denominators
    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - meanX;
      const yDiff = y[i] - meanY;
      numerator += xDiff * yDiff;
      denominatorX += xDiff * xDiff;
      denominatorY += yDiff * yDiff;
    }
    
    // Avoid division by zero
    if (denominatorX === 0 || denominatorY === 0) return 0;
    
    // Calculate and return correlation coefficient
    return numerator / Math.sqrt(denominatorX * denominatorY);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available for the selected time range</p>
      </div>
    );
  }
  
  // Add a summary stats section at the top
  const renderSummaryStats = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Avg. Mood Rating</div>
        <div className="text-2xl font-bold">{averageMood}/10 
          <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${correlation > 0.4 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
            {correlation > 0.7 ? 'Strong' : correlation > 0.4 ? 'Good' : correlation > 0.2 ? 'Weak' : 'No'} correlation
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Avg. Sleep Quality</div>
        <div className="text-2xl font-bold">{averageSleepQuality}/5</div>
      </div>
    </div>
  );

  // Custom tooltip to show point details
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="font-medium">{dataPoint.date}</p>
          <div className="space-y-2 mt-1">
            <div className="flex items-center">
              <span className="text-xl mr-2">{moodEmojis[Math.min(10, Math.floor(dataPoint.mood))]}</span>
              <span className="font-semibold">Mood: {dataPoint.mood}/10</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
              <span>Sleep Quality: {sleepQualityDescriptions[dataPoint.sleepQuality]} ({dataPoint.sleepQuality}/5)</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span>Sleep Hours: {dataPoint.sleepHours} hours</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {renderSummaryStats()}

      <ResponsiveContainer width="100%" height={330}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 10]}
            tickCount={6}
            ticks={[0, 2, 4, 6, 8, 10]}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 5]}
            tickCount={6}
            ticks={[0, 1, 2, 3, 4, 5]}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="mood"
            name="Mood Rating"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMood)"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="sleepQuality"
            name="Sleep Quality"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSleep)"
          />
        </ComposedChart>
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