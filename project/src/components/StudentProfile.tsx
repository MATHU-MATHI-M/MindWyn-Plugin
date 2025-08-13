import React, { useState } from 'react';
import { User, BookOpen, Target, Clock, Save } from 'lucide-react';
import { StudentProfile } from '../types/wellness';
import { useLocalStorage } from '../hooks/useLocalStorage';

const defaultProfile: StudentProfile = {
  id: 'student_1',
  name: '',
  studyHours: 6,
  breakPreference: 15,
  stressThreshold: 0.7,
  academicGoals: [],
  courses: [],
  preferredInterventions: ['breathing', 'music']
};

export function StudentProfileComponent() {
  const [profile, setProfile] = useLocalStorage<StudentProfile>('mindwyn_student_profile', defaultProfile);
  const [isEditing, setIsEditing] = useState(!profile.name);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const addGoal = () => {
    const goal = prompt('Enter a new academic goal:');
    if (goal && goal.trim()) {
      setTempProfile(prev => ({
        ...prev,
        academicGoals: [...prev.academicGoals, goal.trim()]
      }));
    }
  };

  const removeGoal = (index: number) => {
    setTempProfile(prev => ({
      ...prev,
      academicGoals: prev.academicGoals.filter((_, i) => i !== index)
    }));
  };

  const addCourse = () => {
    const course = prompt('Enter a course name:');
    if (course && course.trim()) {
      setTempProfile(prev => ({
        ...prev,
        courses: [...prev.courses, course.trim()]
      }));
    }
  };

  const removeCourse = (index: number) => {
    setTempProfile(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const toggleIntervention = (intervention: string) => {
    setTempProfile(prev => ({
      ...prev,
      preferredInterventions: prev.preferredInterventions.includes(intervention)
        ? prev.preferredInterventions.filter(i => i !== intervention)
        : [...prev.preferredInterventions, intervention]
    }));
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Student Profile
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-800 font-medium">{profile.name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Study Hours</label>
              <p className="text-gray-800 font-medium">{profile.studyHours} hours</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Break Preference</label>
              <p className="text-gray-800 font-medium">{profile.breakPreference} minutes</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stress Alert Threshold</label>
              <p className="text-gray-800 font-medium">{(profile.stressThreshold * 100).toFixed(0)}%</p>
            </div>
          </div>

          {/* Academic Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Goals</label>
            {profile.academicGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.academicGoals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No goals set</p>
            )}
          </div>

          {/* Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Courses</label>
            {profile.courses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.courses.map((course, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {course}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No courses added</p>
            )}
          </div>

          {/* Preferred Interventions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Stress Relief</label>
            <div className="flex flex-wrap gap-2">
              {profile.preferredInterventions.map((intervention, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm capitalize"
                >
                  {intervention}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Edit Student Profile
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setTempProfile(profile);
              setIsEditing(false);
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={tempProfile.name}
              onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Study Hours: {tempProfile.studyHours}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={tempProfile.studyHours}
              onChange={(e) => setTempProfile(prev => ({ ...prev, studyHours: Number(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Preference: {tempProfile.breakPreference} minutes
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={tempProfile.breakPreference}
              onChange={(e) => setTempProfile(prev => ({ ...prev, breakPreference: Number(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Alert Threshold: {(tempProfile.stressThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.1"
              value={tempProfile.stressThreshold}
              onChange={(e) => setTempProfile(prev => ({ ...prev, stressThreshold: Number(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Academic Goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Academic Goals</label>
            <button
              onClick={addGoal}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              + Add Goal
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tempProfile.academicGoals.map((goal, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
              >
                {goal}
                <button
                  onClick={() => removeGoal(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Current Courses</label>
            <button
              onClick={addCourse}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              + Add Course
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tempProfile.courses.map((course, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
              >
                {course}
                <button
                  onClick={() => removeCourse(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Interventions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Stress Relief Methods</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['breathing', 'music', 'games', 'mindfulness', 'movement', 'quotes'].map((intervention) => (
              <label
                key={intervention}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={tempProfile.preferredInterventions.includes(intervention)}
                  onChange={() => toggleIntervention(intervention)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm capitalize">{intervention}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}