import React from 'react';
import { Home, BarChart3, Settings, Heart, Wind, GamepadIcon, Music, Monitor, User } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'mood', icon: Heart, label: 'Mood' },
  { id: 'breathing', icon: Wind, label: 'Breathing' },
  { id: 'games', icon: GamepadIcon, label: 'Games' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'apps', icon: Monitor, label: 'App Usage' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-2 md:border-t-0 md:border-r md:w-16 md:h-screen md:py-6 overflow-x-auto md:overflow-x-visible">
      <div className="flex md:flex-col gap-1 md:gap-2 justify-start md:justify-start min-w-max md:min-w-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center justify-center gap-0 px-0 py-2 rounded-xl transition-all duration-200 w-12 h-12 mx-auto ${
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}