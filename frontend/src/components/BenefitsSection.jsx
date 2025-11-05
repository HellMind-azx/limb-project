'use client';

import { FiUsers, FiTarget, FiTrendingUp } from 'react-icons/fi';
import styles from '@/styles/components/BenefitsSection.module.scss';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: FiUsers,
      number: '01',
      title: "Общайтесь и развивайтесь",
      description: "Присоединяйтесь к процветающему сообществу единомышленников. Делитесь своим путем, получайте мотивацию и вместе отмечайте важные события."
    },
    {
      icon: FiTarget,
      number: '02',
      title: "Достигайте своих целей",
      description: "Устанавливайте четкие, действенные цели и легко отслеживайте свой прогресс. Наши инструменты помогут вам оставаться сосредоточенными и мотивированными."
    },
    {
      icon: FiTrendingUp,
      number: '03',
      title: "Умные инсайты",
      description: "Используйте аналитику на базе ИИ, чтобы понять свои привычки, выявить закономерности и оптимизировать свой распорядок для максимального эффекта."
    }
  ];

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Section header */}
          <h2 className={styles.title}>
            Почему выбирают <span className={styles.titleAccent}>Progressor</span>?
          </h2>

          {/* Benefits grid */}
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className={styles.benefitCard}>
                  <div className={styles.benefitHeader}>
                    <div className={styles.benefitNumber}>{benefit.number}</div>
                    <div className={styles.benefitIconWrapper}>
                      <IconComponent className={styles.benefitIcon} size={24} />
                    </div>
                  </div>
                  <h3 className={styles.benefitTitle}>
                    {benefit.title}
                  </h3>
                  <p className={styles.benefitDescription}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
