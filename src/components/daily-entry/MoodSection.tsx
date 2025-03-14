'use client'

import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { 
  Frown, 
  MehIcon, 
  SmileIcon, 
  FrownIcon,
  Laugh,
  PencilLine,
  Zap
} from "lucide-react"
import { SectionProps, MoodData } from "@/types/daily-entry"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const moodOptions = [
  { 
    value: 1, 
    icon: FrownIcon, 
    color: "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50",
    iconColor: "text-red-700 dark:text-red-400"
  },
  { 
    value: 2, 
    icon: Frown, 
    color: "bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50",
    iconColor: "text-orange-700 dark:text-orange-400"
  },
  { 
    value: 3, 
    icon: MehIcon, 
    color: "bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
    iconColor: "text-yellow-700 dark:text-yellow-400"
  },
  { 
    value: 4, 
    icon: SmileIcon, 
    color: "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50",
    iconColor: "text-green-700 dark:text-green-400"
  },
  { 
    value: 5, 
    icon: Laugh, 
    color: "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50",
    iconColor: "text-blue-700 dark:text-blue-400"
  },
]

export function MoodSection({ data, onChange, onNext, isLastStep }: SectionProps<MoodData>) {
  const [isQuickEntry, setIsQuickEntry] = useState(false);

  const handleQuickSubmit = () => {
    if (onNext) {
      onChange({
        ...data,
      });
      onNext();
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Quick Entry Toggle */}
        

        {/* Mood Rating */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SmileIcon className="h-5 w-5 text-primary" />
            <Label htmlFor="mood-rating" className="text-lg font-medium">
              How are you feeling today?
            </Label>
          </div>
          <div className="flex justify-between gap-3">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                type="button"
                variant="outline"
                className={cn(
                  "flex-1 p-6 transition-all duration-200 border-2",
                  data.rating === mood.value 
                    ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-950 scale-105" 
                    : "hover:scale-105",
                  mood.color
                )}
                onClick={() => onChange({ ...data, rating: mood.value })}
              >
                <mood.icon
                  size={48} 
                  className={cn(
                    "w-10 h-10",
                    data.rating === mood.value 
                      ? "text-primary dark:text-primary" 
                      : mood.iconColor
                  )}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Mood Insights */}
        <div className="mt-6 rounded-lg bg-muted p-4 dark:bg-muted/50">
          <h3 className="font-medium mb-2">Mood Insights</h3>
          <p className="text-sm text-muted-foreground">
            {data.rating <= 2 ? (
              "Remember that it's okay to have low days. Consider talking to someone you trust or taking some time for self-care."
            ) : data.rating === 3 ? (
              "You're doing okay! Remember that every day is a new opportunity for positive experiences."
            ) : (
              "Wonderful to hear you're feeling great! Take note of what contributed to your positive mood today."
            )}
          </p>
        </div>

        {/* Mood Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-primary" />
            <Label htmlFor="mood-notes" className="text-lg font-medium">
              {isQuickEntry ? "Want to add a quick note?" : "Reflect on your mood today"}
            </Label>
          </div>
          <Textarea
            id="mood-notes"
            placeholder={isQuickEntry 
              ? "Optional: Add a brief note about how you're feeling..."
              : "What influenced your mood today? Any specific events, thoughts, or feelings you'd like to note down? This is your safe space to express yourself..."
            }
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            className="min-h-[120px]"
          />
          {!isQuickEntry && (
            <p className="text-sm text-muted-foreground">
              Writing about your feelings can help you understand them better and track your emotional patterns over time.
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-3 pt-4">
          {isQuickEntry ? (
            <Button 
              onClick={handleQuickSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Skip All & Submit
            </Button>
          ) : (
            <Button 
              onClick={onNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!data.rating}
            >
              {isLastStep ? "Submit" : "Next"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 