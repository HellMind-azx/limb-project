"use client";

import { useState, useMemo } from "react";
import {
  FiBell,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiCheck,
  FiX,
  FiTrash2,
  FiFilter,
  FiCheckCircle
} from "react-icons/fi";
import styles from "./notifications.module.scss";

// Mock notification data - can be replaced with API later
const generateMockNotifications = () => {
  const now = new Date();
  const notifications = [
    {
      id: 1,
      type: "habit",
      title: "Habit Reminder",
      message: "Time to complete 'Morning Exercise'!",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      icon: FiTarget,
      color: "#3b82f6"
    },
    {
      id: 2,
      type: "achievement",
      title: "New Achievement",
      message: "You've completed 10 days streak on 'Meditation'!",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      icon: FiAward,
      color: "#8b5cf6"
    },
    {
      id: 3,
      type: "progress",
      title: "Progress Update",
      message: "You've completed 5 habits today! Great job!",
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      icon: FiTrendingUp,
      color: "#10b981"
    },
    {
      id: 4,
      type: "habit",
      title: "Habit Reminder",
      message: "Don't forget to complete 'Read Book' today!",
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      icon: FiTarget,
      color: "#3b82f6"
    },
    {
      id: 5,
      type: "achievement",
      title: "New Streak Record",
      message: "Amazing! You've reached 30 days on 'Daily Walk'!",
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      read: false,
      icon: FiAward,
      color: "#8b5cf6"
    },
    {
      id: 6,
      type: "progress",
      title: "Weekly Summary",
      message: "You completed 85% of your habits this week!",
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      icon: FiTrendingUp,
      color: "#10b981"
    },
    {
      id: 7,
      type: "system",
      title: "System Update",
      message: "New features available! Check out the Focus workspace.",
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      icon: FiBell,
      color: "#6b7280"
    }
  ];
  return notifications;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(generateMockNotifications());
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "unread", "read"
  const [typeFilter, setTypeFilter] = useState("all"); // "all", "habit", "achievement", "progress", "system"

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Filter by status
    if (statusFilter === "unread") {
      filtered = filtered.filter(n => !n.read);
    } else if (statusFilter === "read") {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    return filtered;
  }, [notifications, statusFilter, typeFilter]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    filteredNotifications.forEach(notification => {
      const notifDate = new Date(notification.timestamp);
      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= weekAgo) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  }, [filteredNotifications]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Actions
  const toggleRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            <span className={styles.primaryText}>Notifications</span>
          </h2>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} unread</span>
          )}
        </div>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button className={styles.actionBtn} onClick={markAllAsRead}>
              <FiCheckCircle size={18} />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button className={styles.actionBtn} onClick={clearAll}>
              <FiTrash2 size={18} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <FiFilter size={18} />
            Status
          </label>
          <div className={styles.filterButtons}>
            {["all", "unread", "read"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`${styles.filterButton} ${statusFilter === status ? styles.active : ""}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type</label>
          <div className={styles.filterButtons}>
            {["all", "habit", "achievement", "progress", "system"].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`${styles.filterButton} ${typeFilter === type ? styles.active : ""}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsContainer}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <FiBell size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No notifications</h3>
            <p className={styles.emptyText}>
              {notifications.length === 0
                ? "You're all caught up! No notifications yet."
                : "No notifications match your filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Today */}
            {groupedNotifications.today.length > 0 && (
              <div className={styles.group}>
                <h2 className={styles.groupTitle}>Today</h2>
                <div className={styles.notificationsList}>
                  {groupedNotifications.today.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      formatTime={formatTime}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {groupedNotifications.yesterday.length > 0 && (
              <div className={styles.group}>
                <h2 className={styles.groupTitle}>Yesterday</h2>
                <div className={styles.notificationsList}>
                  {groupedNotifications.yesterday.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      formatTime={formatTime}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* This Week */}
            {groupedNotifications.thisWeek.length > 0 && (
              <div className={styles.group}>
                <h2 className={styles.groupTitle}>This Week</h2>
                <div className={styles.notificationsList}>
                  {groupedNotifications.thisWeek.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      formatTime={formatTime}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older */}
            {groupedNotifications.older.length > 0 && (
              <div className={styles.group}>
                <h2 className={styles.groupTitle}>Older</h2>
                <div className={styles.notificationsList}>
                  {groupedNotifications.older.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      formatTime={formatTime}
                      onToggleRead={toggleRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Notification Card Component
function NotificationCard({ notification, formatTime, onToggleRead, onDelete }) {
  const Icon = notification.icon;

  return (
    <div className={`${styles.notificationCard} ${!notification.read ? styles.unread : ""}`}>
      <div className={styles.notificationIcon} style={{ background: `${notification.color}20`, color: notification.color }}>
        <Icon size={20} />
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <h3 className={styles.notificationTitle}>{notification.title}</h3>
          <span className={styles.notificationTime}>{formatTime(notification.timestamp)}</span>
        </div>
        <p className={styles.notificationMessage}>{notification.message}</p>
      </div>
      <div className={styles.notificationActions}>
        <button
          className={styles.actionIconBtn}
          onClick={() => onToggleRead(notification.id)}
          title={notification.read ? "Mark as unread" : "Mark as read"}
        >
          {notification.read ? <FiBell size={16} /> : <FiCheckCircle size={16} />}
        </button>
        <button
          className={styles.actionIconBtn}
          onClick={() => onDelete(notification.id)}
          title="Delete"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}

