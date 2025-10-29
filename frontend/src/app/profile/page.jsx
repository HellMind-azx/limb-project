'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getStoredUser, setStoredUser } from '@/lib/auth';
import api from '@/lib/api';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    notifications: true,
    email_notifications: true,
    weekly_reports: true
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setPersonalInfo({
        first_name: storedUser.first_name || '',
        last_name: storedUser.last_name || '',
        email: storedUser.email || '',
        username: storedUser.username || ''
      });
    }
    
    loadStats();
    setLoading(false);
  }, [router]);

  const loadStats = async () => {
    try {
      const response = await api.get('/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await api.put('/auth/profile/', personalInfo);
      const updatedUser = response.data.user;
      setStoredUser(updatedUser);
      setUser(updatedUser);
      showMessage('success', 'Personal information updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    
    setSaving(true);
    
    try {
      await api.post('/auth/change-password/', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      showMessage('success', 'Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put('/auth/preferences/', preferences);
      showMessage('success', 'Preferences updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-32 w-32" style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          border: '4px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: 'rgb(99, 102, 241)'
        }}></div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'statistics', label: 'Statistics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen" style={{ position: 'relative' }}>
      {/* Background blobs */}
      <div className="blob" style={{ top: '20%', right: '-5%', width: '400px', height: '400px', background: 'linear-gradient(135deg, rgba(99, 102, 246, 0.1), rgba(6, 182, 212, 0.1))', animationDelay: '0s' }}></div>
      <div className="blob" style={{ bottom: '30%', left: '-5%', width: '500px', height: '500px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(245, 158, 11, 0.08))', animationDelay: '5s' }}></div>

      <main className="container py-8" style={{ position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="holographic">Profile</span> Settings
          </h1>
          <p className="text-secondary">Manage your account and preferences</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.type === 'success' 
              ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30' 
              : 'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="card card-glass-neuro p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary bg-opacity-20 text-primary-color'
                    : 'text-secondary hover:text-primary-color hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="card card-glass-frosted p-8">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-input form-input-glass-neuro"
                        value={personalInfo.first_name}
                        onChange={(e) => setPersonalInfo({...personalInfo, first_name: e.target.value})}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-input form-input-glass-neuro"
                        value={personalInfo.last_name}
                        onChange={(e) => setPersonalInfo({...personalInfo, last_name: e.target.value})}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input form-input-glass-neuro"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-input form-input-glass-neuro"
                      value={personalInfo.username}
                      onChange={(e) => setPersonalInfo({...personalInfo, username: e.target.value})}
                      placeholder="Enter your username"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-glass-neuro px-6 py-3"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="card card-glass-frosted p-8">
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input form-input-glass-neuro"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input form-input-glass-neuro"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input form-input-glass-neuro"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-glass-neuro px-6 py-3"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="card card-glass-frosted p-8">
                <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                <form onSubmit={handlePreferencesSubmit}>
                  <div className="form-group">
                    <label className="form-label">Theme</label>
                    <select
                      className="form-input form-input-glass-neuro"
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      className="form-input form-input-glass-neuro"
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="form-label mb-0">Push Notifications</label>
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={preferences.notifications}
                        onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="form-label mb-0">Email Notifications</label>
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={preferences.email_notifications}
                        onChange={(e) => setPreferences({...preferences, email_notifications: e.target.checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="form-label mb-0">Weekly Reports</label>
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={preferences.weekly_reports}
                        onChange={(e) => setPreferences({...preferences, weekly_reports: e.target.checked})}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-glass-neuro px-6 py-3 mt-6"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </form>
              </div>
            )}

            {/* Statistics */}
            {activeTab === 'statistics' && (
              <div className="card card-glass-frosted p-8">
                <h2 className="text-2xl font-bold mb-6">Your Statistics</h2>
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-primary bg-opacity-10 rounded-lg">
                      <div className="text-3xl font-bold text-primary-color mb-2">
                        {stats.total_habits || 0}
                      </div>
                      <div className="text-secondary">Total Habits</div>
                    </div>
                    <div className="text-center p-6 bg-accent-1 bg-opacity-10 rounded-lg">
                      <div className="text-3xl font-bold text-accent-1 mb-2">
                        {stats.today_completion_rate || 0}%
                      </div>
                      <div className="text-secondary">Today's Progress</div>
                    </div>
                    <div className="text-center p-6 bg-accent-2 bg-opacity-10 rounded-lg">
                      <div className="text-3xl font-bold text-accent-2 mb-2">
                        {stats.week_completion_rate || 0}%
                      </div>
                      <div className="text-secondary">Weekly Progress</div>
                    </div>
                    <div className="text-center p-6 bg-accent-3 bg-opacity-10 rounded-lg">
                      <div className="text-3xl font-bold text-accent-3 mb-2">
                        {stats.longest_streak || 0}
                      </div>
                      <div className="text-secondary">Longest Streak</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-secondary">No statistics available yet</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Avatar */}
            <div className="card card-glass-neuro p-6 mb-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-primary to-accent-1 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {user?.first_name || user?.username}
              </h3>
              <p className="text-secondary text-sm mb-4">
                {user?.email}
              </p>
              <button className="btn btn-outline btn-sm">
                Change Avatar
              </button>
            </div>

            {/* Quick Stats */}
            <div className="card card-glass-light p-6">
              <h4 className="font-bold mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Member since</span>
                  <span className="font-medium">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Last login</span>
                  <span className="font-medium">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Total habits</span>
                  <span className="font-medium">{stats?.total_habits || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
