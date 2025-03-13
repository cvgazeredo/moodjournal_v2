'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

const entries = [
  {
    id: 1,
    mood: 8,
    note: "Had a great therapy session today. Feeling more confident and optimistic about the future.",
    date: "2024-03-13",
    time: "14:30",
    tags: ["Therapy", "Growth", "Optimism"],
  },
  {
    id: 2,
    mood: 6,
    note: "Feeling a bit overwhelmed with work, but managed to practice some mindfulness exercises.",
    date: "2024-03-12",
    time: "19:45",
    tags: ["Work", "Stress", "Mindfulness"],
  },
  {
    id: 3,
    mood: 9,
    note: "Spent quality time with family. These moments really boost my mood and energy levels.",
    date: "2024-03-11",
    time: "20:15",
    tags: ["Family", "Joy", "Connection"],
  },
];

export function RecentEntries() {
  return (
    <div className="space-y-8">
      {entries.map((entry) => (
        <div key={entry.id} className="flex gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {entry.mood}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {entry.note}
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Button key={tag} variant="outline" size="sm" className="h-7">
                  {tag}
                </Button>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{entry.time}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 