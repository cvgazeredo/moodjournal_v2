'use client';

export function MonthlyMoodTarget() {
  const progress = 75.55;
  const todayValue = 3287;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Monthly Target</h2>
        <p className="text-sm text-muted-foreground">
          Your mood tracking progress
        </p>
      </div>

      {/* Progress Circle */}
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <svg className="h-52 w-52 transform -rotate-90">
            <circle
              className="text-muted stroke-current"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
            <circle
              className="text-primary stroke-current"
              strokeWidth="8"
              strokeDasharray={565.48}
              strokeDashoffset={565.48 * (1 - progress / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold">{progress}%</span>
            <span className="text-sm text-muted-foreground">completed</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Today's Entries</span>
          <span className="font-medium">{todayValue}</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Keep up the good work! You're making great progress.
        </p>
      </div>
    </div>
  );
} 