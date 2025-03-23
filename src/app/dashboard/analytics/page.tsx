'use client';

import { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoodTrendsChart } from "@/components/analytics/MoodTrendsChart";
import { SleepEnergyChart } from "@/components/analytics/SleepEnergyChart";
import { StressProductivityChart } from "@/components/analytics/StressProductivityChart";
import { ActivityHydrationChart } from "@/components/analytics/ActivityHydrationChart";
import { ProgressInsights } from "@/components/analytics/ProgressInsights";
import { AchievementBadges } from "@/components/analytics/AchievementBadges";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>('month');

  return (
    <Container>
      <div className="py-6 space-y-6">
        {/* Header with time range selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track your progress and gain insights into your well-being journey.</p>
          </div>
          <div className="w-full sm:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="3months">Past 3 Months</SelectItem>
                <SelectItem value="6months">Past 6 Months</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Key metrics */}
          <div className="space-y-6">
            {/* Mood Trends */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodTrendsChart timeRange={timeRange} />
              </CardContent>
            </Card>

            {/* Sleep and Energy */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sleep & Energy</CardTitle>
              </CardHeader>
              <CardContent>
                <SleepEnergyChart timeRange={timeRange} />
              </CardContent>
            </Card>

            {/* Stress and Productivity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stress & Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <StressProductivityChart timeRange={timeRange} />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Insights and achievements */}
          <div className="space-y-6">
            {/* Activity and Hydration */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Activity & Hydration</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityHydrationChart timeRange={timeRange} />
              </CardContent>
            </Card>

            {/* Progress Insights */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Progress Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressInsights timeRange={timeRange} />
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <AchievementBadges timeRange={timeRange} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
} 