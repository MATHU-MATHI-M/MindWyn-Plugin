import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { WellnessDashboard } from './components/WellnessDashboard';
import { MoodTracker } from './components/MoodTracker';
import { BreathingExercise } from './components/BreathingExercise';
import { Settings } from './components/Settings';
import { WellnessNotification } from './components/WellnessNotification';
import { AIRecommendations } from './components/AIRecommendations';
import { ApplicationTracker } from './components/ApplicationTracker';
import { StressReliefGames } from './components/StressReliefGames';
import { YouTubeMusicPlayer } from './components/YouTubeMusicPlayer';
import { StudentProfileComponent } from './components/StudentProfile';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useEnhancedBehavioralTracking } from './hooks/useEnhancedBehavioralTracking';
import { useApplicationTracking } from './hooks/useApplicationTracking';
import { MoodEntry, InterventionConfig, StudentProfile } from './types/wellness';
import { pdfExportService } from './utils/pdfExport';
import { Brain } from 'lucide-react';

const defaultInterventionConfig: InterventionConfig = {
  enabled: true,
  triggers: {
    stressLevel: 0.6,
    inactivityTime: 1800000, // 30 minutes
    lateNightUsage: true,
  },
  types: {
    breathing: true,
    mindfulness: true,
    movement: true,
    soundTherapy: false,
  },
};

const defaultStudentProfile: StudentProfile = {
  id: 'student_1',
  name: '',
  studyHours: 6,
  breakPreference: 15,
  stressThreshold: 0.7,
  academicGoals: [],
  courses: [],
  preferredInterventions: ['breathing', 'music']
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('mindwyn_mood_entries', []);
  const [interventionConfig, setInterventionConfig] = useLocalStorage<InterventionConfig>(
    'mindwyn_intervention_config',
    defaultInterventionConfig
  );
  const [studentProfile, setStudentProfile] = useLocalStorage<StudentProfile>(
    'mindwyn_student_profile',
    defaultStudentProfile
  );
  const [showNotification, setShowNotification] = useState(false);

  const { 
    currentSession, 
    latestInsight, 
    latestPrediction, 
    mlPredictions 
  } = useEnhancedBehavioralTracking();
  
  const { applicationUsage } = useApplicationTracking();

  // Handle mood entry submission
  const handleMoodSubmit = (moodData: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...moodData,
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setMoodEntries(prev => [...prev, newEntry]);
    setCurrentView('dashboard');
  };

  // Handle notification actions
  const handleNotificationAction = (action: string) => {
    switch (action) {
      case 'breathing':
        setCurrentView('breathing');
        break;
      case 'mood':
        setCurrentView('mood');
        break;
      case 'music':
        setCurrentView('music');
        break;
      case 'games':
        setCurrentView('games');
        break;
      case 'break':
        // Could trigger a break timer or reminder
        break;
      default:
        console.log(`Action taken: ${action}`);
    }
  };

  // Check for wellness notifications
  useEffect(() => {
    if (
      interventionConfig.enabled &&
      latestPrediction &&
      latestPrediction.stressLevel > interventionConfig.triggers.stressLevel
    ) {
      setShowNotification(true);
    }
  }, [latestPrediction, interventionConfig]);

  const sessionData = currentSession ? {
    activeTime: currentSession.activeTime,
    tabSwitches: currentSession.tabSwitches,
    stressLevel: latestPrediction?.stressLevel || 0,
  } : undefined;

  const handleExportPDF = async () => {
    try {
      await pdfExportService.exportWellnessReport({
        moodEntries,
        applicationUsage,
        predictions: mlPredictions,
        studentName: studentProfile.name || 'Student',
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          end: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };
  const handleViewChange = (view: string) => {
    console.log('Navigation clicked:', view);
    setCurrentView(view);
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'mood':
        return <MoodTracker onMoodSubmit={handleMoodSubmit} />;
      case 'breathing':
        return <BreathingExercise onComplete={() => setCurrentView('dashboard')} />;
      case 'games':
        return <StressReliefGames />;
      case 'music':
        return <YouTubeMusicPlayer />;
      case 'apps':
        return <ApplicationTracker />;
      case 'profile':
        return <StudentProfileComponent />;
      case 'analytics':
        return (
          <WellnessDashboard
            moodEntries={moodEntries}
            latestInsight={latestPrediction}
            sessionData={sessionData}
          />
        );
      case 'settings':
        return (
          <Settings
            interventionConfig={interventionConfig}
            onConfigChange={setInterventionConfig}
            onExportPDF={handleExportPDF}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome to MindWyn{studentProfile.name ? `, ${studentProfile.name}` : ''}
                  </h1>
                  <p className="text-blue-100">Your digital wellness companion</p>
                </div>
              </div>
              <p className="text-sm text-blue-100">
                AI-powered stress detection, personalized recommendations, and wellness tracking 
                designed specifically for students.
              </p>
            </div>

            {/* AI Recommendations */}
            <AIRecommendations
              prediction={latestPrediction}
              profile={studentProfile}
              onActionTaken={handleNotificationAction}
            />

            <WellnessDashboard
              moodEntries={moodEntries}
              latestInsight={latestPrediction}
              sessionData={sessionData}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Navigation */}
        <Navigation currentView={currentView} onViewChange={handleViewChange} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 md:max-w-4xl">
          {renderCurrentView()}
        </main>
      </div>

      {/* Wellness Notification */}
      {showNotification && (
        <WellnessNotification
          insight={latestInsight || {
            type: 'stress',
            level: latestPrediction?.stressLevel || 0,
            confidence: latestPrediction?.confidence || 0,
            timestamp: Date.now(),
            suggestions: latestPrediction?.factors || []
          }}
          onDismiss={() => setShowNotification(false)}
          onActionTaken={handleNotificationAction}
        />
      )}
    </div>
  );
}

export default App;