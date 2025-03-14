'use client'

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SectionProps, SleepData } from "@/types/daily-entry"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sleepQualityDescriptions = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Excellent'
}

export function SleepSection({ data, onChange, onNext, onBack, isLastStep }: SectionProps<SleepData>) {
  const getSleepQualityDescription = (quality: number) => {
    return sleepQualityDescriptions[quality as keyof typeof sleepQualityDescriptions] || quality.toString()
  }

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Sleep Duration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <Label htmlFor="sleep-hours" className="text-lg font-medium">
              How many hours did you sleep last night?
            </Label>
          </div>
          <Input
            id="sleep-hours"
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={data.hours}
            onChange={(e) => onChange({ ...data, hours: Number(e.target.value) })}
            className="max-w-[200px]"
          />
        </div>

        {/* Sleep Quality */}
        <div className="space-y-4">
          <Label htmlFor="sleep-quality" className="text-lg font-medium">
            How would you rate your sleep quality?
          </Label>
          <div className="space-y-3">
            <Slider
              id="sleep-quality"
              min={1}
              max={5}
              step={1}
              value={[data.quality]}
              onValueChange={(values) => onChange({ ...data, quality: values[0] })}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-5 w-full text-sm">
                {Object.entries(sleepQualityDescriptions).map(([value, label]) => (
                  <div
                    key={value}
                    className={cn(
                      "flex justify-between text-sm text-muted-foreground",
                      data.quality === Number(value) && "font-medium text-primary"
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        

        {/* Sleep Insights */}
        <div className="mt-6 rounded-lg bg-accent/50 p-4">
          <h3 className="font-medium mb-2">Sleep Insights</h3>
          <p className="text-sm text-muted-foreground">
            {data.hours < 6 ? (
              "You might not be getting enough sleep. Adults typically need 7-9 hours of sleep per night for optimal health."
            ) : data.hours > 9 ? (
              "While getting extra sleep occasionally is fine, consistently sleeping more than 9 hours might indicate other health concerns."
            ) : data.quality <= 2 ? (
              "Poor sleep quality can affect your mood and productivity. Consider establishing a regular bedtime routine."
            ) : (
              "You're maintaining a healthy sleep schedule! Keep up the good habits."
            )}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </Card>
  )
} 