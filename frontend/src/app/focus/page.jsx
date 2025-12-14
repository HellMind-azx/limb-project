"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FiPlay, 
  FiPause, 
  FiRotateCw, 
  FiCoffee, 
  FiClock,
  FiList,
  FiMusic,
  FiShield,
  FiBarChart2
} from "react-icons/fi";
import styles from "./focus.module.scss";

export default function FocusPage() {
  // Pomodoro Timer State
  const [pomodoroMode, setPomodoroMode] = useState("work"); // "work" or "break"
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const pomodoroIntervalRef = useRef(null);

  // Simple Timer State
  const [simpleTime, setSimpleTime] = useState(0); // in seconds
  const [simpleInitialTime, setSimpleInitialTime] = useState(0); // initial time for progress calculation
  const [simpleInput, setSimpleInput] = useState({ minutes: 0, seconds: 0 });
  const [simpleRunning, setSimpleRunning] = useState(false);
  const simpleIntervalRef = useRef(null);

  // Tools State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [focusStats, setFocusStats] = useState({
    today: 0,
    week: 0,
    total: 0
  });

  // Pomodoro Timer Logic
  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            // Timer completed
            handlePomodoroComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    }

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    };
  }, [pomodoroRunning, pomodoroTime]);

  const handlePomodoroComplete = () => {
    setPomodoroRunning(false);
    // Play notification sound (optional)
    if (typeof window !== "undefined" && "Notification" in window) {
      new Notification(pomodoroMode === "work" ? "Break Time!" : "Work Time!");
    }
    
    if (pomodoroMode === "work") {
      setPomodoroSessions((prev) => prev + 1);
      setPomodoroMode("break");
      setPomodoroTime(5 * 60); // 5 minute break
    } else {
      setPomodoroMode("work");
      setPomodoroTime(25 * 60); // 25 minute work
    }
  };

  const startPomodoro = () => {
    setPomodoroRunning(true);
  };

  const pausePomodoro = () => {
    setPomodoroRunning(false);
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroMode("work");
    setPomodoroTime(25 * 60);
  };

  // Simple Timer Logic
  useEffect(() => {
    if (simpleRunning && simpleTime > 0) {
      simpleIntervalRef.current = setInterval(() => {
        setSimpleTime((prev) => {
          if (prev <= 1) {
            setSimpleRunning(false);
            if (typeof window !== "undefined" && "Notification" in window) {
              new Notification("Timer Complete!");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (simpleIntervalRef.current) {
        clearInterval(simpleIntervalRef.current);
      }
    }

    return () => {
      if (simpleIntervalRef.current) {
        clearInterval(simpleIntervalRef.current);
      }
    };
  }, [simpleRunning, simpleTime]);

  const startSimple = () => {
    if (simpleTime === 0) {
      const totalSeconds = simpleInput.minutes * 60 + simpleInput.seconds;
      if (totalSeconds > 0) {
        setSimpleTime(totalSeconds);
        setSimpleInitialTime(totalSeconds);
        setSimpleRunning(true);
      }
    } else {
      setSimpleRunning(true);
    }
  };

  const pauseSimple = () => {
    setSimpleRunning(false);
  };

  const resetSimple = () => {
    setSimpleRunning(false);
    setSimpleTime(0);
    setSimpleInitialTime(0);
    setSimpleInput({ minutes: 0, seconds: 0 });
  };

  // Task Management
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Format time helpers
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPomodoroProgress = () => {
    const total = pomodoroMode === "work" ? 25 * 60 : 5 * 60;
    return ((total - pomodoroTime) / total) * 100;
  };

  const getSimpleProgress = () => {
    if (simpleInitialTime === 0) return 0;
    return ((simpleInitialTime - simpleTime) / simpleInitialTime) * 100;
  };

  // Request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.primaryText}>Focus</span> Workspace
        </h1>
        <p className={styles.subtitle}>Your productivity hub</p>
      </div>

      {/* Timers Grid */}
      <div className={styles.timersGrid}>
        {/* Pomodoro Timer */}
        <div className={styles.timerCard}>
          <div className={styles.cardHeader}>
            <FiCoffee size={24} />
            <h2 className={styles.cardTitle}>Pomodoro</h2>
            <span className={styles.sessionBadge}>{pomodoroSessions} sessions</span>
          </div>

          <div className={styles.timerContainer}>
            <div className={styles.circularProgress}>
              <svg className={styles.progressSvg} viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="##06b6d4" />
                    <stop offset="50%" stopColor="#0066a6" />
                    <stop offset="100%" stopColor="#0663d4" />
                  </linearGradient>
                </defs>
                <circle
                  className={styles.progressTrack}
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className={styles.progressBar}
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#pomodoroGradient)"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getPomodoroProgress() / 100)}`}
                />
              </svg>
              <div className={styles.timerContent}>
                <div className={styles.timerDisplay}>{formatTime(pomodoroTime)}</div>
                <div className={styles.timerMode}>
                  {pomodoroMode === "work" ? "Work Time" : "Break Time"}
                </div>
              </div>
            </div>

            <div className={styles.timerControls}>
              {!pomodoroRunning ? (
                <button className={styles.controlBtn} onClick={startPomodoro}>
                  <FiPlay size={20} />
                  Start
                </button>
              ) : (
                <button className={styles.controlBtn} onClick={pausePomodoro}>
                  <FiPause size={20} />
                  Pause
                </button>
              )}
              <button className={styles.controlBtn} onClick={resetPomodoro}>
                <FiRotateCw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Simple Timer */}
        <div className={styles.timerCard}>
          <div className={styles.cardHeader}>
            <FiClock size={24} />
            <h2 className={styles.cardTitle}>Timer</h2>
          </div>

          <div className={styles.timerContainer}>
            <div className={styles.circularProgress}>
              <svg className={styles.progressSvg} viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <circle
                  className={styles.progressTrack}
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className={styles.progressBar}
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#simpleGradient)"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getSimpleProgress() / 100)}`}
                />
              </svg>
              <div className={styles.timerContent}>
                <div className={styles.timerDisplay}>
                  {simpleTime > 0 ? formatTime(simpleTime) : "00:00"}
                </div>
                <div className={styles.timerInput}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={simpleInput.minutes}
                    onChange={(e) => setSimpleInput({ ...simpleInput, minutes: parseInt(e.target.value) || 0 })}
                    className={styles.timeInput}
                    disabled={simpleRunning || simpleTime > 0}
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={simpleInput.seconds}
                    onChange={(e) => setSimpleInput({ ...simpleInput, seconds: parseInt(e.target.value) || 0 })}
                    className={styles.timeInput}
                    disabled={simpleRunning || simpleTime > 0}
                  />
                </div>
              </div>
            </div>

            <div className={styles.timerControls}>
              {!simpleRunning ? (
                <button className={styles.controlBtn} onClick={startSimple} disabled={simpleTime === 0 && (simpleInput.minutes === 0 && simpleInput.seconds === 0)}>
                  <FiPlay size={20} />
                  Start
                </button>
              ) : (
                <button className={styles.controlBtn} onClick={pauseSimple}>
                  <FiPause size={20} />
                  Pause
                </button>
              )}
              <button className={styles.controlBtn} onClick={resetSimple}>
                <FiRotateCw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className={styles.toolsGrid}>
        {/* Task List */}
        <div className={styles.toolCard}>
          <div className={styles.cardHeader}>
            <FiList size={24} />
            <h2 className={styles.cardTitle}>Quick Tasks</h2>
          </div>
          <div className={styles.taskList}>
            <div className={styles.taskInput}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a task..."
                className={styles.taskInputField}
              />
              <button onClick={addTask} className={styles.addTaskBtn}>Add</button>
            </div>
            <div className={styles.tasks}>
              {tasks.map(task => (
                <div key={task.id} className={`${styles.taskItem} ${task.completed ? styles.completed : ""}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className={styles.taskCheckbox}
                  />
                  <span className={styles.taskText}>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)} className={styles.deleteTaskBtn}>×</button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className={styles.emptyState}>No tasks yet. Add one above!</div>
              )}
            </div>
          </div>
        </div>

        {/* Focus Stats */}
        <div className={styles.toolCard}>
          <div className={styles.cardHeader}>
            <FiBarChart2 size={24} />
            <h2 className={styles.cardTitle}>Focus Stats</h2>
          </div>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{focusStats.today}</div>
              <div className={styles.statLabel}>Minutes Today</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{focusStats.week}</div>
              <div className={styles.statLabel}>Minutes This Week</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{pomodoroSessions}</div>
              <div className={styles.statLabel}>Total Sessions</div>
            </div>
          </div>
        </div>

        {/* Focus Music (Placeholder) */}
        <div className={styles.toolCard}>
          <div className={styles.cardHeader}>
            <FiMusic size={24} />
            <h2 className={styles.cardTitle}>Focus Sounds</h2>
          </div>
          <div className={styles.placeholderContent}>
            <p>Focus music and ambient sounds coming soon...</p>
          </div>
        </div>

        {/* Distraction Blocker (Placeholder) */}
        <div className={styles.toolCard}>
          <div className={styles.cardHeader}>
            <FiShield size={24} />
            <h2 className={styles.cardTitle}>Focus Mode</h2>
          </div>
          <div className={styles.placeholderContent}>
            <p>Distraction blocker coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

