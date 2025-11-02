'use client';

import Link from 'next/link';
import { 
  FiPlus, 
  FiArrowRight, 
  FiTarget, 
  FiTrendingUp, 
  FiCalendar,
  FiCheck,
  FiActivity
} from 'react-icons/fi';
import styles from '@/styles/components/HeroSection.module.scss';

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      {/* Background with geometric patterns */}
      <div className={styles.heroBackground}></div>

      {/* Container with overlap layout */}
      <div className={styles.heroContainer}>
        {/* Left - Hero content */}
        <div className={styles.heroLeft}>
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
              <span className={styles.ctaText}>Start Tracking</span>
              <span className={styles.ctaIcon}>
                <FiArrowRight size={20} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right - Decorative widgets with diagonal layout */}
        <div className={styles.widgetsGrid}>
          {/* Card 1: Active Habits (top-right) */}
          <div className={styles.habitCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Active Habits</h3>
              <div className={styles.cardIcon}>
                <FiTarget size={16} />
              </div>
            </div>
            <div className={styles.habitList}>
              <div className={styles.habitItem}>
                <div className={`${styles.habitIcon} ${styles.green}`}>
                  <FiCheck size={20} />
                </div>
                <div className={styles.habitInfo}>
                  <div className={styles.habitName}>Morning Exercise</div>
                  <div className={styles.habitProgress}>12 day streak</div>
                </div>
              </div>
              <div className={styles.habitItem}>
                <div className={`${styles.habitIcon} ${styles.yellow}`}>
                  <FiCheck size={20} />
                </div>
                <div className={styles.habitInfo}>
                  <div className={styles.habitName}>Reading</div>
                  <div className={styles.habitProgress}>8 day streak</div>
                </div>
              </div>
              <div className={styles.habitItem}>
                <div className={`${styles.habitIcon} ${styles.cyan}`}>
                  <FiCheck size={20} />
                </div>
                <div className={styles.habitInfo}>
                  <div className={styles.habitName}>Meditation</div>
                  <div className={styles.habitProgress}>20 day streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Streak (mid-right) */}
          <div className={styles.streakCard}>
            <div className={styles.streakIcon}>
              <FiCalendar size={32} />
            </div>
            <div className={styles.streakValue}>42</div>
            <div className={styles.streakLabel}>Days Streak</div>
          </div>

          {/* Card 3: Progress (middle, shifted left) */}
          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <h3 className={styles.progressTitle}>Work Progress</h3>
              <div className={styles.progressValue}>84%</div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '84%' }}></div>
            </div>
            <div className={styles.progressLegend}>
              <span className={styles.completed}>Completed</span>
              <span className={styles.active}>Active</span>
              <span className={styles.pending}>Pending</span>
            </div>
          </div>

          {/* Card 4: Stats (bottom-left) */}
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3 className={styles.statsTitle}>Weekly Stats</h3>
              <div className={styles.statsIcon}>
                <FiTrendingUp size={16} />
              </div>
            </div>
            <div className={styles.statsValue}>+15.3%</div>
            <div className={styles.statsLabel}>vs last week</div>
            <div className={styles.statsGraph}>
              <div className={styles.graphBar} style={{ height: '60%' }}></div>
              <div className={styles.graphBar} style={{ height: '80%' }}></div>
              <div className={styles.graphBar} style={{ height: '45%' }}></div>
              <div className={styles.graphBar} style={{ height: '90%' }}></div>
              <div className={styles.graphBar} style={{ height: '70%' }}></div>
              <div className={styles.graphBar} style={{ height: '100%' }}></div>
              <div className={styles.graphBar} style={{ height: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
