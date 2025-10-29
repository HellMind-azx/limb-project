'use client';

import { FiTarget, FiTrendingUp, FiUsers, FiClock } from 'react-icons/fi';
import styles from '@/styles/components/AboutSection.module.scss';

export default function AboutSection() {
  const features = [
    {
      icon: FiTarget,
      title: "Goal Setting",
      description: "Define clear, actionable goals and break them down into manageable habits"
    },
    {
      icon: FiTrendingUp,
      title: "Progress Tracking", 
      description: "Monitor your daily progress with beautiful visualizations and insights"
    },
    {
      icon: FiUsers,
      title: "Community Support",
      description: "Connect with like-minded individuals on their personal development journey"
    },
    {
      icon: FiClock,
      title: "Smart Reminders",
      description: "Never miss a habit with intelligent notifications and scheduling"
    }
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left side - Decorative elements */}
          <div className={styles.decorativeSection}>
            {/* Background decorative squares */}
            <div className={styles.backgroundDecorations}>
              <div className={styles.decorativeSquare}></div>
              <div className={styles.decorativeSquare}></div>
              <div className={styles.decorativeSquare}></div>
              <div className={styles.decorativeSquare}></div>
              <div className={styles.decorativeSquare}></div>
              <div className={styles.decorativeSquare}></div>
            </div>

            {/* Neumorphic cards */}
            <div className={styles.neuCards}>
              <div className={styles.neuCard}>
                <div className={styles.cardContent}>
                  <div className={`${styles.cardIcon} ${styles.primary}`}>
                    <FiTarget className={styles.cardIconInner} size={20} />
                  </div>
                  <div className={styles.cardText}>
                    <h4 className={styles.cardTitle}>Smart Goals</h4>
                    <p className={styles.cardDescription}>Set achievable targets</p>
                  </div>
                </div>
              </div>

              <div className={styles.neuCard}>
                <div className={styles.cardContent}>
                  <div className={`${styles.cardIcon} ${styles.accent1}`}>
                    <FiTrendingUp className={styles.cardIconInner} size={20} />
                  </div>
                  <div className={styles.cardText}>
                    <h4 className={styles.cardTitle}>Track Progress</h4>
                    <p className={styles.cardDescription}>Monitor your growth</p>
                  </div>
                </div>
              </div>

              <div className={styles.neuCard}>
                <div className={styles.cardContent}>
                  <div className={`${styles.cardIcon} ${styles.accent2}`}>
                    <FiUsers className={styles.cardIconInner} size={20} />
                  </div>
                  <div className={styles.cardText}>
                    <h4 className={styles.cardTitle}>Community</h4>
                    <p className={styles.cardDescription}>Connect & motivate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className={styles.textSection}>
            <div>
              <h2 className={styles.sectionTitle}>
                О <span className={styles.titleAccent}>Progressor</span>
              </h2>
              <p className={styles.sectionDescription}>
                Progressor разработан, чтобы расширить ваши возможности на пути самосовершенствования. 
                Наша платформа помогает вам устанавливать, отслеживать и достигать личных целей с помощью 
                умных инсайтов и поддерживающего сообщества.
              </p>
            </div>

            {/* Features grid */}
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className={styles.featureCard}>
                    <div className={styles.featureContent}>
                      <div className={styles.featureIcon}>
                        <IconComponent className={styles.featureIconInner} size={18} />
                      </div>
                      <div className={styles.featureText}>
                        <h4 className={styles.featureTitle}>{feature.title}</h4>
                        <p className={styles.featureDescription}>{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
