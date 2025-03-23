'use client';

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { MoodStats } from "@/components/dashboard/MoodStats";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { MonthlyMoodTarget } from "@/components/dashboard/MonthlyMoodTarget";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";
import { NewEntryButton } from "@/components/dashboard/NewEntryButton";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <Container>
        <div className="grid gap-6">
          {/* Welcome Message */}
          <WelcomeMessage />
          
          {/* Top Stats */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <MoodStats
              title="Weekly Entries"
              value="5"
              change={12.5}
              trend="increase"
              description="entries this week"
            />
            <MoodStats
              title="Mood Average"
              value="7.8"
              change={2.3}
              trend="increase"
              description="out of 10"
            />
            <MoodStats
              title="Streak"
              value="12"
              change={0}
              trend="neutral"
              description="days in a row"
            />
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-2 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Mood Trends</h2>
                <p className="text-sm text-muted-foreground">
                  Your emotional journey over time
                </p>
              </div>
              <div className="h-[350px] mt-4">
                <MoodChart />
              </div>
            </Card>
            
            <Card className="p-6">
              <MonthlyMoodTarget />
            </Card>
          </div>

          {/* Recent Entries */}
          <Card className="p-6">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Recent Journal Entries</h2>
              <p className="text-sm text-muted-foreground">
                Your latest reflections and mood entries
              </p>
            </div>
            <RecentEntries />
          </Card>
        </div>
      </Container>
      
      {/* Floating action button for mobile */}
      <NewEntryButton />
    </div>
  );
} 