'use client';

import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

interface MoodStatsProps {
  title: string;
  value: string;
  change: number;
  trend: 'increase' | 'decrease' | 'neutral';
  description: string;
}

export function MoodStats({ title, value, change, trend, description }: MoodStatsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-full p-2 ${
          trend === 'increase' 
            ? 'bg-green-100 text-green-600' 
            : trend === 'decrease' 
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {trend === 'increase' ? (
            <ArrowUp className="h-4 w-4" />
          ) : trend === 'decrease' ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={
          trend === 'increase'
            ? 'text-green-600'
            : trend === 'decrease'
            ? 'text-red-600'
            : 'text-gray-600'
        }>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </Card>
  );
} 