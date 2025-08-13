import { useState, useEffect, useCallback } from 'react';
import { BehavioralData, WellnessInsight, MLPrediction } from '../types/wellness';
import { mlAnalyzer } from '../utils/mlModels';

export function useEnhancedBehavioralTracking() {
  const [currentSession, setCurrentSession] = useState<BehavioralData | null>(null);
  const [insights, setInsights] = useState<WellnessInsight[]>([]);
  const [mlPredictions, setMlPredictions] = useState<MLPrediction[]>([]);
  const [behavioralMetrics, setBehavioralMetrics] = useState({
    typingSpeed: 0,
    mouseMovements: 0,
    scrollSpeed: 0,
    clickPatterns: [] as number[],
    keyboardRhythm: [] as number[]
  });

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

  const trackTyping = useCallback((event: KeyboardEvent) => {
    const now = Date.now();
    setBehavioralMetrics(prev => ({
      ...prev,
      keyboardRhythm: [...prev.keyboardRhythm.slice(-10), now]
    }));

    // Calculate typing speed (WPM approximation)
    const recentKeys = behavioralMetrics.keyboardRhythm.slice(-10);
    if (recentKeys.length >= 2) {
      const timeSpan = recentKeys[recentKeys.length - 1] - recentKeys[0];
      const wpm = (recentKeys.length / (timeSpan / 60000)) * 5; // Approximate words
      setBehavioralMetrics(prev => ({ ...prev, typingSpeed: wpm }));
    }
  }, [behavioralMetrics.keyboardRhythm]);

  const trackMouse = useCallback((event: MouseEvent) => {
    setBehavioralMetrics(prev => ({
      ...prev,
      mouseMovements: prev.mouseMovements + 1
    }));
  }, []);

  const trackClick = useCallback((event: MouseEvent) => {
    const now = Date.now();
    setBehavioralMetrics(prev => ({
      ...prev,
      clickPatterns: [...prev.clickPatterns.slice(-20), now]
    }));
  }, []);

  const trackScroll = useCallback((event: WheelEvent) => {
    const scrollDelta = Math.abs(event.deltaY);
    setBehavioralMetrics(prev => ({
      ...prev,
      scrollSpeed: (prev.scrollSpeed + scrollDelta) / 2
    }));
  }, []);

  const analyzeStressWithML = useCallback(async () => {
    if (!currentSession) return;

    const timeOfDay = new Date().getHours();
    const appCategory = 1; // Default to study category

    const behavioralData = {
      tabSwitches: currentSession.tabSwitches,
      typingSpeed: behavioralMetrics.typingSpeed,
      mouseMovements: behavioralMetrics.mouseMovements,
      scrollSpeed: behavioralMetrics.scrollSpeed,
      idleTime: currentSession.idleTime,
      activeTime: currentSession.activeTime,
      timeOfDay,
      appCategory
    };

    try {
      const prediction = await mlAnalyzer.analyzeStressLevel(behavioralData);
      
      const mlPrediction: MLPrediction = {
        stressLevel: prediction.stress,
        focusLevel: prediction.focus,
        energyLevel: prediction.energy,
        confidence: prediction.confidence,
        factors: [
          ...(prediction.stress > 0.7 ? ['High stress detected'] : []),
          ...(behavioralMetrics.typingSpeed > 80 ? ['Fast typing pace'] : []),
          ...(currentSession.tabSwitches > 20 ? ['Frequent tab switching'] : []),
          ...(behavioralMetrics.mouseMovements > 500 ? ['High mouse activity'] : [])
        ]
      };

      setMlPredictions(prev => [...prev.slice(-9), mlPrediction]);

      // Generate wellness insight
      const insight: WellnessInsight = {
        type: prediction.stress > 0.6 ? 'stress' : 'focus',
        level: prediction.stress,
        confidence: prediction.confidence,
        timestamp: Date.now(),
        suggestions: generateSuggestions(mlPrediction)
      };

      setInsights(prev => [...prev.slice(-9), insight]);
    } catch (error) {
      console.error('ML analysis failed:', error);
    }
  }, [currentSession, behavioralMetrics]);

  const generateSuggestions = (prediction: MLPrediction): string[] => {
    const suggestions: string[] = [];

    if (prediction.stressLevel > 0.7) {
      suggestions.push('Take a 5-minute breathing break');
      suggestions.push('Try some gentle stretching');
      suggestions.push('Listen to calming music');
    } else if (prediction.stressLevel > 0.5) {
      suggestions.push('Consider a short break');
      suggestions.push('Stay hydrated');
    }

    if (prediction.focusLevel < 0.4) {
      suggestions.push('Minimize distractions');
      suggestions.push('Try the Pomodoro technique');
    }

    if (prediction.energyLevel < 0.3) {
      suggestions.push('Take a power nap if possible');
      suggestions.push('Get some fresh air');
      suggestions.push('Have a healthy snack');
    }

    return suggestions.length > 0 ? suggestions : ['You\'re doing great! Keep it up!'];
  };

  useEffect(() => {
    startSession();
    mlAnalyzer.initializeModel();

    // Add event listeners for behavioral tracking
    document.addEventListener('keydown', trackTyping);
    document.addEventListener('mousemove', trackMouse);
    document.addEventListener('click', trackClick);
    document.addEventListener('wheel', trackScroll);

    // Analyze behavior every 30 seconds
    const analysisInterval = setInterval(analyzeStressWithML, 30000);

    // Reset metrics every 5 minutes
    const resetInterval = setInterval(() => {
      setBehavioralMetrics({
        typingSpeed: 0,
        mouseMovements: 0,
        scrollSpeed: 0,
        clickPatterns: [],
        keyboardRhythm: []
      });
    }, 300000);

    return () => {
      document.removeEventListener('keydown', trackTyping);
      document.removeEventListener('mousemove', trackMouse);
      document.removeEventListener('click', trackClick);
      document.removeEventListener('wheel', trackScroll);
      clearInterval(analysisInterval);
      clearInterval(resetInterval);
    };
  }, [startSession, trackTyping, trackMouse, trackClick, trackScroll, analyzeStressWithML]);

  return {
    currentSession,
    insights,
    mlPredictions,
    latestInsight: insights[insights.length - 1] || null,
    latestPrediction: mlPredictions[mlPredictions.length - 1] || null,
    behavioralMetrics
  };
}