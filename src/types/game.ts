export type GameState = 
  | 'MENU' 
  | 'CARD_DRAW' 
  | 'CARD_REVEALED' 
  | 'COUNTDOWN' 
  | 'WORKOUT' 
  | 'ROUND_SUMMARY';

export type ExerciseType = 
  | 'jumping_jacks' 
  | 'squats' 
  | 'high_knees' 
  | 'boxer_punches' 
  | 'overhead_claps'
  | 'butt_kicks'
  | 'standing_crunches'
  | 'front_kicks'
  | 'calf_raises'
  | 'arm_circles'
  | 'side_reach'
  | 'squat_pulses';

export interface ExerciseInfo {
  id: ExerciseType;
  titleTh: string;
  titleEn: string;
  categoryTh: string;
  descriptionTh: string;
  instructionsTh: string[];
  tipsTh: string;
  targetMusclesTh: string;
  imageSrc: string;
  difficulty: 'ง่าย (Easy)' | 'ปานกลาง (Medium)' | 'ท้าทาย (Hard)';
  defaultReps: number;
  caloriesPerRep: number;
  accentColor: 'cyan' | 'pink' | 'lime' | 'amber' | 'purple';
  metricGuide: string;
}

export interface FlashCard {
  cardId: string;
  exercise: ExerciseInfo;
  isFlipped: boolean;
  isSelected: boolean;
  bonusMultiplier: number;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface WorkoutSessionStats {
  exerciseId: ExerciseType;
  completedReps: number;
  targetReps: number;
  score: number;
  combo: number;
  maxCombo: number;
  caloriesBurned: number;
  accuracy: number;
  durationSeconds: number;
  stars: number;
}

export interface GlobalUserStats {
  totalReps: number;
  totalScore: number;
  totalCalories: number;
  workoutsCompleted: number;
  bestCombo: number;
}
