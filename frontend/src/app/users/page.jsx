"use client";

import { useState, useMemo } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiX,
  FiCalendar,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
  FiMail,
  FiUser,
  FiClock
} from "react-icons/fi";
import styles from "./users.module.scss";

// Mock user data - can be replaced with API later
const generateMockUsers = () => {
  const now = new Date();
  const users = [
    {
      id: 1,
      username: "alex_chen",
      firstName: "Alex",
      lastName: "Chen",
      email: "alex.chen@example.com",
      dateJoined: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
      lastLogin: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      avatarColor: "#3b82f6",
      stats: {
        totalHabits: 12,
        activeHabits: 8,
        completedToday: 6,
        totalProgress: 85,
        currentStreak: 15,
        longestStreak: 45
      }
    },
    {
      id: 2,
      username: "sarah_johnson",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@example.com",
      dateJoined: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      avatarColor: "#8b5cf6",
      stats: {
        totalHabits: 15,
        activeHabits: 12,
        completedToday: 9,
        totalProgress: 92,
        currentStreak: 22,
        longestStreak: 60
      }
    },
    {
      id: 3,
      username: "mike_wilson",
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.w@example.com",
      dateJoined: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      avatarColor: "#10b981",
      stats: {
        totalHabits: 8,
        activeHabits: 6,
        completedToday: 4,
        totalProgress: 72,
        currentStreak: 8,
        longestStreak: 30
      }
    },
    {
      id: 4,
      username: "emma_davis",
      firstName: "Emma",
      lastName: "Davis",
      email: "emma.d@example.com",
      dateJoined: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      avatarColor: "#f59e0b",
      stats: {
        totalHabits: 10,
        activeHabits: 7,
        completedToday: 5,
        totalProgress: 78,
        currentStreak: 12,
        longestStreak: 28
      }
    },
    {
      id: 5,
      username: "david_brown",
      firstName: "David",
      lastName: "Brown",
      email: "david.b@example.com",
      dateJoined: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      avatarColor: "#ef4444",
      stats: {
        totalHabits: 20,
        activeHabits: 15,
        completedToday: 12,
        totalProgress: 88,
        currentStreak: 35,
        longestStreak: 75
      }
    },
    {
      id: 6,
      username: "lisa_anderson",
      firstName: "Lisa",
      lastName: "Anderson",
      email: "lisa.a@example.com",
      dateJoined: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      avatarColor: "#06b6d4",
      stats: {
        totalHabits: 6,
        activeHabits: 5,
        completedToday: 3,
        totalProgress: 65,
        currentStreak: 5,
        longestStreak: 12
      }
    },
    {
      id: 7,
      username: "james_martinez",
      firstName: "James",
      lastName: "Martinez",
      email: "james.m@example.com",
      dateJoined: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
      avatarColor: "#a855f7",
      stats: {
        totalHabits: 9,
        activeHabits: 7,
        completedToday: 0,
        totalProgress: 70,
        currentStreak: 0,
        longestStreak: 20
      }
    },
    {
      id: 8,
      username: "olivia_taylor",
      firstName: "Olivia",
      lastName: "Taylor",
      email: "olivia.t@example.com",
      dateJoined: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      avatarColor: "#f97316",
      stats: {
        totalHabits: 14,
        activeHabits: 11,
        completedToday: 8,
        totalProgress: 90,
        currentStreak: 18,
        longestStreak: 42
      }
    }
  ];
  return users;
};

