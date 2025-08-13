import { AIRecommendation, MLPrediction, StudentProfile } from '../types/wellness';

const GEMINI_API_KEY = 'AIzaSyAPF4g-UA7vqRYghFNLY99dr4uf14_DMPY';

export class AIRecommendationEngine {
  private motivationalQuotes = [
    { text: "You're stronger than you think! 💪", emoji: "💪" },
    { text: "Take it one step at a time 🌟", emoji: "🌟" },
    { text: "Progress, not perfection! 🎯", emoji: "🎯" },
    { text: "You've got this! Believe in yourself 🌈", emoji: "🌈" },
    { text: "Every challenge is a chance to grow 🌱", emoji: "🌱" },
    { text: "Breathe, focus, achieve ✨", emoji: "✨" },
    { text: "Your potential is limitless! 🚀", emoji: "🚀" },
    { text: "Small steps lead to big changes 👣", emoji: "👣" }
  ];

  private stressReliefActivities = [
    { activity: "Take 5 deep breaths", emoji: "🫁", type: "breathing" },
    { activity: "Listen to calming music", emoji: "🎵", type: "music" },
    { activity: "Do a quick stretch", emoji: "🤸", type: "movement" },
    { activity: "Play a relaxing game", emoji: "🎮", type: "game" },
    { activity: "Write down 3 things you're grateful for", emoji: "📝", type: "mindfulness" },
    { activity: "Look at something green or nature", emoji: "🌿", type: "visual" },
    { activity: "Drink some water", emoji: "💧", type: "health" },
    { activity: "Take a 2-minute walk", emoji: "🚶", type: "movement" }
  ];

  async generatePersonalizedRecommendations(
    prediction: MLPrediction,
    profile: StudentProfile,
    timeOfDay: number
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Add immediate stress relief if stress is high
    if (prediction.stressLevel > 0.7) {
      const stressActivity = this.stressReliefActivities[
        Math.floor(Math.random() * this.stressReliefActivities.length)
      ];
      
      recommendations.push({
        id: `stress_${Date.now()}`,
        type: 'activity',
        content: stressActivity.activity,
        emoji: stressActivity.emoji,
        priority: 1,
        timestamp: Date.now()
      });
    }

    // Add motivational quote
    const quote = this.motivationalQuotes[
      Math.floor(Math.random() * this.motivationalQuotes.length)
    ];
    
    recommendations.push({
      id: `quote_${Date.now()}`,
      type: 'quote',
      content: quote.text,
      emoji: quote.emoji,
      priority: prediction.stressLevel > 0.5 ? 2 : 3,
      timestamp: Date.now()
    });

    // Add time-based recommendations
    if (timeOfDay > 22 || timeOfDay < 6) {
      recommendations.push({
        id: `sleep_${Date.now()}`,
        type: 'activity',
        content: "Consider winding down for better sleep 😴",
        emoji: "😴",
        priority: 2,
        timestamp: Date.now()
      });
    }

    // Add AI-generated recommendation if available
    try {
      const aiRecommendation = await this.getGeminiRecommendation(prediction, profile);
      if (aiRecommendation) {
        recommendations.push(aiRecommendation);
      }
    } catch (error) {
      console.error('Failed to get AI recommendation:', error);
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  private async getGeminiRecommendation(
    prediction: MLPrediction,
    profile: StudentProfile
  ): Promise<AIRecommendation | null> {
    try {
      const prompt = `As a wellness AI, provide a personalized recommendation for a student with:
      - Stress level: ${(prediction.stressLevel * 100).toFixed(0)}%
      - Focus level: ${(prediction.focusLevel * 100).toFixed(0)}%
      - Energy level: ${(prediction.energyLevel * 100).toFixed(0)}%
      - Study hours: ${profile.studyHours}
      - Academic goals: ${profile.academicGoals.join(', ')}
      
      Provide a short, encouraging message (max 50 words) with an appropriate emoji.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (content) {
        return {
          id: `ai_${Date.now()}`,
          type: 'motivation',
          content: content.trim(),
          emoji: "🤖",
          priority: 1,
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }

    return null;
  }

  getEmergencyRecommendations(): AIRecommendation[] {
    return [
      {
        id: `emergency_${Date.now()}`,
        type: 'activity',
        content: "Take 10 deep breaths right now 🫁",
        emoji: "🫁",
        priority: 1,
        timestamp: Date.now()
      },
      {
        id: `emergency_music_${Date.now()}`,
        type: 'music',
        content: "Listen to calming music for 5 minutes 🎵",
        emoji: "🎵",
        priority: 1,
        timestamp: Date.now()
      }
    ];
  }
}

export const aiRecommendationEngine = new AIRecommendationEngine();