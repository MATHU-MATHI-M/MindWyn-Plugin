import { useState, useEffect } from 'react';
import { ApplicationUsage } from '../types/wellness';
import { useLocalStorage } from './useLocalStorage';

export function useApplicationTracking() {
  const [applicationUsage, setApplicationUsage] = useLocalStorage<ApplicationUsage[]>('mindwyn_app_usage', []);
  const [currentApp, setCurrentApp] = useState<string>('MindWyn');
  const [sessionStart, setSessionStart] = useState<number>(Date.now());

  const categorizeApplication = (appName: string): ApplicationUsage['category'] => {
    const studyApps = ['notion', 'obsidian', 'anki', 'khan academy', 'coursera', 'udemy', 'zoom', 'teams'];
    const socialApps = ['facebook', 'twitter', 'instagram', 'tiktok', 'snapchat', 'discord', 'whatsapp'];
    const entertainmentApps = ['youtube', 'netflix', 'spotify', 'twitch', 'reddit', 'gaming'];
    const productivityApps = ['gmail', 'calendar', 'trello', 'slack', 'asana', 'todoist'];

    const lowerAppName = appName.toLowerCase();

    if (studyApps.some(app => lowerAppName.includes(app))) return 'study';
    if (socialApps.some(app => lowerAppName.includes(app))) return 'social';
    if (entertainmentApps.some(app => lowerAppName.includes(app))) return 'entertainment';
    if (productivityApps.some(app => lowerAppName.includes(app))) return 'productivity';
    
    return 'other';
  };

  const calculateStressImpact = (category: ApplicationUsage['category'], timeSpent: number): number => {
    const baseImpact = {
      study: 0.2,
      productivity: -0.1,
      social: 0.3,
      entertainment: 0.1,
      other: 0
    };

    const timeMultiplier = Math.min(timeSpent / (1000 * 60 * 60), 2); // Cap at 2 hours
    return baseImpact[category] * timeMultiplier;
  };

  const trackApplicationSwitch = (newApp: string) => {
    const now = Date.now();
    const timeSpent = now - sessionStart;

    if (timeSpent > 5000 && currentApp !== 'MindWyn') { // Only track if spent more than 5 seconds
      const category = categorizeApplication(currentApp);
      const stressImpact = calculateStressImpact(category, timeSpent);

      const usage: ApplicationUsage = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: currentApp,
        category,
        timeSpent,
        timestamp: now,
        stressImpact
      };

      setApplicationUsage(prev => {
        const existingIndex = prev.findIndex(
          app => app.name === currentApp && 
          now - app.timestamp < 300000 // Within 5 minutes
        );

        if (existingIndex >= 0) {
          // Update existing entry
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            timeSpent: updated[existingIndex].timeSpent + timeSpent,
            timestamp: now
          };
          return updated;
        } else {
          // Add new entry
          return [...prev, usage];
        }
      });
    }

    setCurrentApp(newApp);
    setSessionStart(now);
  };

  const getUsageByCategory = () => {
    const categoryTotals = applicationUsage.reduce((acc, usage) => {
      acc[usage.category] = (acc[usage.category] || 0) + usage.timeSpent;
      return acc;
    }, {} as Record<ApplicationUsage['category'], number>);

    return Object.entries(categoryTotals).map(([category, time]) => ({
      category: category as ApplicationUsage['category'],
      time,
      percentage: (time / Object.values(categoryTotals).reduce((a, b) => a + b, 1)) * 100
    }));
  };

  const getTotalStressImpact = () => {
    return applicationUsage.reduce((total, usage) => total + usage.stressImpact, 0);
  };

  const getTopApplications = (limit: number = 5) => {
    return applicationUsage
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, limit);
  };

  return {
    applicationUsage,
    currentApp,
    getUsageByCategory,
    getTotalStressImpact,
    getTopApplications,
    trackApplicationSwitch
  };
}