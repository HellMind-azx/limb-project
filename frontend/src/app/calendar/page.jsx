"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
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
    </div>
  );
}


