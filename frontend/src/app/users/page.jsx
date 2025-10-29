'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getStoredUser } from '@/lib/auth';
import { 
  FiSettings, 
  FiBell, 
  FiTarget,
  FiActivity,
  FiUsers,
  FiLoader,
  FiSearch,
  FiUserPlus,
  FiMessageCircle,
  FiCheck,
  FiX
} from 'react-icons/fi';
import styles from './users.module.scss';

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock users data (placeholder for future backend integration)
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'johndoe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      is_following: false,
      habits_count: 12,
      streak_count: 45,
      avatar_color: '#3B82F6'
    },
    {
      id: 2,
      username: 'janesmith',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      is_following: true,
      habits_count: 8,
      streak_count: 23,
      avatar_color: '#10B981'
    },
    {
      id: 3,
      username: 'alexbrown',
      first_name: 'Alex',
      last_name: 'Brown',
      email: 'alex@example.com',
      is_following: false,
      habits_count: 15,
      streak_count: 67,
      avatar_color: '#F59E0B'
    },
    {
      id: 4,
      username: 'sarahwilson',
      first_name: 'Sarah',
      last_name: 'Wilson',
      email: 'sarah@example.com',
      is_following: true,
      habits_count: 10,
      streak_count: 34,
      avatar_color: '#EF4444'
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = getStoredUser();
    setUser(storedUser);
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(u => 
          u.username.toLowerCase().includes(query) ||
          u.first_name.toLowerCase().includes(query) ||
          u.last_name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const handleSidebarNavigation = (path) => {
    router.push(path);
  };

  const handleFollow = (userId) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, is_following: !u.is_following } : u
      )
    );
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

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
            <span className={styles.primaryText}>Users</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className={styles.searchCard}>
          <div className={styles.searchWrapper}>
            <FiSearch size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
              >
                <FiX size={18} />
              </button>
            )}
          </div>
          <div className={styles.searchResults}>
            Found {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
              <FiLoader size={48} />
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>
              {searchQuery ? 'No users found matching your search' : 'No users available'}
            </div>
          </div>
        ) : (
          <div className={styles.usersGrid}>
            {filteredUsers.map(userItem => (
              <div key={userItem.id} className={styles.userCard}>
                <div className={styles.userHeader}>
                  <div 
                    className={styles.userAvatar}
                    style={{ background: userItem.avatar_color }}
                  >
                    {getInitials(userItem.first_name, userItem.last_name)}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {userItem.first_name} {userItem.last_name}
                    </div>
                    <div className={styles.userUsername}>@{userItem.username}</div>
                  </div>
                </div>
                
                <div className={styles.userStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>{userItem.habits_count}</div>
                    <div className={styles.statLabel}>Habits</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>{userItem.streak_count}</div>
                    <div className={styles.statLabel}>Day Streak</div>
                  </div>
                </div>

                <div className={styles.userActions}>
                  <button
                    onClick={() => handleFollow(userItem.id)}
                    className={`${styles.actionButton} ${
                      userItem.is_following ? styles.following : styles.follow
                    }`}
                  >
                    {userItem.is_following ? (
                      <>
                        <FiCheck size={16} />
                        Following
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={16} />
                        Follow
                      </>
                    )}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.message}`}
                    title="Message (Coming soon)"
                  >
                    <FiMessageCircle size={16} />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

