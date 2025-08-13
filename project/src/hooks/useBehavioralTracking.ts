import { useState, useEffect, useCallback } from 'react';
import { BehavioralData, WellnessInsight } from '../types/wellness';

export function useBehavioralTracking() {
  const [currentSession, setCurrentSession] = useState<BehavioralData | null>(null);
  const [insights, setInsights] = useState<WellnessInsight[]>([]);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const startSession = useCallback(() => {
    const session: BehavioralData = {
      sessionId: generateSessionId(),
      timestamp: Date.now(),
      tabSwitches: 0,
      idleTime: 0,
      activeTime: 0,
      clickPatterns: [],
      typingRhythm: [],
      scrollBehavior: {
        speed: 0,
        frequency: 0
      }
    };
    setCurrentSession(session);
  }, []);

  const analyzeStressLevel = useCallback((data: BehavioralData): number => {
    // Simple stress detection algorithm
    const tabSwitchFactor = Math.min(data.tabSwitches / 20, 1);
    const idleFactor = data.idleTime > 300000 ? 0.3 : 0; // 5 min idle = stress reduction
    const activityFactor = data.activeTime > 7200000 ? 0.8 : 0; // 2 hours = high stress
    
    return Math.max(0, Math.min(1, tabSwitchFactor + activityFactor - idleFactor));
  }, []);

  const generateInsights = useCallback((data: BehavioralData) => {
    const stressLevel = analyzeStressLevel(data);
    
    const insight: WellnessInsight = {
      type: 'stress',
      level: stressLevel,
      confidence: 0.7,
      timestamp: Date.now(),
      suggestions: stressLevel > 0.6 ? [
        'Take a 5-minute breathing break',
        'Step away from the screen for a moment',
        'Try some gentle stretching'
      ] : [
        'You\'re doing great! Keep maintaining this pace',
        'Stay hydrated',
        'Take regular breaks'
      ]
    };

    setInsights(prev => [...prev.slice(-9), insight]);
  }, [analyzeStressLevel]);

  useEffect(() => {
    startSession();

    const interval = setInterval(() => {
      if (currentSession) {
        generateInsights(currentSession);
      }
    }, 60000); // Analyze every minute

    return () => {
      clearInterval(interval);
    };
  }, [currentSession, generateInsights, startSession]);

  return {
    currentSession,
    insights,
    latestInsight: insights[insights.length - 1] || null
  };
}