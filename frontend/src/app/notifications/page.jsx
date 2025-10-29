'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getPreferences, updatePreferences } from '@/lib/api';
import { 
  FiSettings, 
  FiBell, 
  FiTarget,
  FiActivity,
  FiUsers,
  FiLoader,
  FiCheck,
  FiMail,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import styles from './notifications.module.scss';

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    email_notifications: true,
    weekly_reports: true,
  });

  // Mock notifications history (placeholder for future backend integration)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'progress',
      title: 'Great job!',
      message: 'You completed all your habits today',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Reminder',
      message: 'You have 3 habits pending for today',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'streak',
      title: 'Streak milestone!',
      message: 'You reached a 7-day streak on "Daily Exercise"',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'weekly',
      title: 'Weekly Report',
      message: 'Your weekly progress report is ready',
      time: new Date(Date.now() - 48 * 60 * 60 * 1000),
      read: true
    }
  ]);

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
      setError('Failed to load notification preferences');
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
      setSuccess('Notification preferences saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err.response?.data?.error || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
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

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <span className={styles.primaryText}>Notifications</span>
            </h1>
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className={styles.markAllButton}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className={styles.errorCard}>
            <div className={styles.errorText}>{error}</div>
          </div>
        )}

        {success && (
          <div className={styles.successCard}>
            <div className={styles.successText}>{success}</div>
          </div>
        )}

        {/* Notification Preferences */}
        <div className={styles.preferencesCard}>
          <div className={styles.cardHeader}>
            <FiBell size={24} />
            <h2 className={styles.cardTitle}>Notification Preferences</h2>
          </div>
          
          <div className={styles.preferencesList}>
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <div className={styles.preferenceLabel}>
                  <FiBell size={18} />
                  Enable Notifications
                </div>
                <div className={styles.preferenceDescription}>
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

            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <div className={styles.preferenceLabel}>
                  <FiMail size={18} />
                  Email Notifications
                </div>
                <div className={styles.preferenceDescription}>
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

            <div className={styles.preferenceItem}>
              <div className={styles.preferenceInfo}>
                <div className={styles.preferenceLabel}>
                  <FiCalendar size={18} />
                  Weekly Reports
                </div>
                <div className={styles.preferenceDescription}>
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

        {/* Notifications History */}
        <div className={styles.notificationsCard}>
          <div className={styles.cardHeader}>
            <FiClock size={24} />
            <h2 className={styles.cardTitle}>Recent Notifications</h2>
          </div>

          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateText}>No notifications yet</div>
            </div>
          ) : (
            <div className={styles.notificationsList}>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles.notificationIcon}>
                    <FiBell size={20} />
                  </div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <div className={styles.notificationTitle}>{notification.title}</div>
                      {!notification.read && <div className={styles.unreadDot}></div>}
                    </div>
                    <div className={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {formatTime(notification.time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

