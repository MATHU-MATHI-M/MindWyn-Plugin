import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Music, GamepadIcon, Quote, RefreshCw } from 'lucide-react';
import { AIRecommendation, MLPrediction, StudentProfile } from '../types/wellness';
import { aiRecommendationEngine } from '../utils/aiRecommendations';

interface AIRecommendationsProps {
  prediction: MLPrediction | null;
  profile: StudentProfile;
  onActionTaken: (action: string) => void;
}

export function AIRecommendations({ prediction, profile, onActionTaken }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async () => {
    if (!prediction) return;

    setIsLoading(true);
    try {
      const timeOfDay = new Date().getHours();
      const newRecommendations = await aiRecommendationEngine.generatePersonalizedRecommendations(
        prediction,
        profile,
        timeOfDay
      );
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      // Fallback to emergency recommendations
      setRecommendations(aiRecommendationEngine.getEmergencyRecommendations());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [prediction]);

  const getIconForType = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'motivation': return Heart;
      case 'music': return Music;
      case 'game': return GamepadIcon;
      case 'quote': return Quote;
      default: return Sparkles;
    }
  };

  const getColorForPriority = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-50 border-red-200 text-red-800';
      case 2: return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const handleRecommendationClick = (recommendation: AIRecommendation) => {
    onActionTaken(recommendation.type);
    
    // Remove the clicked recommendation after a delay
    setTimeout(() => {
      setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    }, 1000);
  };

  if (!prediction) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Recommendations
        </h3>
        <p className="text-gray-500 text-center py-8">
          Start using MindWyn to get personalized AI recommendations!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Recommendations
        </h3>
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600">Generating personalized recommendations...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              You're doing great! Keep up the good work! 🌟
            </p>
          ) : (
            recommendations.map((recommendation) => {
              const Icon = getIconForType(recommendation.type);
              const colorClasses = getColorForPriority(recommendation.priority);

              return (
                <div
                  key={recommendation.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${colorClasses}`}
                  onClick={() => handleRecommendationClick(recommendation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white bg-opacity-80 rounded-lg">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{recommendation.emoji}</span>
                        <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                          {recommendation.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        {recommendation.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {prediction.stressLevel > 0.8 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 text-lg">🚨</span>
            <span className="font-medium text-red-800">High Stress Detected</span>
          </div>
          <p className="text-red-700 text-sm">
            Your stress levels are quite high. Consider taking a longer break or speaking with someone you trust.
          </p>
        </div>
      )}
    </div>
  );
}