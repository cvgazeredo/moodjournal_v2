'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { MoodLineChart } from "@/components/statistics/MoodLineChart";
import { DietPieChart } from "@/components/statistics/DietPieChart";
import { MoodSleepCorrelationChart } from "@/components/statistics/MoodSleepCorrelationChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="min-h-screen bg-background pt-14 pb-10">
      <Container>
        <div className="space-y-6">
          {/* Header with integrated time range selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
              <p className="text-muted-foreground mt-1">
                Track your well-being journey with detailed insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Tabs defaultValue="monthly" className="w-auto">
                <TabsList>
                  <TabsTrigger value="weekly" onClick={() => setTimeRange('week')}>Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" onClick={() => setTimeRange('month')}>Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" onClick={() => setTimeRange('year')}>Annually</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Mood & Sleep Correlation Chart Section - First and prominent */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-1 mb-4">
                <h2 className="text-xl font-semibold">Mood & Sleep Quality Correlation</h2>
                <p className="text-sm text-muted-foreground">
                  Discover how your sleep patterns affect your daily mood
                </p>
              </div>
              <div className="h-[450px]">
                <MoodSleepCorrelationChart timeRange={timeRange} />
              </div>
            </CardContent>
          </Card>

          {/* Two column layout for secondary charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Chart Section */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-1 mb-4">
                  <h2 className="text-xl font-semibold">Mood Trends</h2>
                  <p className="text-sm text-muted-foreground">
                    Track how your mood changes over time
                  </p>
                </div>
                <div className="h-[300px]">
                  <MoodLineChart timeRange={timeRange} />
                </div>
              </CardContent>
            </Card>

            {/* Diet Chart Section */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-1 mb-4">
                  <h2 className="text-xl font-semibold">Diet Composition</h2>
                  <p className="text-sm text-muted-foreground">
                    Breakdown of your food choices
                  </p>
                </div>
                <div className="h-[300px]">
                  <DietPieChart timeRange={timeRange} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional statistics sections can be added here */}
        </div>
      </Container>
    </div>
  );
} 