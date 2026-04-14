"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

// Non-linear percentages so it doesn't feel like a boring 10, 20, 30...
const PERCENTAGE_MAP: Record<number, number> = {
  1: 8,
  2: 18,
  3: 26,
  4: 35,
  5: 47,
  6: 56,
  7: 68,
  8: 77,
  9: 86,
  10: 95,
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = PERCENTAGE_MAP[current] || Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="relative w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-right">
        {percentage}%
      </p>
    </div>
  );
}
