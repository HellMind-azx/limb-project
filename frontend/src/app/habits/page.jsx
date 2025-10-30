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
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // monthly calendar removed from Habits; full calendar lives at /calendar

  const getTodayCompletionStats = () => {
    const today = selectedDate.toISOString().split('T')[0];
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

  return (
    <div className={styles.dashboard}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header with mini date strip */}
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

        {/* Mini date strip + Add Habit */}
        <div className={styles.dateStripRow}>
          <div className={styles.dateStrip}>
            {Array.from({ length: 9 }, (_, i) => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + i - 4);
              const isSel = d.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={i}
                  className={`${styles.datePill} ${isSel ? styles.selected : ''}`}
                  onClick={() => setSelectedDate(new Date(d))}
                  title={d.toLocaleDateString()}
                >
                  <span className={styles.dateDow}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className={styles.dateNum}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
          <button className={styles.addHabitBtn} onClick={() => router.push('/habits')}>+ Add Habits</button>
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

        {/* KPI row */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Completed</div>
            <div className={styles.kpiValue}>{todayStats.total === 0 ? 0 : Math.round((todayStats.completed / todayStats.total) * 100)}%</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>On progress</div>
            <div className={styles.kpiValue}>{todayStats.total - todayStats.pending === 0 ? 0 : Math.max(todayStats.completed, 0)}</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Pending</div>
            <div className={styles.kpiValue}>{todayStats.pending}</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>You're losing streaks</div>
            <div className={styles.kpiValue}>{habits.filter(h => (h.streak_count || 0) === 0).length}</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>Check your streaks</div>
            <div className={styles.kpiValue}>{stats?.longest_streak || 0}d</div>
          </div>
        </div>

        {/* Main content grid */}
        <div className={styles.mainLayout}>
          <div className={styles.cardsGrid}>
          {/* Today's tasks */}
          <div className={styles.habitCard}>
            <h3 className={styles.habitCardTitle}>Today's tasks</h3>
            <div className={styles.taskList}>
              {habits.map(habit => {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const key = `${habit.id}-${dateStr}`;
                const isDone = !!progress[key];
                // simple per-habit bar: done = 100, not done = 0 (can be extended to target_count)
                const percent = isDone ? 100 : 0;
                return (
                  <div key={habit.id} className={styles.taskRow}>
                    <div className={styles.taskMeta}>
                      <div 
                        className={styles.habitIcon}
                        style={{ background: habit.category_color || '#3B82F6' }}
                      />
                      <div className={styles.taskTitleWrap}>
                        <div className={styles.taskTitle}>{habit.title}</div>
                        <div className={styles.taskMetaLine}>
                          <span className={styles.taskTagMuted}>active</span>
                          <span className={isDone ? styles.taskTagDone : styles.taskTagPending}>
                            {isDone ? 'completed' : 'pending'}
                          </span>
                          {habit.frequency && (
                            <span className={styles.taskTagInfo}>{habit.frequency}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.taskBarWrap}>
                      <div className={styles.taskBarBg}>
                        <div className={styles.taskBarFill} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {habits.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateText}>No habits yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Active/Pending now reflected inside Today's tasks rows */}

          {/* Habit Details */}
          <div className={styles.habitDetailsContainer}>
            <h3 className={styles.habitCardTitle}>Habit Details</h3>
            <div className={styles.habitDetails}>
              {habits.slice(0, 2).map(habit => {
                const today = selectedDate.toISOString().split('T')[0];
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
                          const checkDate = new Date(selectedDate);
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

          {/* Streaks summary */}
          <div className={styles.habitCard}>
            <h3 className={styles.habitCardTitle}>Streaks</h3>
            <div className={styles.donutRow}>
              <div className={styles.donut}>
                <div className={styles.donutCenter}>{todayStats.total ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%</div>
              </div>
              <div className={styles.donutLegend}>
                <div className={styles.legendItem}><span className={styles.legendCompleted} />Completed</div>
                <div className={styles.legendItem}><span className={styles.legendMissed} />Missed</div>
              </div>
            </div>
          </div>

          {/* My Habits */}
          <div className={styles.habitCard}>
            <h3 className={styles.habitCardTitle}>My Habits</h3>
            <div className={styles.habitList}>
              {habits.slice(0, 6).map(habit => {
                const d = selectedDate.toISOString().split('T')[0];
                const key = `${habit.id}-${d}`;
                const isDone = !!progress[key];
                return (
                  <div key={habit.id} className={styles.habitItem}>
                    <div 
                      className={styles.habitIcon}
                      style={{ background: habit.category_color || '#3B82F6' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className={styles.habitName}>{habit.title}</div>
                      <div className={styles.taskMetaLine}>
                        <span className={isDone ? styles.taskTagDone : styles.taskTagPending}>
                          {isDone ? 'completed' : 'pending'}
                        </span>
                        {habit.frequency && (
                          <span className={styles.taskTagInfo}>{habit.frequency}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {habits.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateText}>No habits yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Habit Insights */}
          <div className={styles.habitCard}>
            <h3 className={styles.habitCardTitle}>Habit Insights</h3>
            <div className={styles.habitList}>
              <div className={styles.statsText}>Ты выполняешь привычки чаще по утрам</div>
              <div className={styles.statsText}>Средний прогресс за неделю вырос на 12%</div>
            </div>
          </div>

          {/* Bottom statistics card — удалена по новому ТЗ */}
        </div>
      </div>
    </div>
    </div>
  );
} 