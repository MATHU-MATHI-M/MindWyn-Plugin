import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
} from 'chart.js';
import { TrendingUp, Activity, Zap, Heart, Clock } from 'lucide-react';
import { MoodEntry, WellnessInsight } from '../types/wellness';

interface WellnessDashboardProps {
  moodEntries: MoodEntry[];
  latestInsight: WellnessInsight | null;
  sessionData?: {
    activeTime: number;
    tabSwitches: number;
    stressLevel: number;
  };
}

export function WellnessDashboard({ moodEntries, latestInsight, sessionData }: WellnessDashboardProps) {
  const last7Days = moodEntries.slice(-7);
  
  const chartData = {
    labels: last7Days.map(entry => 
      new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Mood',
        data: last7Days.map(entry => entry.mood),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Energy',
        data: last7Days.map(entry => entry.energy),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Stress',
        data: last7Days.map(entry => 5 - entry.stress), // Invert stress for better visualization
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStressLevelColor = (level: number) => {
    if (level < 0.3) return 'text-green-600 bg-green-50';
    if (level < 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStressLevelText = (level: number) => {
    if (level < 0.3) return 'Low';
    if (level < 0.6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Mood</p>
              <p className="text-xl font-semibold text-gray-800">
                {last7Days.length > 0 
                  ? (last7Days.reduce((sum, entry) => sum + entry.mood, 0) / last7Days.length).toFixed(1)
                  : '—'
                }/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Energy</p>
              <p className="text-xl font-semibold text-gray-800">
                {last7Days.length > 0 
                  ? (last7Days.reduce((sum, entry) => sum + entry.energy, 0) / last7Days.length).toFixed(1)
                  : '—'
                }/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stress Level</p>
              <p className={`text-xl font-semibold px-2 py-1 rounded-lg text-center ${
                sessionData ? getStressLevelColor(sessionData.stressLevel) : 'text-gray-400'
              }`}>
                {sessionData ? getStressLevelText(sessionData.stressLevel) : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Time</p>
              <p className="text-xl font-semibold text-gray-800">
                {sessionData ? formatTime(sessionData.activeTime) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Trends Chart */}
      {last7Days.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Weekly Wellness Trends
          </h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Latest Insight */}
      {latestInsight && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Latest Insight</h3>
          <p className="text-gray-700 mb-4">
            Based on your recent activity, your {latestInsight.type} level is{' '}
            <span className="font-semibold">
              {(latestInsight.level * 100).toFixed(0)}%
            </span>
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Suggestions:</p>
            <ul className="space-y-1">
              {latestInsight.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}