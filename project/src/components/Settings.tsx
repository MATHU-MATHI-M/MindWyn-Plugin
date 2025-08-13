import React from 'react';
import { Bell, Shield, Moon, Smartphone, Download, FileText } from 'lucide-react';
import { InterventionConfig } from '../types/wellness';

interface SettingsProps {
  interventionConfig: InterventionConfig;
  onConfigChange: (config: InterventionConfig) => void;
  onExportPDF?: () => void;
}

export function Settings({ interventionConfig, onConfigChange, onExportPDF }: SettingsProps) {
  const updateConfig = (updates: Partial<InterventionConfig>) => {
    onConfigChange({ ...interventionConfig, ...updates });
  };

  const updateTriggers = (triggers: Partial<InterventionConfig['triggers']>) => {
    updateConfig({
      triggers: { ...interventionConfig.triggers, ...triggers }
    });
  };

  const updateTypes = (types: Partial<InterventionConfig['types']>) => {
    updateConfig({
      types: { ...interventionConfig.types, ...types }
    });
  };

  const exportData = () => {
    const data = {
      moodEntries: JSON.parse(localStorage.getItem('mindwyn_mood_entries') || '[]'),
      config: interventionConfig,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindwyn-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Wellness Interventions
        </h3>

        <div className="space-y-6">
          {/* Enable/Disable Interventions */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Enable Interventions</h4>
              <p className="text-sm text-gray-500">Receive wellness notifications and suggestions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={interventionConfig.enabled}
                onChange={(e) => updateConfig({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Intervention Triggers */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-800 mb-4">Intervention Triggers</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level Threshold: {(interventionConfig.triggers.stressLevel * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={interventionConfig.triggers.stressLevel}
                  onChange={(e) => updateTriggers({ stressLevel: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inactivity Time: {interventionConfig.triggers.inactivityTime / 60000} minutes
                </label>
                <input
                  type="range"
                  min="300000"
                  max="3600000"
                  step="300000"
                  value={interventionConfig.triggers.inactivityTime}
                  onChange={(e) => updateTriggers({ inactivityTime: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-700">Late Night Usage Alerts</h5>
                  <p className="text-sm text-gray-500">Warn when using the app late at night</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interventionConfig.triggers.lateNightUsage}
                    onChange={(e) => updateTriggers({ lateNightUsage: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Intervention Types */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-800 mb-4">Intervention Types</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(interventionConfig.types).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => updateTypes({ [type]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Privacy & Data
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 text-sm">
              <strong>🔒 Your data is secure:</strong> All information is stored locally on your device. 
              No data is sent to external servers or shared with third parties.
            </p>
          </div>

          <button
            onClick={exportData}
            className="flex items-center gap-2 w-full bg-blue-50 text-blue-700 px-4 py-3 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export My Data
          </button>

          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="flex items-center gap-2 w-full bg-green-50 text-green-700 px-4 py-3 rounded-xl hover:bg-green-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export Wellness Report (PDF)
            </button>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About MindWyn</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          MindWyn is an AI-powered digital wellness companion designed specifically for students. 
          Using advanced machine learning for behavioral analysis, personalized recommendations, 
          and stress relief activities, we help you maintain emotional well-being during your 
          academic journey. All processing is done locally to ensure your privacy.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">🧠</div>
            <div className="text-sm text-blue-800">ML Analysis</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">🎯</div>
            <div className="text-sm text-green-800">AI Recommendations</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">🎮</div>
            <div className="text-sm text-purple-800">Stress Relief Games</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">🎵</div>
            <div className="text-sm text-orange-800">Music Therapy</div>
          </div>
        </div>
        <p className="text-gray-500 text-xs">
          Version 2.0.0 • Enhanced with AI • Built with privacy in mind
        </p>
      </div>
    </div>
  );
}