'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredUser, clearTokens, clearStoredUser } from '@/lib/auth';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import styles from '@/styles/components/Navbar.module.scss';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = getStoredUser();

  const handleLogout = () => {
    clearTokens();
    clearStoredUser();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/habits', label: 'Habits' },
    { href: '/dashboard', label: 'Dashboard' },
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
