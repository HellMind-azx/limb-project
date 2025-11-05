"use client";

import { useEffect, useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiLoader, FiTrendingUp } from "react-icons/fi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./calendar.module.scss";
import { getHabits, getProgress } from "@/lib/api";

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [habitsData, progressData] = await Promise.all([
          getHabits(),
          getProgress(),
        ]);
        setHabits(habitsData);
        const map = {};
        progressData.forEach((p) => {
          const key = `${p.habit}-${p.date}`;
          map[key] = p.completed;
        });
        setProgress(map);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);
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
    const dateStr = date.toISOString().split("T")[0];
    let completed = 0;
    let total = habits.length;
    habits.forEach((habit) => {
      const key = `${habit.id}-${dateStr}`;
      if (progress[key]) completed++;
    });
    return total > 0 ? completed / total : 0;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + direction);
      return d;
    });
  };

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (habits.length === 0) {
      return {
        completionRate: 0,
        quarterlyData: [],
        monthlyData: []
      };
    }

    // Get all unique dates from progress
    const allDates = new Set();
    Object.keys(progress).forEach(key => {
      // Key format: "habitId-dateStr", extract date part
      const parts = key.split('-');
      if (parts.length >= 4) {
        // Date is in YYYY-MM-DD format, take last 3 parts
        const date = parts.slice(-3).join('-');
        // Validate it looks like a date (YYYY-MM-DD)
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          allDates.add(date);
        }
      }
    });

    // Calculate overall completion rate
    let totalCompleted = 0;
    let totalPossible = 0;
    
    allDates.forEach(dateStr => {
      habits.forEach(habit => {
        totalPossible++;
        const key = `${habit.id}-${dateStr}`;
        if (progress[key]) totalCompleted++;
      });
    });

    const completionRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    // Calculate quarterly breakdown
    const quarterlyStats = {
      Q1: { completed: 0, total: 0 },
      Q2: { completed: 0, total: 0 },
      Q3: { completed: 0, total: 0 },
      Q4: { completed: 0, total: 0 }
    };

    allDates.forEach(dateStr => {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) return;
      
      const month = date.getMonth();
      let quarter;
      if (month >= 0 && month <= 2) quarter = 'Q1';
      else if (month >= 3 && month <= 5) quarter = 'Q2';
      else if (month >= 6 && month <= 8) quarter = 'Q3';
      else quarter = 'Q4';

      habits.forEach(habit => {
        quarterlyStats[quarter].total++;
        const key = `${habit.id}-${dateStr}`;
        if (progress[key]) quarterlyStats[quarter].completed++;
      });
    });

    const quarterlyData = [
      {
        name: 'Q1',
        value: quarterlyStats.Q1.total > 0 
          ? Math.round((quarterlyStats.Q1.completed / quarterlyStats.Q1.total) * 100) 
          : 0,
        completed: quarterlyStats.Q1.completed,
        total: quarterlyStats.Q1.total
      },
      {
        name: 'Q2',
        value: quarterlyStats.Q2.total > 0 
          ? Math.round((quarterlyStats.Q2.completed / quarterlyStats.Q2.total) * 100) 
          : 0,
        completed: quarterlyStats.Q2.completed,
        total: quarterlyStats.Q2.total
      },
      {
        name: 'Q3',
        value: quarterlyStats.Q3.total > 0 
          ? Math.round((quarterlyStats.Q3.completed / quarterlyStats.Q3.total) * 100) 
          : 0,
        completed: quarterlyStats.Q3.completed,
        total: quarterlyStats.Q3.total
      },
      {
        name: 'Q4',
        value: quarterlyStats.Q4.total > 0 
          ? Math.round((quarterlyStats.Q4.completed / quarterlyStats.Q4.total) * 100) 
          : 0,
        completed: quarterlyStats.Q4.completed,
        total: quarterlyStats.Q4.total
      }
    ];

    // Calculate monthly breakdown
    const monthlyStats = {
      Jan: { completed: 0, total: 0 },
      Feb: { completed: 0, total: 0 },
      Mar: { completed: 0, total: 0 },
      Apr: { completed: 0, total: 0 },
      May: { completed: 0, total: 0 },
      Jun: { completed: 0, total: 0 },
      Jul: { completed: 0, total: 0 },
      Aug: { completed: 0, total: 0 },
      Sep: { completed: 0, total: 0 },
      Oct: { completed: 0, total: 0 },
      Nov: { completed: 0, total: 0 },
      Dec: { completed: 0, total: 0 }
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    allDates.forEach(dateStr => {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) return;
      
      const monthName = monthNames[date.getMonth()];
      if (!monthName) return;

      habits.forEach(habit => {
        monthlyStats[monthName].total++;
        const key = `${habit.id}-${dateStr}`;
        if (progress[key]) monthlyStats[monthName].completed++;
      });
    });

    const monthlyData = monthNames.map(month => ({
      name: month,
      completed: monthlyStats[month].completed,
      total: monthlyStats[month].total,
      percentage: monthlyStats[month].total > 0 
        ? Math.round((monthlyStats[month].completed / monthlyStats[month].total) * 100) 
        : 0
    }));

    return {
      completionRate: Math.round(completionRate),
      quarterlyData,
      monthlyData
    };
  }, [habits, progress]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#a855f7', '#c084fc'];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <FiLoader size={48} />
        </div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Calendar</h2>
          <div className={styles.navRow}>
            <button className={styles.navBtn} onClick={() => navigateMonth(-1)}>
              <FiChevronLeft size={18} />
            </button>
            <div className={styles.monthTitle}>
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button className={styles.navBtn} onClick={() => navigateMonth(1)}>
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className={styles.weekdays}>
          {weekdays.map((d) => (
            <div key={d} className={styles.weekday}>
              {d}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {calendarDays.map((date, idx) => {
            const completion = getCompletionForDay(date);
            const inMonth = date.getMonth() === currentMonth.getMonth();
            let cls = styles.cell;
            if (!inMonth) cls += ` ${styles.empty}`;
            else if (completion === 1) cls += ` ${styles.completed}`;
            else if (completion > 0) cls += ` ${styles.partial}`;
            else cls += ` ${styles.missed}`;
            if (isToday(date)) cls += ` ${styles.today}`;
            return (
              <div key={idx} className={cls} title={`${date.toLocaleDateString()}: ${Math.round(completion * 100)}%`}>
                <span className={styles.dayNum}>{date.getDate()}</span>
                {inMonth && completion > 0 && (
                  <span className={styles.percent}>{Math.round(completion * 100)}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className={styles.dashboard}>
        {/* KPI Card */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <h3 className={styles.kpiTitle}>Completion Rate</h3>
            <div className={styles.kpiIcon}>
              <FiTrendingUp size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{analyticsData.completionRate}%</div>
          <div className={styles.kpiLabel}>Overall success rate</div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>
          {/* Quarterly Donut Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Progress per Quarter</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.quarterlyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.quarterlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1220',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value, name, props) => [`${value}%`, `${props.payload.name}`]}
                  />
                  <Legend
                    wrapperStyle={{ color: '#fff' }}
                    formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Progress per Month</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.monthlyData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1220',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value}%`, 'Completion']}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


