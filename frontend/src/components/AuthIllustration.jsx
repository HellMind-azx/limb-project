'use client';

import styles from '@/styles/components/AuthIllustration.module.scss';

export default function AuthIllustration() {
  return (
    <div className={styles.illustrationContainer}>
      {/* Background Gradient */}
      <div className={styles.gradientBackground} />
      
      {/* Floating Clouds */}
      <div className={styles.cloud1} />
      <div className={styles.cloud2} />
      <div className={styles.cloud3} />
      <div className={styles.cloud4} />
      
      {/* Security Icons */}
      <div className={styles.checkmarkIcon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className={styles.lockIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Central Fingerprint Element */}
      <div className={styles.fingerprintContainer}>
        <div className={styles.fingerprintCircle}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9.5C15 10.3 14.3 11 13.5 11H10.5C9.7 11 9 10.3 9 9.5V7.5L3 7V9C3 10.1 3.9 11 5 11H7V13C7 14.1 7.9 15 9 15H11V17C11 18.1 11.9 19 13 19H15V21C15 22.1 15.9 23 17 23H19C20.1 23 21 22.1 21 21V19H19V17C19 15.9 18.1 15 17 15H15V13C15 11.9 14.1 11 13 11H11V9C11 7.9 10.1 7 9 7H7V5C7 3.9 6.1 3 5 3H3C1.9 3 1 3.9 1 5V7C1 8.1 1.9 9 3 9H5V11C5 12.1 5.9 13 7 13H9V15C9 16.1 9.9 17 11 17H13V19C13 20.1 13.9 21 15 21H17V23H19C20.1 23 21 22.1 21 21V19C21 17.9 20.1 17 19 17H17V15C17 13.9 16.1 13 15 13H13V11C13 9.9 12.1 9 11 9H9V7C9 5.9 8.1 5 7 5H5C3.9 5 3 5.9 3 7V9Z" 
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={styles.fingerprintText}>
          <span>Secure Access</span>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className={styles.decorativeCircle1} />
      <div className={styles.decorativeCircle2} />
      <div className={styles.decorativeCircle3} />
    </div>
  );
}
