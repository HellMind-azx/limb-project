'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getStoredUser } from '@/lib/auth';
import { getHabits, getProgress, toggleProgress, getStats, createHabit, createCategory, getCategories } from '@/lib/api';
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
  FiCheck,
  FiX,
  FiHeart,
  FiZap,
  FiCoffee,
  FiBook,
  FiSmile,
  FiBriefcase,
  FiCamera,
  FiMusic,
  FiHome,
  FiAward,
  FiSun,
  FiMoon,
  FiStar,
  FiFeather,
  FiPenTool,
  FiShoppingBag,
  FiPlay,
  FiRadio,
  FiPlus
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [habitTitle, setHabitTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [customColorOpen, setCustomColorOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#3B82F6');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  // Icon options
  const iconOptions = [
    { name: 'FiHeart', component: FiHeart },
    { name: 'FiTarget', component: FiTarget },
    { name: 'FiActivity', component: FiActivity },
    { name: 'FiZap', component: FiZap },
    { name: 'FiCoffee', component: FiCoffee },
    { name: 'FiBook', component: FiBook },
    { name: 'FiSmile', component: FiSmile },
    { name: 'FiBriefcase', component: FiBriefcase },
    { name: 'FiCamera', component: FiCamera },
    { name: 'FiMusic', component: FiMusic },
    { name: 'FiHome', component: FiHome },
    { name: 'FiAward', component: FiAward },
    { name: 'FiSun', component: FiSun },
    { name: 'FiMoon', component: FiMoon },
    { name: 'FiStar', component: FiStar },
    { name: 'FiFeather', component: FiFeather },
    { name: 'FiPenTool', component: FiPenTool },
    { name: 'FiShoppingBag', component: FiShoppingBag },
    { name: 'FiPlay', component: FiPlay },
    { name: 'FiTrendingUp', component: FiTrendingUp },
    { name: 'FiClock', component: FiClock },
    { name: 'FiRadio', component: FiRadio },
  ];

  // Color palette
  const colorPalette = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#10B981', // green
    '#F59E0B', // orange
    '#EF4444', // red
    '#EC4899', // pink
    '#FCD34D', // yellow
    '#06B6D4', // cyan
  ];

  // Load categories when modal opens
  useEffect(() => {
    if (isModalOpen) {
      loadCategories();
    }
  }, [isModalOpen]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
      setModalError('Failed to load categories');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalError('');
    setHabitTitle('');
    setSelectedCategoryId('');
    setIsCreatingCategory(false);
    setNewCategoryName('');
    setSelectedIcon('');
    setSelectedColor('#3B82F6');
    setCustomColor('#3B82F6');
    setCustomColorOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError('');
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsCreatingCategory(true);
      setSelectedCategoryId('');
    } else {
      setIsCreatingCategory(false);
      setSelectedCategoryId(value);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCustomColorOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      // Validation
      if (!habitTitle.trim()) {
        setModalError('Habit title is required');
        setSubmitting(false);
        return;
      }

      let categoryId = selectedCategoryId;

      // Create category if needed
      if (isCreatingCategory) {
        if (!newCategoryName.trim()) {
          setModalError('Category name is required');
          setSubmitting(false);
          return;
        }

        if (!selectedIcon) {
          setModalError('Please select an icon');
          setSubmitting(false);
          return;
        }

        const categoryColor = customColorOpen ? customColor : selectedColor;
        const newCategory = await createCategory({
          name: newCategoryName,
          icon: selectedIcon,
          color: categoryColor,
        });
        categoryId = newCategory.id;
      } else if (!categoryId) {
        setModalError('Please select or create a category');
        setSubmitting(false);
        return;
      }

      // Create habit
      await createHabit({
        title: habitTitle,
        category: categoryId,
        frequency: 'daily',
        target_count: 1,
      });

      // Reload data
      await loadData();

      // Close modal
      handleCloseModal();
    } catch (err) {
      console.error('Error creating habit:', err);
      setModalError(err.response?.data?.detail || err.message || 'Failed to create habit');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

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
          <button className={styles.addHabitBtn} onClick={handleOpenModal}>
            <span className={styles.addHabitBtnIcon}>
              <FiPlus size={16} /></span>
            Add Habits
          </button>
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

        {/* Main Grid - 2 Columns (60/40) */}
        <div className={styles.mainGrid}>
          {/* Left Column (60%): Today's Tasks */}
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

          {/* Right Column (40%): Habit Details + Analytics */}
          <div className={styles.rightColumn}>
            {/* Habit Details */}
            <div className={styles.habitCard}>
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
                        <div className={`${styles.statusBadge} ${isCompleted ? styles.completed : styles.pending
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

            {/* Analytics Card */}
            <div className={styles.analyticsCard}>
              <h3 className={styles.analyticsTitle}>Daily Progress</h3>
              <div className={styles.analyticsContent}>
                {/* Circular Progress Bar */}
                <div className={styles.analyticsCircularProgress}>
                  <svg className={styles.analyticsCircularSvg} viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <circle
                      className={styles.analyticsCircularTrack}
                      cx="50"
                      cy="50"
                      r="40"
                    />
                    <circle
                      className={styles.analyticsCircularProgressPath}
                      cx="50"
                      cy="50"
                      r="40"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (todayStats.total === 0 ? 0 : todayStats.completed / todayStats.total))}`}
                    />
                  </svg>
                  <div className={styles.analyticsCircularContent}>
                    <div className={styles.analyticsCircularPercentage}>
                      {todayStats.total === 0 ? 0 : Math.round((todayStats.completed / todayStats.total) * 100)}%
                    </div>
                    <div className={styles.analyticsCircularLabel}>Done</div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className={styles.analyticsStats}>
                  <div className={styles.analyticsStatItem}>
                    <div className={styles.analyticsStatValue}>{todayStats.completed}</div>
                    <div className={styles.analyticsStatLabel}>Completed</div>
                  </div>
                  <div className={styles.analyticsStatDivider}></div>
                  <div className={styles.analyticsStatItem}>
                    <div className={styles.analyticsStatValue}>{todayStats.total}</div>
                    <div className={styles.analyticsStatLabel}>Total</div>
                  </div>
                  <div className={styles.analyticsStatDivider}></div>
                  <div className={styles.analyticsStatItem}>
                    <div className={styles.analyticsStatValue}>{todayStats.pending}</div>
                    <div className={styles.analyticsStatLabel}>Pending</div>
                  </div>
                </div>

                {/* Weekly Streak */}
                {stats && (
                  <div className={styles.analyticsStreak}>
                    <FiTrendingUp size={16} />
                    <span>Longest streak: {stats.longest_streak || 0} days</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Habits Section */}
        <div className={`${styles.habitCard} ${styles.allHabitsSection}`}>
          <h3 className={styles.habitCardTitle}>My Habits</h3>
          <div className={styles.habitsGrid}>
            {habits.map(habit => {
              const d = selectedDate.toISOString().split('T')[0];
              const key = `${habit.id}-${d}`;
              const isDone = !!progress[key];
              return (
                <div key={habit.id} className={styles.habitCardItem}>
                  <div
                    className={styles.habitCardIcon}
                    style={{ background: habit.category_color || '#3B82F6' }}
                  />
                  <div className={styles.habitCardInfo}>
                    <div className={styles.habitCardName}>{habit.title}</div>
                    <div className={styles.habitCardMeta}>
                      {habit.streak_count || 0}d streak • {habit.category_name || 'Uncategorized'}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Habit</h2>
              <button className={styles.modalCloseBtn} onClick={handleCloseModal}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {modalError && (
                <div className={styles.modalError}>
                  {modalError}
                </div>
              )}

              {/* Category Selection */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Category</label>
                <select
                  className={styles.formSelect}
                  value={isCreatingCategory ? 'new' : selectedCategoryId}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  <option value="new">+ Create new category</option>
                </select>
              </div>

              {/* New Category Name */}
              {isCreatingCategory && (
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Category Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
              )}

              {/* Habit Title */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Habit Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  placeholder="Enter habit name"
                  required
                />
              </div>

              {/* Icon and Color Selectors - only shown when creating new category */}
              {isCreatingCategory && (
                <>
                  {/* Icon Selector */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Icon</label>
                    <div className={styles.iconGrid}>
                      {iconOptions.map((iconOption) => {
                        const IconComponent = iconOption.component;
                        const isSelected = selectedIcon === iconOption.name;
                        return (
                          <button
                            key={iconOption.name}
                            type="button"
                            className={`${styles.iconOption} ${isSelected ? styles.iconSelected : ''}`}
                            onClick={() => setSelectedIcon(iconOption.name)}
                            style={{
                              background: isSelected
                                ? (customColorOpen ? customColor : selectedColor)
                                : 'transparent',
                              borderColor: isSelected
                                ? (customColorOpen ? customColor : selectedColor)
                                : 'rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <IconComponent size={24} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Icon Background Color</label>
                    <div className={styles.colorSelector}>
                      <div className={styles.colorPalette}>
                        {colorPalette.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`${styles.colorOption} ${selectedColor === color && !customColorOpen ? styles.colorSelected : ''}`}
                            onClick={() => handleColorSelect(color)}
                            style={{ background: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className={`${styles.customColorBtn} ${customColorOpen ? styles.customColorActive : ''}`}
                        onClick={() => setCustomColorOpen(!customColorOpen)}
                      >
                        Custom Color
                      </button>
                      {customColorOpen && (
                        <div className={styles.colorPickerWrapper}>
                          <input
                            type="color"
                            className={styles.colorPicker}
                            value={customColor}
                            onChange={(e) => {
                              setCustomColor(e.target.value);
                              setSelectedColor(e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview */}
                  {selectedIcon && (
                    <div className={styles.iconPreview}>
                      <label className={styles.formLabel}>Preview</label>
                      <div
                        className={styles.previewIcon}
                        style={{
                          background: customColorOpen ? customColor : selectedColor,
                        }}
                      >
                        {(() => {
                          const iconOption = iconOptions.find(opt => opt.name === selectedIcon);
                          const IconComponent = iconOption?.component || FiTarget;
                          return <IconComponent size={32} color="white" />;
                        })()}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Show selected category icon/color when existing category is selected */}
              {!isCreatingCategory && selectedCategoryId && (() => {
                const selectedCategory = categories.find(cat => cat.id === parseInt(selectedCategoryId));
                if (!selectedCategory) return null;

                // Find icon component from category icon name
                const iconOption = iconOptions.find(opt => opt.name === selectedCategory.icon);
                const IconComponent = iconOption?.component || FiTarget;

                return (
                  <div className={styles.iconPreview}>
                    <label className={styles.formLabel}>Category Preview</label>
                    <div
                      className={styles.previewIcon}
                      style={{
                        background: selectedCategory.color || '#3B82F6',
                      }}
                    >
                      <IconComponent size={32} color="white" />
                    </div>
                  </div>
                );
              })()}

              {/* Form Actions */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiLoader className={styles.spinner} size={16} />
                      Creating...
                    </>
                  ) : (
                    'Create Habit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 