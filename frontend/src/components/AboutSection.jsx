'use client';

import styles from '@/styles/components/AboutSection.module.scss';

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Section header */}
          <h2 className={styles.title}>
            O <span className={styles.titleAccent}>Progressor</span>
          </h2>

          {/* Description */}
          <div className={styles.description}>
            <p className={styles.paragraph}>
              Progressor — это современная платформа для отслеживания привычек и личностного роста. 
              Мы помогаем вам создавать и поддерживать полезные привычки, отслеживать прогресс 
              и достигать поставленных целей.
            </p>
            <p className={styles.paragraph}>
              Наша миссия — сделать процесс самосовершенствования простым, понятным и мотивирующим. 
              С помощью интуитивных инструментов и аналитики вы сможете лучше понять свои паттерны 
              поведения и построить устойчивые привычки.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

