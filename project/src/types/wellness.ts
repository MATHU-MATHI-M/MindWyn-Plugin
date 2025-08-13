export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  stress: number; // 1-5 scale
  notes?: string;
  activities: string[];
}

export interface BehavioralData {
  sessionId: string;
  timestamp: number;
  tabSwitches: number;
  idleTime: number;
  activeTime: number;
  clickPatterns: number[];
  typingRhythm: number[];
  scrollBehavior: {
    speed: number;
    frequency: number;
  };
}

export interface WellnessInsight {
  type: 'stress' | 'focus' | 'energy' | 'mood';
  level: number; // 0-1 scale
  confidence: number;
  timestamp: number;
  suggestions: string[];
}

export interface InterventionConfig {
  enabled: boolean;
  triggers: {
    stressLevel: number;
    inactivityTime: number;
    lateNightUsage: boolean;
  };
  types: {
    breathing: boolean;
    mindfulness: boolean;
    movement: boolean;
    soundTherapy: boolean;
  };
}

export interface ApplicationUsage {
  id: string;
  name: string;
  category: 'study' | 'social' | 'entertainment' | 'productivity' | 'other';
  timeSpent: number;
  timestamp: number;
  stressImpact: number; // -1 to 1 scale
}

export interface StudentProfile {
  id: string;
  name: string;
  studyHours: number;
  breakPreference: number; // minutes
  stressThreshold: number;
  academicGoals: string[];
  courses: string[];
  preferredInterventions: string[];
}

export interface AIRecommendation {
  id: string;
  type: 'motivation' | 'activity' | 'music' | 'game' | 'quote';
  content: string;
  emoji: string;
  priority: number;
  timestamp: number;
}

export interface MLPrediction {
  stressLevel: number;
  focusLevel: number;
  energyLevel: number;
  confidence: number;
  factors: string[];
}