'use client';

import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, TrendingDown, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProgressInsightsProps {
  timeRange: string;
}

interface Insight {
  id: number;
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  actionable: string;
}

export function ProgressInsights({ timeRange }: ProgressInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API
        // For now, we'll generate sample insights
        
        // Sample insights pool
        const insightPool: Insight[] = [
          {
            id: 1,
            type: 'positive',
            title: 'Mood improvement',
            description: 'Your mood has improved by 15% compared to last month.',
            actionable: 'Continue your current routine to maintain this positive trend.'
          },
          {
            id: 2,
            type: 'negative',
            title: 'Sleep decline',
            description: 'Your average sleep has decreased from 7.5 to 6.8 hours.',
            actionable: 'Try going to bed 30 minutes earlier for the next week.'
          },
          {
            id: 3,
            type: 'neutral',
            title: 'Exercise consistency',
            description: 'Your exercise frequency has remained stable at 3 days per week.',
            actionable: 'Consider adding one more day of activity to see mood benefits.'
          },
          {
            id: 4,
            type: 'positive',
            title: 'Stress reduction',
            description: 'Your reported stress levels have decreased by 20%.',
            actionable: 'The meditation sessions appear to be working well for you.'
          },
          {
            id: 5,
            type: 'negative',
            title: 'Weekend mood dip',
            description: 'Your mood tends to decrease on Sundays by an average of 25%.',
            actionable: 'Consider planning enjoyable activities for Sunday evenings.'
          },
          {
            id: 6,
            type: 'positive',
            title: 'Hydration improvement',
            description: 'You\'ve consistently met your water intake goals this month.',
            actionable: 'Your improved hydration correlates with better mood scores.'
          },
          {
            id: 7,
            type: 'neutral',
            title: 'Productivity patterns',
            description: 'Your productivity peaks on Tuesdays and Wednesdays.',
            actionable: 'Schedule important tasks during these high-energy days.'
          }
        ];
        
        // Select 3 random insights based on time range
        // In a real app, these would be algorithmically generated
        const selectedInsights = [...insightPool]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        setInsights(selectedInsights);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Not enough data to generate insights yet. Keep logging your daily entries!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div 
          key={insight.id} 
          className={`p-4 rounded-lg border ${
            insight.type === 'positive' 
              ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900' 
              : insight.type === 'negative'
                ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900'
                : 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${
              insight.type === 'positive' 
                ? 'text-green-600 dark:text-green-400' 
                : insight.type === 'negative'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
            }`}>
              {insight.type === 'positive' ? (
                <TrendingUp className="h-5 w-5" />
              ) : insight.type === 'negative' ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Lightbulb className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              
              <div className="pt-2">
                <Button variant="link" className="h-auto p-0 text-xs flex items-center gap-1">
                  <span>{insight.actionable}</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 