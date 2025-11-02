'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredUser, clearTokens, clearStoredUser } from '@/lib/auth';
import { FiArrowRight, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import styles from '@/styles/components/Navbar.module.scss';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();
  const user = getStoredUser();

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    clearTokens();
    clearStoredUser();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/habits', label: 'Habits' },
    { href: '/profile', label: 'Profile' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Progressor™
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navContainer}>
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  isActive(item.href) ? styles.active : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {/* Theme Toggle */}
          {user ? (
            <>
              <span className={styles.userName}>
                {user?.first_name || user?.username || 'User'}
              </span>
              <button onClick={handleLogout} className={styles.signInButton}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.signInButton}>
              Sign In
              <FiArrowRight className={styles.arrowIcon} />
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.mobileMenuButton}
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`${styles.mobileNavLink} ${
                isActive(item.href) ? styles.active : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className={styles.mobileLogoutButton}>
              Sign Out
            </button>
          ) : (
            <Link href="/login" className={styles.mobileSignInButton}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