export default function UsersPage() {
  const [users, setUsers] = useState(generateMockUsers());
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all"); // "all", "active", "recent", "inactive"
  const [sortBy, setSortBy] = useState("recent"); // "recent", "name", "progress", "joined"
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    // Activity filter
    const now = new Date();
    if (activityFilter === "active") {
      filtered = filtered.filter(user => {
        const hoursSinceLogin = (now - user.lastLogin) / (1000 * 60 * 60);
        return hoursSinceLogin < 24;
      });
    } else if (activityFilter === "recent") {
      filtered = filtered.filter(user => {
        const hoursSinceLogin = (now - user.lastLogin) / (1000 * 60 * 60);
        return hoursSinceLogin < 7 * 24; // Last week
      });
    } else if (activityFilter === "inactive") {
      filtered = filtered.filter(user => {
        const daysSinceLogin = (now - user.lastLogin) / (1000 * 60 * 60 * 24);
        return daysSinceLogin > 7;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "progress":
          return b.stats.totalProgress - a.stats.totalProgress;
        case "joined":
          return b.dateJoined - a.dateJoined;
        case "recent":
        default:
          return b.lastLogin - a.lastLogin;
      }
    });

    return filtered;
  }, [users, searchQuery, activityFilter, sortBy]);

  // Format date
  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const getInitials = (user) => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <span className={styles.primaryText}>Users</span>
          </h1>
          <span className={styles.countBadge}>
            {filteredAndSortedUsers.length} {filteredAndSortedUsers.length === 1 ? 'user' : 'users'}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchFiltersCard}>
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={styles.clearButton}
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <FiFilter size={18} />
              Activity
            </label>
            <div className={styles.filterButtons}>
              {["all", "active", "recent", "inactive"].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  className={`${styles.filterButton} ${activityFilter === filter ? styles.active : ""}`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="recent">Recently Active</option>
              <option value="name">Name (A-Z)</option>
              <option value="progress">Progress (High to Low)</option>
              <option value="joined">Date Joined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className={styles.usersGrid}>
        {filteredAndSortedUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <FiUsers size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No users found</h3>
            <p className={styles.emptyText}>
              {searchQuery
                ? "No users match your search criteria."
                : "No users match your filters."}
            </p>
          </div>
        ) : (
          filteredAndSortedUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              getInitials={getInitials}
              formatTimeAgo={formatTimeAgo}
              formatDate={formatDate}
              onClick={() => setSelectedUser(user)}
            />
          ))
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          getInitials={getInitials}
          formatTimeAgo={formatTimeAgo}
          formatDate={formatDate}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

// User Card Component
function UserCard({ user, getInitials, formatTimeAgo, formatDate, onClick }) {
  return (
    <div className={styles.userCard} onClick={onClick}>
      <div className={styles.userAvatar} style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}>
        {getInitials(user)}
      </div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>
          {user.firstName} {user.lastName}
        </h3>
        <p className={styles.userUsername}>@{user.username}</p>
        <div className={styles.userMeta}>
          <span className={styles.metaItem}>
            <FiMail size={14} />
            {user.email}
          </span>
        </div>
      </div>
      <div className={styles.userStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{user.stats.activeHabits}</div>
          <div className={styles.statLabel}>Active Habits</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{user.stats.totalProgress}%</div>
          <div className={styles.statLabel}>Progress</div>
        </div>
      </div>
      <div className={styles.userFooter}>
        <span className={styles.lastActive}>
          <FiClock size={14} />
          Active {formatTimeAgo(user.lastLogin)}
        </span>
      </div>
    </div>
  );
}

// User Profile Modal Component
function UserProfileModal({ user, getInitials, formatTimeAgo, formatDate, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalAvatar} style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}>
            {getInitials(user)}
          </div>
          <div className={styles.modalUserInfo}>
            <h2 className={styles.modalUserName}>
              {user.firstName} {user.lastName}
            </h2>
            <p className={styles.modalUsername}>@{user.username}</p>
            <div className={styles.modalMeta}>
              <span className={styles.modalMetaItem}>
                <FiMail size={16} />
                {user.email}
              </span>
              <span className={styles.modalMetaItem}>
                <FiCalendar size={16} />
                Joined {formatDate(user.dateJoined)}
              </span>
              <span className={styles.modalMetaItem}>
                <FiClock size={16} />
                Last active {formatTimeAgo(user.lastLogin)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalStats}>
          <div className={styles.modalStatCard}>
            <div className={styles.modalStatIcon} style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}>
              <FiTarget size={24} />
            </div>
            <div className={styles.modalStatContent}>
              <div className={styles.modalStatValue}>{user.stats.totalHabits}</div>
              <div className={styles.modalStatLabel}>Total Habits</div>
            </div>
          </div>

          <div className={styles.modalStatCard}>
            <div className={styles.modalStatIcon} style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}>
              <FiCheckCircle size={24} />
            </div>
            <div className={styles.modalStatContent}>
              <div className={styles.modalStatValue}>{user.stats.activeHabits}</div>
              <div className={styles.modalStatLabel}>Active Habits</div>
            </div>
          </div>

          <div className={styles.modalStatCard}>
            <div className={styles.modalStatIcon} style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}>
              <FiTrendingUp size={24} />
            </div>
            <div className={styles.modalStatContent}>
              <div className={styles.modalStatValue}>{user.stats.totalProgress}%</div>
              <div className={styles.modalStatLabel}>Overall Progress</div>
            </div>
          </div>

          <div className={styles.modalStatCard}>
            <div className={styles.modalStatIcon} style={{ background: `${user.avatarColor}20`, color: user.avatarColor }}>
              <FiAward size={24} />
            </div>
            <div className={styles.modalStatContent}>
              <div className={styles.modalStatValue}>{user.stats.currentStreak}</div>
              <div className={styles.modalStatLabel}>Current Streak</div>
            </div>
          </div>
        </div>

        <div className={styles.modalProgressSection}>
          <h3 className={styles.modalSectionTitle}>Progress Overview</h3>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${user.stats.totalProgress}%`, background: user.avatarColor }}
            />
          </div>
          <div className={styles.progressStats}>
            <div className={styles.progressStat}>
              <span className={styles.progressStatLabel}>Completed Today:</span>
              <span className={styles.progressStatValue}>{user.stats.completedToday}</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.progressStatLabel}>Longest Streak:</span>
              <span className={styles.progressStatValue}>{user.stats.longestStreak} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

