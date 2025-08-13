import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

interface BreathingExerciseProps {
  onComplete?: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);

  const phases = {
    inhale: { duration: 4, next: 'hold', instruction: 'Breathe in slowly...' },
    hold: { duration: 4, next: 'exhale', instruction: 'Hold your breath...' },
    exhale: { duration: 6, next: 'inhale', instruction: 'Breathe out slowly...' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && count > 0) {
      interval = setInterval(() => {
        setCount(count - 1);
      }, 1000);
    } else if (isActive && count === 0) {
      const currentPhase = phases[phase];
      const nextPhase = currentPhase.next as keyof typeof phases;
      
      if (phase === 'exhale') {
        setCycle(prev => prev + 1);
        if (cycle + 1 >= totalCycles) {
          setIsActive(false);
          onComplete?.();
          return;
        }
      }
      
      setPhase(nextPhase);
      setCount(phases[nextPhase].duration);
    }

    return () => clearInterval(interval);
  }, [isActive, count, phase, cycle, totalCycles, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  const getCircleScale = () => {
    const maxDuration = Math.max(...Object.values(phases).map(p => p.duration));
    const progress = (phases[phase].duration - count) / phases[phase].duration;
    
    if (phase === 'inhale') {
      return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
    } else if (phase === 'exhale') {
      return 1 - (progress * 0.5); // Scale from 1 to 0.5
    }
    return 1; // Hold phase
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-purple-400 to-purple-600';
      case 'exhale': return 'from-green-400 to-green-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
        <Wind className="w-5 h-5 text-blue-500" />
        Breathing Exercise
      </h3>

      <div className="relative mb-8">
        <div 
          className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ease-in-out flex items-center justify-center`}
          style={{ 
            transform: `scale(${getCircleScale()})`,
            boxShadow: `0 0 30px rgba(59, 130, 246, 0.3)`
          }}
        >
          <div className="text-white text-2xl font-bold">
            {count}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-gray-700 mb-2">
          {phases[phase].instruction}
        </p>
        <p className="text-sm text-gray-500">
          Cycle {cycle + 1} of {totalCycles}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {cycle >= totalCycles && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-700 font-medium">
            🎉 Great job! You've completed your breathing exercise.
          </p>
        </div>
      )}
    </div>
  );
}