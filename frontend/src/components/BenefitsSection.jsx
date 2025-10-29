'use client';

import { FiUsers, FiTarget, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import styles from '@/styles/components/BenefitsSection.module.scss';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: FiUsers,
      title: "Общайтесь и развивайтесь",
      description: "Присоединяйтесь к процветающему сообществу единомышленников. Делитесь своим путем, получайте мотивацию и вместе отмечайте важные события.",
      cardClass: styles.blue,
      iconClass: styles.blue
    },
    {
      icon: FiTarget,
      title: "Достигайте своих целей",
      description: "Устанавливайте четкие, действенные цели и легко отслеживайте свой прогресс. Наши инструменты помогут вам оставаться сосредоточенными и мотивированными.",
      cardClass: styles.green,
      iconClass: styles.green
    },
    {
      icon: FiTrendingUp,
      title: "Умные инсайты",
      description: "Используйте аналитику на базе ИИ, чтобы понять свои привычки, выявить закономерности и оптимизировать свой распорядок для максимального эффекта.",
      cardClass: styles.purple,
      iconClass: styles.purple
    }
  ];

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        {/* Section header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Почему выбирают <span className={styles.titleAccent}>Progressor</span>?
          </h2>
        </div>

        {/* Benefits cards */}
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className={`${styles.benefitCard} ${benefit.cardClass}`}
              >
                {/* Icon */}
                <div className={`${styles.benefitIcon} ${benefit.iconClass}`}>
                  <IconComponent className={styles.benefitIconInner} size={32} />
                </div>

                {/* Content */}
                <h3 className={styles.benefitTitle}>
                  {benefit.title}
                </h3>
                
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>

                {/* Learn more link */}
                <a 
                  href="#" 
                  className={styles.benefitLink}
                >
                  Узнать больше
                  <FiArrowRight className={styles.benefitLinkIcon} size={16} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
