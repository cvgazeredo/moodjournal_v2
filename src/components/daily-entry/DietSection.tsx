'use client'

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Apple, Droplets } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SectionProps, DietData, defaultDietData } from "@/types/daily-entry"
import { cn } from "@/lib/utils"

const foodCategories = [
  { 
    id: "fruits-veggies",
    label: "Fruits & Vegetables",
    description: "Fresh produce, salads, smoothies"
  },
  { 
    id: "whole-grains",
    label: "Whole Grains",
    description: "Brown rice, quinoa, oats, whole wheat"
  },
  { 
    id: "lean-protein",
    label: "Lean Protein",
    description: "Fish, chicken, legumes, tofu"
  },
  { 
    id: "healthy-fats",
    label: "Healthy Fats",
    description: "Avocado, nuts, olive oil"
  },
  { 
    id: "dairy-alternatives",
    label: "Dairy/Alternatives",
    description: "Yogurt, milk, plant-based alternatives"
  },
  { 
    id: "processed-foods",
    label: "Processed Foods",
    description: "Fast food, packaged snacks"
  },
  { 
    id: "sugary-items",
    label: "Sugary Items",
    description: "Sodas, desserts, candies"
  }
]

const waterOptions = [
  { value: "less-than-1l", label: "Less than 1L" },
  { value: "1l-1.5l", label: "1L – 1.5L" },
  { value: "1.5l-2l", label: "1.5L – 2L" },
  { value: "2l-plus", label: "2L+" },
] as const

const dietQualityDescriptions = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Excellent'
}

export function DietSection({ data, onChange, onNext, isLastStep, onBack }: SectionProps<DietData>) {
  // Ensure foodChoices is initialized
  const foodChoices = data.foodChoices ?? defaultDietData.foodChoices

  const getDietInsight = (choices: string[]) => {
    const healthyChoices = choices.filter(c => 
      ["fruits-veggies", "whole-grains", "lean-protein", "healthy-fats"].includes(c)
    )
    const unhealthyChoices = choices.filter(c => 
      ["processed-foods", "sugary-items"].includes(c)
    )
    const hasDairy = choices.includes("dairy-alternatives")

    // Build a comprehensive insight
    const insights: string[] = []

    // Analyze healthy choices
    if (healthyChoices.length >= 3) {
      insights.push("Great balance of nutritious foods! You're incorporating multiple food groups.")
    } else if (healthyChoices.length > 0) {
      insights.push("You've included some healthy options. Try to add more variety from different food groups.")
    } else {
      insights.push("Consider adding more whole foods to your diet for better nutrition.")
    }

    // Specific food group insights
    if (!choices.includes("fruits-veggies")) {
      insights.push("Try to include fruits and vegetables in your next meal.")
    }
    if (!choices.includes("whole-grains")) {
      insights.push("Whole grains provide essential fiber and nutrients.")
    }
    if (!choices.includes("lean-protein")) {
      insights.push("Include protein sources for energy and muscle health.")
    }
    if (!choices.includes("healthy-fats")) {
      insights.push("Healthy fats are important for brain function and nutrient absorption.")
    }

    // Analyze unhealthy choices
    if (unhealthyChoices.length === 0) {
      insights.push("Excellent job avoiding processed and sugary foods!")
    } else if (unhealthyChoices.length === 2) {
      insights.push("Consider reducing processed and sugary foods. Try healthier alternatives when possible.")
    }

    // Pick most relevant insights (max 2)
    return insights.slice(0, 2).join(" ")
  }

  const getHydrationInsight = (intake: DietData['waterIntake']) => {
    switch (intake) {
      case "less-than-1l":
        return "Try to increase your water intake. Staying hydrated is crucial for overall health."
      case "1l-1.5l":
        return "You're on the right track. Try to increase your intake to at least 1.5L for better hydration."
      case "1.5l-2l":
        return "Good job! You're maintaining a healthy hydration level."
      case "2l-plus":
        return "Excellent! You're well-hydrated, which is great for your overall health."
      default:
        return "Remember to stay hydrated throughout the day."
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Diet Rating */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            <Label className="text-lg font-medium">
              How would you rate your diet today?
            </Label>
          </div>
          <div className="space-y-3">
            <Slider
              value={[data.rating]}
              onValueChange={(value) => onChange({ ...data, rating: value[0] })}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-5 w-full text-sm">
                {Object.entries(dietQualityDescriptions).map(([value, label]) => (
                  <div
                    key={value}
                    className={cn(
                      "text-center text-muted-foreground",
                      data.rating === Number(value) && "font-medium text-primary"
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Food Choices and Diet Insights */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">
            What types of food did you eat today?
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/20"
              >
                <Checkbox
                  id={category.id}
                  checked={foodChoices.includes(category.id)}
                  onCheckedChange={(checked) => {
                    const newChoices = checked
                      ? [...foodChoices, category.id]
                      : foodChoices.filter(id => id !== category.id)
                    onChange({ ...data, foodChoices: newChoices })
                  }}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Diet Quality Insight */}
          <div className="rounded-lg bg-muted p-4 dark:bg-muted/50 mt-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Nutrition Insights
            </h3>
            <p className="text-sm text-muted-foreground">
              {getDietInsight(foodChoices)}
            </p>
          </div>
        </div>

        {/* Water Intake and Immediate Insight */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            <Label className="text-lg font-medium">
              How much water did you drink today?
            </Label>
          </div>
          
          <RadioGroup
            value={data.waterIntake}
            onValueChange={(value: DietData['waterIntake']) => 
              onChange({ ...data, waterIntake: value })
            }
            className="grid grid-cols-2 gap-4"
          >
            {waterOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                  className="peer"
                />
                <Label 
                  htmlFor={option.value}
                  className="flex-1 p-2 rounded-md peer-data-[state=checked]:text-primary"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Hydration Insight */}
          <div className="rounded-lg bg-muted p-4 dark:bg-muted/50">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Hydration Status
            </h3>
            <p className="text-sm text-muted-foreground">
              {getHydrationInsight(data.waterIntake)}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button 
            onClick={onBack}
            variant="outline"
            className="hover:bg-muted"
          >
            Back
          </Button>
          <Button 
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </Card>
  )
} 