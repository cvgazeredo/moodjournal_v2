'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Mon", mood: 7 },
  { date: "Tue", mood: 6 },
  { date: "Wed", mood: 8 },
  { date: "Thu", mood: 7 },
  { date: "Fri", mood: 9 },
  { date: "Sat", mood: 8 },
  { date: "Sun", mood: 8 },
];

export function MoodChart() {
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
          ticks={[0, 2, 4, 6, 8, 10]}
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