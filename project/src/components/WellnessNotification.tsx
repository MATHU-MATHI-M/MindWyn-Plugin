import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Smile, Coffee, Moon } from 'lucide-react';
import { WellnessInsight } from '../types/wellness';

interface WellnessNotificationProps {
  insight: WellnessInsight | null;
  onDismiss: () => void;
  onActionTaken: (action: string) => void;
}

const notificationIcons = {
  stress: AlertCircle,
  mood: Smile,
  energy: Coffee,
  focus: Moon,
};

const notificationColors = {
  stress: 'bg-red-50 border-red-200 text-red-800',
  mood: 'bg-blue-50 border-blue-200 text-blue-800',
  energy: 'bg-orange-50 border-orange-200 text-orange-800',
  focus: 'bg-purple-50 border-purple-200 text-purple-800',
};

export function WellnessNotification({ insight, onDismiss, onActionTaken }: WellnessNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (insight && insight.level > 0.6) {
      setIsVisible(true);
      
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [insight, onDismiss]);

  if (!insight || !isVisible) return null;

  const Icon = notificationIcons[insight.type];
  const colorClasses = notificationColors[insight.type];

  const handleActionClick = (action: string) => {
    onActionTaken(action);
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const getQuickActions = () => {
    switch (insight.type) {
      case 'stress':
        return [
          { label: 'Breathing Exercise', action: 'breathing' },
          { label: 'Take a Break', action: 'break' },
        ];
      case 'focus':
        return [
          { label: 'Quick Meditation', action: 'meditation' },
          { label: 'Organize Tasks', action: 'organize' },
        ];
      case 'energy':
        return [
          { label: 'Stretch Break', action: 'stretch' },
          { label: 'Hydrate', action: 'hydrate' },
        ];
      default:
        return [
          { label: 'Log Mood', action: 'mood' },
          { label: 'Quick Note', action: 'note' },
        ];
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm ${colorClasses}`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-1 capitalize">
              {insight.type} Alert
            </h4>
            <p className="text-sm opacity-90 mb-3">
              {insight.suggestions[0]}
            </p>
            
            <div className="flex gap-2 flex-wrap">
              {getQuickActions().map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleActionClick(action.action)}
                  className="px-3 py-1 text-xs bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-colors font-medium"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}