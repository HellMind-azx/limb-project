'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getStoredUser } from '@/lib/auth';
import { getProgress, getStats, getHabits } from '@/lib/api';
import { 
  FiSettings, 
  FiBell, 
  FiTarget,
  FiActivity,
  FiUsers,
  FiLoader,
  FiTrendingUp,
  FiCalendar,
  FiCheck,
  FiClock,
  FiFilter
} from 'react-icons/fi';
import styles from './activity.module.scss';

export default function ActivityPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [filterDays, setFilterDays] = useState(7);
  const [selectedHabit, setSelectedHabit] = useState('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = getStoredUser();
    setUser(storedUser);
    loadData();
  }, [router, filterDays, selectedHabit]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - filterDays);
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const [habitsData, progressData, statsData] = await Promise.all([
        getHabits(),
        getProgress({ start_date: startDateStr }),
        getStats()
      ]);

      setHabits(habitsData);
      setProgress(progressData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading activity data:', err);
      setError('Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarNavigation = (path) => {
    router.push(path);
  };

  const filteredProgress = progress.filter(p => {
    if (selectedHabit === 'all') return true;
    return p.habit.toString() === selectedHabit;
  });

  // Group progress by date
  const progressByDate = filteredProgress.reduce((acc, p) => {
    const date = p.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(p);
    return acc;
  }, {});

  const sortedDates = Object.keys(progressByDate).sort((a, b) => new Date(b) - new Date(a));

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const getHabitName = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.title : 'Unknown Habit';
  };

  const getHabitColor = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? (habit.category_color || '#3B82F6') : '#3B82F6';
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
            <span className={styles.primaryText}>Activity</span>
          </h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className={styles.errorCard}>
            <div className={styles.errorText}>{error}</div>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                <FiTrendingUp size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{Math.round(stats.today_completion_rate || 0)}%</div>
                <div className={styles.statLabel}>Today's Completion Rate</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <FiCheck size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{stats.longest_streak || 0}</div>
                <div className={styles.statLabel}>Longest Streak (days)</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                <FiCalendar size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{filteredProgress.length}</div>
                <div className={styles.statLabel}>Total Activities ({filterDays} days)</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filtersCard}>
          <div className={styles.cardHeader}>
            <FiFilter size={20} />
            <h2 className={styles.cardTitle}>Filters</h2>
          </div>
          
          <div className={styles.filtersContent}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Time Period</label>
              <div className={styles.filterButtons}>
                {[7, 14, 30, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setFilterDays(days)}
                    className={`${styles.filterButton} ${filterDays === days ? styles.active : ''}`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Habit</label>
              <select
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Habits</option>
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id.toString()}>
                    {habit.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <FiClock size={24} />
            <h2 className={styles.cardTitle}>Activity Timeline</h2>
          </div>

          {sortedDates.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateText}>No activity found for the selected period</div>
            </div>
          ) : (
            <div className={styles.timeline}>
              {sortedDates.map((date, index) => (
                <div key={date} className={styles.timelineDay}>
                  <div className={styles.timelineDate}>
                    <div className={styles.dateLabel}>{formatDate(date)}</div>
                    <div className={styles.dateCount}>
                      {progressByDate[date].length} {progressByDate[date].length === 1 ? 'activity' : 'activities'}
                    </div>
                  </div>
                  
                  <div className={styles.timelineItems}>
                    {progressByDate[date].map((item, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <div 
                          className={styles.timelineDot}
                          style={{ background: getHabitColor(item.habit) }}
                        />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineItemTitle}>
                            {getHabitName(item.habit)}
                          </div>
                          <div className={styles.timelineItemMeta}>
                            {item.completed ? (
                              <span className={styles.completedBadge}>
                                <FiCheck size={12} />
                                Completed
                              </span>
                            ) : (
                              <span className={styles.pendingBadge}>
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {index < sortedDates.length - 1 && (
                    <div className={styles.timelineConnector} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

