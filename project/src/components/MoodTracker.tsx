import React, { useState } from 'react';
import { Smile, Meh, Frown, Battery, Zap, Heart } from 'lucide-react';
import { MoodEntry } from '../types/wellness';

interface MoodTrackerProps {
  onMoodSubmit: (mood: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
}

const moodIcons = [
  { icon: Frown, label: 'Very Low', color: 'text-red-500' },
  { icon: Frown, label: 'Low', color: 'text-orange-500' },
  { icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
  { icon: Smile, label: 'Good', color: 'text-green-500' },
  { icon: Smile, label: 'Excellent', color: 'text-green-600' }
];

const activities = [
  'Work/Study', 'Exercise', 'Social', 'Rest', 'Creative', 'Meditation'
];

export function MoodTracker({ onMoodSubmit }: MoodTrackerProps) {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMoodSubmit({
      mood,
      energy,
      stress,
      notes: notes.trim() || undefined,
      activities: selectedActivities
    });
    
    // Reset form
    setMood(3);
    setEnergy(3);
    setStress(3);
    setNotes('');
    setSelectedActivities([]);
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-pink-500" />
        How are you feeling?
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Mood</label>
          <div className="flex justify-between gap-2">
            {moodIcons.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMood(index + 1)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    mood === index + 1
                      ? 'bg-blue-100 scale-110 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent 
                    className={`w-6 h-6 ${mood === index + 1 ? item.color : 'text-gray-400'}`} 
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Battery className="w-4 h-4" />
            Energy Level: {energy}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Stress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Stress Level: {stress}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Current Activities</label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivity(activity)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedActivities.includes(activity)
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? Any specific thoughts?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
        >
          Save Mood Entry
        </button>
      </form>
    </div>
  );
}