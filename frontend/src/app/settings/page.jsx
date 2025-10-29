'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getPreferences, updatePreferences, changePassword } from '@/lib/api';
import { 
  FiSettings, 
  FiBell, 
  FiTarget,
  FiActivity,
  FiUsers,
  FiLock,
  FiBook,
  FiCheck,
  FiX,
  FiLoader,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import styles from './settings.module.scss';

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Notification preferences
  const [preferences, setPreferences] = useState({
    notifications: true,
    email_notifications: true,
    weekly_reports: true,
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadPreferences();
  }, [router]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await getPreferences();
      setPreferences(data);
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarNavigation = (path) => {
    router.push(path);
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await updatePreferences(preferences);
      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err.response?.data?.error || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordData.current_password || !passwordData.new_password) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <FiLoader size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div 
          className={`${styles.sidebarIcon} ${pathname === '/habits' ? styles.active : ''}`}
          onClick={() => handleSidebarNavigation('/habits')}
        >
          <FiTarget size={20} />
        </div>
        <div 
          className={`${styles.sidebarIcon} ${pathname === '/settings' ? styles.active : ''}`}
          onClick={() => handleSidebarNavigation('/settings')}
        >
          <FiSettings size={20} />
        </div>
        <div 
          className={`${styles.sidebarIcon} ${pathname === '/notifications' ? styles.active : ''}`}
          onClick={() => handleSidebarNavigation('/notifications')}
        >
          <FiBell size={20} />
        </div>
        <div 
          className={`${styles.sidebarIcon} ${pathname === '/activity' ? styles.active : ''}`}
          onClick={() => handleSidebarNavigation('/activity')}
        >
          <FiActivity size={20} />
        </div>
        <div 
          className={`${styles.sidebarIcon} ${pathname === '/users' ? styles.active : ''}`}
          onClick={() => handleSidebarNavigation('/users')}
        >
          <FiUsers size={20} />
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.primaryText}>Settings</span>
          </h1>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={styles.errorCard}>
            <div className={styles.errorText}>{error}</div>
            <button 
              onClick={() => setError(null)}
              className={styles.closeButton}
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className={styles.successCard}>
            <div className={styles.successText}>{success}</div>
            <button 
              onClick={() => setSuccess(null)}
              className={styles.closeButton}
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Notification Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <FiBell size={24} />
            <h2 className={styles.cardTitle}>Notification Settings</h2>
          </div>
          
          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Enable Notifications</div>
                <div className={styles.settingDescription}>
                  Receive notifications about your habits and progress
                </div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Email Notifications</div>
                <div className={styles.settingDescription}>
                  Receive email updates about your progress
                </div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={preferences.email_notifications}
                  onChange={(e) => handlePreferenceChange('email_notifications', e.target.checked)}
                  disabled={!preferences.notifications}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Weekly Reports</div>
                <div className={styles.settingDescription}>
                  Get weekly summaries of your habit progress
                </div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={preferences.weekly_reports}
                  onChange={(e) => handlePreferenceChange('weekly_reports', e.target.checked)}
                  disabled={!preferences.notifications}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? (
              <>
                <FiLoader size={16} className={styles.spinner} />
                Saving...
              </>
            ) : (
              <>
                <FiCheck size={16} />
                Save Preferences
              </>
            )}
          </button>
        </div>

        {/* Change Password */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <FiLock size={24} />
            <h2 className={styles.cardTitle}>Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className={styles.passwordForm}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Current Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className={styles.passwordInput}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  className={styles.passwordToggle}
                >
                  {showPasswords.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>New Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className={styles.passwordInput}
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  className={styles.passwordToggle}
                >
                  {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Confirm New Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className={styles.passwordInput}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  className={styles.passwordToggle}
                >
                  {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? (
                <>
                  <FiLoader size={16} className={styles.spinner} />
                  Changing Password...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Habits Guide */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <FiBook size={24} />
            <h2 className={styles.cardTitle}>Habits Guide</h2>
          </div>

          <div className={styles.guideContent}>
            <section className={styles.guideSection}>
              <h3 className={styles.guideSectionTitle}>Getting Started</h3>
              <p className={styles.guideText}>
                Welcome to Progressor! This guide will help you make the most of your habit tracking experience.
              </p>
            </section>

            <section className={styles.guideSection}>
              <h3 className={styles.guideSectionTitle}>Understanding the Habits Dashboard</h3>
              <div className={styles.guideList}>
                <div className={styles.guideItem}>
                  <strong>Calendar Heatmap:</strong> The calendar shows your completion history. Each cell represents a day:
                  <ul className={styles.guideSubList}>
                    <li><span className={styles.colorIndicator} style={{background: 'var(--color-primary)'}}></span> Purple: All habits completed</li>
                    <li><span className={styles.colorIndicator} style={{background: 'linear-gradient(135deg, var(--color-primary) 0%, rgba(139, 92, 246, 0.5) 50%, var(--color-bg-tertiary) 100%)'}}></span> Gradient: Partially completed</li>
                    <li><span className={styles.colorIndicator} style={{background: 'var(--color-bg-tertiary)'}}></span> Gray: No habits completed</li>
                    <li>Today's date is highlighted with an orange border</li>
                  </ul>
                </div>
                <div className={styles.guideItem}>
                  <strong>Hover over calendar cells</strong> to see the completion percentage for that day.
                </div>
                <div className={styles.guideItem}>
                  <strong>Navigation arrows</strong> let you browse through different months to review your historical progress.
                </div>
              </div>
            </section>

            <section className={styles.guideSection}>
              <h3 className={styles.guideSectionTitle}>Tracking Your Habits</h3>
              <div className={styles.guideList}>
                <div className={styles.guideItem}>
                  <strong>Active Habits:</strong> View your current habits in the "Active Habits" section. Each habit displays with its category color.
                </div>
                <div className={styles.guideItem}>
                  <strong>Pending Today:</strong> See which habits you haven't completed today. Click the checkmark button to mark them as complete.
                </div>
                <div className={styles.guideItem}>
                  <strong>Habit Details:</strong> Each habit card shows:
                  <ul className={styles.guideSubList}>
                    <li>Streak count - your consecutive days of completion</li>
                    <li>Target frequency (daily, weekly, etc.)</li>
                    <li>Target count - how many times per period</li>
                    <li>Mini heatmap - last 4 days completion status</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.guideSection}>
              <h3 className={styles.guideSectionTitle}>Understanding Statistics</h3>
              <div className={styles.guideList}>
                <div className={styles.guideItem}>
                  <strong>Today's Completion Rate:</strong> Shows the percentage of your habits completed today.
                </div>
                <div className={styles.guideItem}>
                  <strong>Longest Streak:</strong> Your record for consecutive days of completing habits.
                </div>
                <div className={styles.guideItem}>
                  <strong>Category Stats:</strong> View your progress by habit category using the colored avatars.
                </div>
              </div>
            </section>

            <section className={styles.guideSection}>
              <h3 className={styles.guideSectionTitle}>Tips for Success</h3>
              <div className={styles.guideList}>
                <div className={styles.guideItem}>
                  ✓ <strong>Be Consistent:</strong> Try to complete your habits at the same time each day.
                </div>
                <div className={styles.guideItem}>
                  ✓ <strong>Start Small:</strong> Begin with a few manageable habits and gradually add more.
                </div>
                <div className={styles.guideItem}>
                  ✓ <strong>Check Daily:</strong> Review your progress daily to stay motivated.
                </div>
                <div className={styles.guideItem}>
                  ✓ <strong>Track Progress:</strong> Use the calendar to visualize your consistency over time.
                </div>
                <div className={styles.guideItem}>
                  ✓ <strong>Maintain Streaks:</strong> Focus on maintaining your current streak to build momentum.
                </div>
              </div>
            </section>

            <section className={styles.guideSection}>
              <h3 className={styles.guideSectionTitle}>Need Help?</h3>
              <p className={styles.guideText}>
                If you have questions or need assistance, feel free to explore other sections in the sidebar:
              </p>
              <div className={styles.guideList}>
                <div className={styles.guideItem}>
                  <FiActivity size={16} /> <strong>Activity:</strong> View detailed activity logs and statistics
                </div>
                <div className={styles.guideItem}>
                  <FiBell size={16} /> <strong>Notifications:</strong> Manage your notification preferences
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

