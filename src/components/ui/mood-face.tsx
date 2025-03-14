'use client'

interface MoodFaceProps {
  mood: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const moodPaths = {
  1: { // Very Sad
    eyes: "M15 25 Q17 23, 19 25 M31 25 Q33 23, 35 25",
    mouth: "M17 35 Q25 30, 33 35",
    eyebrows: "M13 20 Q17 18, 21 20 M29 20 Q33 18, 37 20"
  },
  2: { // Sad
    eyes: "M15 25 Q17 23, 19 25 M31 25 Q33 23, 35 25",
    mouth: "M17 35 Q25 33, 33 35",
    eyebrows: "M13 22 Q17 20, 21 22 M29 22 Q33 20, 37 22"
  },
  3: { // Neutral
    eyes: "M15 25 Q17 23, 19 25 M31 25 Q33 23, 35 25",
    mouth: "M17 35 H33",
    eyebrows: "M13 22 H21 M29 22 H37"
  },
  4: { // Good
    eyes: "M15 25 Q17 23, 19 25 M31 25 Q33 23, 35 25",
    mouth: "M17 35 Q25 37, 33 35",
    eyebrows: "M13 22 Q17 20, 21 22 M29 22 Q33 20, 37 22"
  },
  5: { // Very Good
    eyes: "M15 25 Q17 23, 19 25 M31 25 Q33 23, 35 25",
    mouth: "M17 33 Q25 40, 33 33",
    eyebrows: "M13 20 Q17 18, 21 20 M29 20 Q33 18, 37 20"
  }
};

const moodColors = {
  1: "#FFB5B5", // Light red
  2: "#FFD6A5", // Light orange
  3: "#FFFFA5", // Light yellow
  4: "#BDFFA5", // Light green
  5: "#A5D6FF", // Light blue
};

export function MoodFace({ mood, className = "" }: MoodFaceProps) {
  const paths = moodPaths[mood];
  const color = moodColors[mood];

  return (
    <svg
      viewBox="0 0 50 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Face circle */}
      <circle cx="25" cy="25" r="23" fill={color} stroke="currentColor" strokeWidth="1.5" />
      
      {/* Eyes */}
      <path d={paths.eyes} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Mouth */}
      <path d={paths.mouth} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Eyebrows */}
      <path d={paths.eyebrows} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
} 