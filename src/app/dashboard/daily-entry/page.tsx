'use client';

import { useState, useEffect } from 'react';
import { MoodSection } from '@/components/daily-entry/MoodSection';
import { SleepSection } from '@/components/daily-entry/SleepSection';
import { ExerciseSection } from '@/components/daily-entry/ExerciseSection';
import { DietSection } from '@/components/daily-entry/DietSection';
import { DailyEntryData } from '@/types/daily-entry';
import { Progress } from "@/components/ui/progress";
import { Container } from "@/components/ui/container";
import { Smile, BicepsFlexed, Bed, Salad, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const steps = [
  {
    id: 'mood',
    title: 'Mood',
    description: 'How are you feeling today? Take a moment to reflect on your emotional state.',
    icon: Smile
  },
  {
    id: 'sleep',
    title: 'Sleep Quality',
    description: 'Good sleep is crucial for well-being. Let\'s track your rest.',
    icon: Bed
  },
  {
    id: 'exercise',
    title: 'Physical Activity',
    description: 'Movement matters! Share your activity level for the day.',
    icon: BicepsFlexed
  },
  {
    id: 'diet',
    title: 'Diet & Nutrition',
    description: 'You are what you eat. Track your nutrition and hydration.',
    icon: Salad
  }
];

const nullValues = {
  sleep: null,
  exercise: null,
  diet: null
};

const fullEntryDefaults = {
  sleep: {
    hours: 7,
    quality: 3
  },
  exercise: {
    didExercise: "no" as const,
    type: undefined,
    duration: undefined
  },
  diet: {
    rating: 3,
    foodChoices: [],
    waterIntake: "less-than-1l" as const
  }
};

const initialData: DailyEntryData = {
  mood: {
    rating: 3,
    notes: ""
  },
  ...fullEntryDefaults,
  date: new Date()
};

export default function DailyEntry() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DailyEntryData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuickEntry, setIsQuickEntry] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      toast.error('Please log in to continue');
    }
  }, [status, router]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/daily-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit daily entry');
      }

      const result = await response.json();
      console.log('Daily entry submitted:', result);

      toast.success('Your daily entry has been recorded');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting daily entry:', error);
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          toast.error('Session expired. Please log in again.');
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to submit your daily entry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickEntryToggle = (checked: boolean) => {
    setIsQuickEntry(checked);
    if (checked) {
      setCurrentStep(0); // Reset to mood section
      // Set other sections to null for quick entry
      setData(prev => ({
        mood: prev.mood,
        ...nullValues,
        date: prev.date
      }));
    } else {
      // Restore default values when switching back to full entry
      setData(prev => ({
        ...prev,
        ...fullEntryDefaults
      }));
    }
  };

  const handleQuickSubmit = async () => {
    if (!data.mood.rating) {
      toast.error('Please rate your mood before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/daily-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: data.mood,
          ...nullValues,
          date: new Date()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit daily entry');
      }

      const result = await response.json();
      console.log('Quick entry submitted:', result);

      toast.success('Your quick entry has been recorded');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting quick entry:', error);
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          toast.error('Session expired. Please log in again.');
          router.push('/login');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to submit your entry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepIcon = steps[currentStep].icon;

  // Don't render anything while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background pt-20 pb-10">
        <Container>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Container>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Daily Check-in</h1>
              <p className="text-muted-foreground">
                Track your well-being journey, one day at a time
              </p>
            </div>

            {/* Quick Entry Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <Label htmlFor="quick-entry">Quick Entry Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Having a tough day? Just log your mood and a quick note.
                  </p>
                </div>
              </div>
              <Switch
                id="quick-entry"
                checked={isQuickEntry}
                onCheckedChange={handleQuickEntryToggle}
              />
            </div>

            {!isQuickEntry && (
              /* Progress and Current Section Info */
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
                    <span className="font-medium">{steps[currentStep].title}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Current Section Description */}
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CurrentStepIcon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>
            )}

            {/* Current Section */}
            {(currentStep === 0 || isQuickEntry) && (
              <MoodSection
                data={data.mood}
                onChange={(mood) => setData({ ...data, mood })}
                onNext={isQuickEntry ? handleQuickSubmit : handleNext}
                isLastStep={isQuickEntry || currentStep === steps.length - 1}
                isSubmitting={isSubmitting}
                isQuickEntry={isQuickEntry}
              />
            )}

            {!isQuickEntry && currentStep === 1 && (
              <SleepSection
                data={data.sleep}
                onChange={(sleep) => setData({ ...data, sleep })}
                onNext={handleNext}
                onBack={handleBack}
                isLastStep={currentStep === steps.length - 1}
                isSubmitting={isSubmitting}
              />
            )}

            {!isQuickEntry && currentStep === 2 && (
              <ExerciseSection
                data={data.exercise}
                onChange={(exercise) => setData({ ...data, exercise })}
                onNext={handleNext}
                onBack={handleBack}
                isLastStep={currentStep === steps.length - 1}
                isSubmitting={isSubmitting}
              />
            )}

            {!isQuickEntry && currentStep === 3 && (
              <DietSection
                data={data.diet}
                onChange={(diet) => setData({ ...data, diet })}
                onNext={handleNext}
                onBack={handleBack}
                isLastStep={currentStep === steps.length - 1}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 