'use client';

import Link from 'next/link';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import styles from '@/styles/components/HeroSection.module.scss';

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      {/* Background with decorative elements */}
      <div className={styles.heroBackground}>
        {/* Decorative squares */}
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
        <div className={styles.decorativeSquare}></div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Slogan */}
        <div className={styles.slogan}>
          <FiPlus className={styles.sloganIcon} size={16} />
          <span className={styles.sloganText}>
            Build Better Habits
          </span>
        </div>

        {/* Main heading */}
        <h1 className={styles.heading}>
          Transform Your Life,<br />
          <span className={styles.headingAccent}>One Habit at a Time</span>
        </h1>

        {/* Subheading */}
        <p className={styles.subheading}>
          Track progress, build streaks, and achieve your goals with powerful habit tracking tools designed for consistency and growth.
        </p>

        {/* CTA Button */}
        <Link 
          href="/habits" 
          className={styles.ctaButton}
        >
          Start Tracking Now
          <FiArrowRight className={styles.ctaIcon} size={20} />
        </Link>
      </div>
    </section>
  );
}
