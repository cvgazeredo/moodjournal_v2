'use client'

import { Label } from "@/components/ui/label"
import { Dumbbell } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SectionProps, ExerciseData } from "@/types/daily-entry"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const exerciseTypes = [
  "Cardio",
  "Strength Training",
  "Yoga",
  "Pilates",
  "Swimming",
  "Cycling",
  "Running",
  "Walking",
  "Sports",
  "Other"
]

export function ExerciseSection({ data, onChange, onNext, onBack, isLastStep }: SectionProps<ExerciseData>) {
  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Exercise Check */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <Label className="text-lg font-medium">
              Did you exercise today?
            </Label>
          </div>
          <RadioGroup
            value={data.didExercise}
            onValueChange={(value: "yes" | "no") => 
              onChange({ ...data, didExercise: value })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="exercise-yes" />
              <Label htmlFor="exercise-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="exercise-no" />
              <Label htmlFor="exercise-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Exercise Details */}
        {data.didExercise === "yes" && (
          <>
            <div className="space-y-4">
              <Label htmlFor="exercise-type" className="text-lg font-medium">
                What type of exercise did you do?
              </Label>
              <Select
                value={data.type}
                onValueChange={(value) => onChange({ ...data, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="exercise-duration" className="text-lg font-medium">
                How long did you exercise? (minutes)
              </Label>
              <Input
                id="exercise-duration"
                type="number"
                min={0}
                value={data.duration}
                onChange={(e) => onChange({ ...data, duration: Number(e.target.value) })}
                className="max-w-[200px]"
              />
            </div>
          </>
        )}

        {/* Exercise Insights */}
        <div className="mt-6 rounded-lg bg-accent/50 p-4">
          <h3 className="font-medium mb-2">Exercise Insights</h3>
          <p className="text-sm text-muted-foreground">
            {data.didExercise === "yes" ? (
              data.duration && data.duration >= 30 ? (
                "Great job meeting the recommended daily exercise goal! Regular physical activity helps improve mood and overall health."
              ) : (
                "Any amount of exercise is beneficial! Try to aim for at least 30 minutes of moderate activity most days."
              )
            ) : (
              "Regular physical activity can boost your mood and energy levels. Even a short walk can make a difference!"
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