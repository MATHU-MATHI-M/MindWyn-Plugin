import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Monitor, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApplicationTracking } from '../hooks/useApplicationTracking';

export function ApplicationTracker() {
  const { 
    applicationUsage, 
    getUsageByCategory, 
    getTotalStressImpact, 
    getTopApplications, 
    trackApplicationSwitch 
  } = useApplicationTracking();

  const [simulated, setSimulated] = useState(false);

  const categoryData = getUsageByCategory();
  const topApps = getTopApplications();
  const stressImpact = getTotalStressImpact();

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const categoryColors = {
    study: '#10B981',
    productivity: '#3B82F6',
    social: '#F59E0B',
    entertainment: '#EF4444',
    other: '#6B7280'
  };

  const doughnutData = {
    labels: categoryData.map(cat => cat.category.charAt(0).toUpperCase() + cat.category.slice(1)),
    datasets: [{
      data: categoryData.map(cat => cat.time / (1000 * 60)), // Convert to minutes
      backgroundColor: categoryData.map(cat => categoryColors[cat.category]),
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: topApps.map(app => app.name.length > 10 ? app.name.substring(0, 10) + '...' : app.name),
    datasets: [{
      label: 'Time Spent (minutes)',
      data: topApps.map(app => app.timeSpent / (1000 * 60)),
      backgroundColor: topApps.map(app => categoryColors[app.category]),
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getStressImpactColor = (impact: number) => {
    if (impact < -0.5) return 'text-green-600 bg-green-50';
    if (impact < 0) return 'text-blue-600 bg-blue-50';
    if (impact < 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStressImpactText = (impact: number) => {
    if (impact < -0.5) return 'Very Positive';
    if (impact < 0) return 'Positive';
    if (impact < 0.5) return 'Neutral';
    return 'Stressful';
  };

  // Simulate app usage for demo/testing
  const handleSimulate = () => {
    // Simulate switching to a few apps
    trackApplicationSwitch('Notion');
    setTimeout(() => trackApplicationSwitch('YouTube'), 1000);
    setTimeout(() => trackApplicationSwitch('Gmail'), 2000);
    setTimeout(() => trackApplicationSwitch('MindWyn'), 3000);
    setSimulated(true);
  };

  // Detect if running as a Chrome extension
  const isExtension = window.location.protocol === 'chrome-extension:';

  if (isExtension) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center text-gray-500 mt-8">
        App usage tracking is not available in the Chrome extension popup.<br/>
        Please use the web app for this feature.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applicationUsage.length === 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center text-gray-500 flex flex-col items-center gap-4">
          <div>
            <p className="mb-2">No application usage data available yet.</p>
            <p className="text-xs text-gray-400">App usage is tracked only in the web app, not in the Chrome extension popup.</p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
            onClick={handleSimulate}
            disabled={simulated}
          >
            {simulated ? 'Simulated!' : 'Simulate App Usage'}
          </button>
        </div>
      )}
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Apps Tracked</p>
              <p className="text-xl font-semibold text-gray-800">
                {new Set(applicationUsage.map(app => app.name)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="text-xl font-semibold text-gray-800">
                {formatTime(applicationUsage.reduce((sum, app) => sum + app.timeSpent, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stress Impact</p>
              <p className={`text-xl font-semibold px-2 py-1 rounded-lg text-center ${getStressImpactColor(stressImpact)}`}>
                {getStressImpactText(stressImpact)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Usage by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No application data available yet</p>
            </div>
          )}
        </div>

        {/* Top Applications */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-purple-500" />
            Top Applications
          </h3>
          {topApps.length > 0 ? (
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No application data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Application List */}
      {topApps.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h3>
          <div className="space-y-3">
            {topApps.map((app, index) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-800">{app.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{app.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{formatTime(app.timeSpent)}</p>
                  <p className={`text-xs px-2 py-1 rounded ${getStressImpactColor(app.stressImpact)}`}>
                    {app.stressImpact > 0 ? '+' : ''}{app.stressImpact.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}