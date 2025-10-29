'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getStoredUser } from '@/lib/auth';
import { getHabits, getProgress, toggleProgress, getStats } from '@/lib/api';
import { 
  FiSettings, 
  FiBell, 
  FiTrendingUp, 
  FiTarget,
  FiLoader,
  FiUsers,
  FiClock,
  FiActivity,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheck
} from 'react-icons/fi';
import styles from './habits.module.scss';

export default function HabitsDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('days');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState(null);

  const handleSidebarNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = getStoredUser();
    setUser(storedUser);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [habitsData, progressData, statsData] = await Promise.all([
        getHabits(),
        getProgress(),
        getStats()
      ]);

      setHabits(habitsData);
      
      // Organize progress by habit_id and date
      const progressMap = {};
      progressData.forEach(p => {
        const key = `${p.habit}-${p.date}`;
        progressMap[key] = p.completed;
      });
      setProgress(progressMap);
      
      setStats(statsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProgress = async (habitId, date) => {
    try {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      await toggleProgress(habitId, dateStr);
      
      // Update local progress state
      const key = `${habitId}-${dateStr}`;
      setProgress(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      
      // Reload stats to update completion rates
      const statsData = await getStats();
      setStats(statsData);
      
      // Update habit streak count
      await loadData();
    } catch (err) {
      console.error('Error toggling progress:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  const getProgressForDate = (habitId, date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const key = `${habitId}-${dateStr}`;
    return progress[key] || false;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Monday of the week containing first day
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    // End on Sunday of the week containing last day
    const endDate = new Date(lastDay);
    const endDayOfWeek = lastDay.getDay();
    const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    endDate.setDate(endDate.getDate() + daysToAdd);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getCompletionForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    let completed = 0;
    let total = habits.length;
    
    habits.forEach(habit => {
      const key = `${habit.id}-${dateStr}`;
      if (progress[key]) {
        completed++;
      }
    });
    
    return total > 0 ? (completed / total) : 0;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const getTodayCompletionStats = () => {
    const today = new Date().toISOString().split('T')[0];
    let completed = 0;
    let total = habits.length;
    
    habits.forEach(habit => {
      const key = `${habit.id}-${today}`;
      if (progress[key]) {
        completed++;
      }
    });
    
    return { completed, total, pending: total - completed };
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

  const todayStats = getTodayCompletionStats();
  const calendarDays = generateCalendarDays();
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
              <span className={styles.primaryText}>Progressor</span> Habits
            </h1>
            <div className={styles.searchIcon}>
              <FiSearch size={18} />
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.statsInfo}>
              <div className={styles.statsText}>
                {todayStats.completed} of {todayStats.total} habits completed
              </div>
              <div className={styles.statsText}>
                {todayStats.pending} habits pending
              </div>
            </div>
            <div className={styles.avatarGroup}>
              {stats?.category_stats?.slice(0, 2).map((cat, idx) => (
                <div 
                  key={cat.id} 
                  className={styles.avatar}
                  style={{ background: cat.color }}
                  title={cat.name}
                />
              ))}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}></div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>
                  {user?.first_name || user?.username || 'User'}
                </div>
                <div className={styles.userRole}>Member</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={styles.errorCard}>
            <div className={styles.errorText}>{error}</div>
            <button 
              onClick={loadData}
              className={styles.quickActionButton}
              style={{ marginTop: '0.5rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Layout: Calendar Left + Bento Grid Right */}
        <div className={styles.mainLayout}>
          {/* Calendar Section - Left */}
          <div className={styles.calendarCard}>
            <div className={styles.calendarHeaderWrapper}>
              <h2 className={styles.calendarSectionTitle}>Calendar</h2>
              <div className={styles.tabGroup}>
                {['Days', 'Weeks', 'Months'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`${styles.tab} ${
                      activeTab === tab.toLowerCase() ? styles.active : ''
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div className={styles.calendarContainer}>
              <div className={styles.calendarNavigation}>
                <button 
                  onClick={() => navigateMonth(-1)}
                  className={styles.calendarNavButton}
                >
                  <FiChevronLeft size={18} />
                </button>
                <h3 className={styles.calendarMonthTitle}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={() => navigateMonth(1)}
                  className={styles.calendarNavButton}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>

              <div className={styles.calendarHeader}>
                {weekdays.map(day => (
                  <div key={day} className={styles.weekday}>{day}</div>
                ))}
              </div>

              <div className={styles.calendarGrid}>
                {calendarDays.map((date, idx) => {
                  const completionRate = getCompletionForDay(date);
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isDateToday = isToday(date);
                  
                  let cellClass = styles.calendarCell;
                  if (!isCurrentMonth) {
                    cellClass += ` ${styles.empty}`;
                  } else if (completionRate === 1) {
                    cellClass += ` ${styles.completed}`;
                  } else if (completionRate > 0) {
                    cellClass += ` ${styles.partial}`;
                  } else {
                    cellClass += ` ${styles.missed}`;
                  }
                  if (isDateToday) {
                    cellClass += ` ${styles.today}`;
                  }

                  return (
                    <div
                      key={idx}
                      className={cellClass}
                      title={`${date.toLocaleDateString()}: ${Math.round(completionRate * 100)}% of habits completed`}
                      style={{
                        opacity: isCurrentMonth ? 1 : 0.3,
                        cursor: isCurrentMonth ? 'pointer' : 'default'
                      }}
                    >
                      <span className={styles.calendarDayNumber}>
                        {date.getDate()}
                      </span>
                      {isCurrentMonth && completionRate > 0 && (
                        <span className={styles.calendarCellPercentage}>
                          {Math.round(completionRate * 100)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bento Grid - Right */}
          <div className={styles.bentoGrid}>
          {/* Active Habits */}
          <div className={styles.habitCard}>
            <h3 className={styles.habitCardTitle}>Active Habits</h3>
            <div className={styles.habitList}>
              {habits.slice(0, 5).map(habit => (
                <div key={habit.id} className={styles.habitItem}>
                  <div 
                    className={styles.habitIcon}
                    style={{ background: habit.category_color || '#3B82F6' }}
                  />
                  <div className={styles.habitName}>{habit.title}</div>
                </div>
              ))}
              {habits.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateText}>No habits yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Pending Today */}
          <div className={styles.habitCard}>
            <h3 className={styles.habitCardTitle}>Pending Today</h3>
            <div className={styles.habitList}>
              {habits
                .filter(habit => {
                  const today = new Date().toISOString().split('T')[0];
                  const key = `${habit.id}-${today}`;
                  return !progress[key];
                })
                .slice(0, 5)
                .map(habit => (
                  <div key={habit.id} className={styles.habitItem}>
                    <div 
                      className={styles.habitIcon}
                      style={{ background: habit.category_color || '#3B82F6' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className={styles.habitName}>{habit.title}</div>
                      <div className={styles.statsText}>{habit.frequency}</div>
                    </div>
                    <button
                      onClick={() => handleToggleProgress(habit.id, new Date())}
                      className={styles.quickActionButton}
                      style={{ 
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        marginTop: 0,
                        width: 'auto'
                      }}
                    >
                      <FiCheck size={14} />
                    </button>
                  </div>
                ))}
              {habits.filter(habit => {
                const today = new Date().toISOString().split('T')[0];
                const key = `${habit.id}-${today}`;
                return !progress[key];
              }).length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateText}>All caught up! 🎉</div>
                </div>
              )}
            </div>
          </div>

          {/* Habit Details */}
          <div className={styles.habitDetailsContainer}>
            <h3 className={styles.habitCardTitle}>Habit Details</h3>
            <div className={styles.habitDetails}>
              {habits.slice(0, 2).map(habit => {
                const today = new Date().toISOString().split('T')[0];
                const key = `${habit.id}-${today}`;
                const isCompleted = progress[key];
                
                return (
                  <div key={habit.id} className={styles.habitDetailCard}>
                    <div className={styles.habitDetailHeader}>
                      <div className={styles.habitDetailLeft}>
                        <div 
                          className={styles.habitIcon}
                          style={{ background: habit.category_color || '#3B82F6' }}
                        />
                        <div className={styles.habitDetailInfo}>
                          <div className={styles.habitDetailName}>{habit.title}</div>
                          <div className={styles.habitDetailStreak}>
                            {habit.streak_count || 0} day streak
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.statusBadge} ${
                        isCompleted ? styles.completed : styles.pending
                      }`}>
                        {isCompleted ? '✓' : '!'}
                      </div>
                    </div>
                    <div className={styles.habitMeta}>
                      <div className={styles.metaItem}>
                        <FiClock size={16} />
                        <span>{habit.target_count} {habit.frequency === 'daily' ? 'times' : 'per ' + habit.frequency}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <FiTarget size={16} />
                        <span>{habit.frequency}</span>
                      </div>
                    </div>
                    <div className={styles.habitFooter}>
                      <div className={styles.miniHeatmap}>
                        {Array.from({ length: 4 }, (_, i) => {
                          const checkDate = new Date();
                          checkDate.setDate(checkDate.getDate() - (3 - i));
                          const dateStr = checkDate.toISOString().split('T')[0];
                          const isChecked = progress[`${habit.id}-${dateStr}`];
                          return (
                            <div
                              key={i}
                              className={isChecked ? styles.miniCellCompleted : styles.miniCellIncomplete}
                            />
                          );
                        })}
                      </div>
                      <div className={styles.categoryLabel}>{habit.category_name || 'Uncategorized'}</div>
                    </div>
                  </div>
                );
              })}
              {habits.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateText}>No habits to display</div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Statistics Card - In Bento Grid */}
          {stats && (
            <div className={styles.bottomStatsCard}>
              <div className={styles.bottomStatsContent}>
                <div className={styles.bottomStatsLeft}>
                  <div className={styles.bottomStatsNumber}>
                    {Math.round(stats.today_completion_rate || 0)}%
                  </div>
                  <div className={styles.bottomStatsText}>
                    Today's completion rate
                  </div>
                  <div className={styles.bottomStatsText} style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Longest streak: {stats.longest_streak || 0} days
                  </div>
                </div>
                <div className={styles.bottomStatsIcons}>
                  {stats.category_stats?.slice(0, 3).map((cat, idx) => (
                    <div
                      key={cat.id}
                      className={styles.bottomStatsIcon}
                      style={{ background: cat.color }}
                      title={cat.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
} 