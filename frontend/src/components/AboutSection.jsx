// pages/about.jsx
import styles from '@/styles/components/AboutSection.module.scss';
import { FiUsers, FiTarget, FiTrendingUp } from 'react-icons/fi';

export default function About() {
  const features = [
    {
      icon: <FiTarget/>,
      title: 'Ставьте цели',
      description: 'Определяйте конкретные привычки и отслеживайте прогресс к своим целям'
    },
    {
      icon: '✓',
      title: 'Отмечайте выполнение',
      description: 'Простой интерфейс для ежедневного отслеживания ваших привычек'
    },
    {
      icon: <FiTrendingUp/>,
      title: 'Анализируйте прогресс',
      description: 'Визуализация данных и статистика помогут понять ваши результаты'
    },
    {
      icon: <FiUsers />,
      title: 'Делитесь успехами',
      description: 'Мотивируйте друг друга и достигайте целей вместе'
    }
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            О трекере привычек
          </h2>
          <p className={styles.heroSubtitle}>
            Инструмент для формирования полезных привычек и достижения ваших целей
          </p>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.mockupCard}>
            <div className={styles.mockupHeader}></div>
            <div className={styles.mockupContent}>
              <div className={styles.mockupItem}></div>
              <div className={styles.mockupItem}></div>
              <div className={styles.mockupItem}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.splitSection}>
        <div className={styles.splitContent}>
          <h2 className={styles.sectionTitle}>Наша миссия</h2>
          <p className={styles.sectionText}>
            Мы верим, что маленькие ежедневные действия приводят к большим изменениям. 
            Наш трекер помогает людям создавать и поддерживать привычки, которые 
            улучшают качество жизни.
          </p>
          <p className={styles.sectionText}>
            Исследования показывают, что для формирования новой привычки требуется 
            в среднем 66 дней последовательных действий. Мы делаем этот процесс 
            простым, наглядным и мотивирующим.
          </p>
        </div>
        <div className={styles.splitVisual}>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Активных пользователей</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500K+</div>
              <div className={styles.statLabel}>Привычек создано</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>85%</div>
              <div className={styles.statLabel}>Процент успеха</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.centerTitle}>Почему выбирают нас</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.splitSection + ' ' + styles.reverseSection}>
        <div className={styles.splitVisual}>
          <div className={styles.timelineCard}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4>2022</h4>
                <p>Запуск проекта</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4>2023</h4>
                <p>5000 пользователей</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4>2024</h4>
                <p>Новые функции</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.splitContent}>
          <h2 className={styles.sectionTitle}>Наша история</h2>
          <p className={styles.sectionText}>
            Проект начался с простой идеи — создать инструмент, который действительно 
            помогает людям менять жизнь к лучшему. Мы сами боролись с прокрастинацией 
            и знаем, как сложно начать и не бросить.
          </p>
          <p className={styles.sectionText}>
            Сегодня наш трекер используют тысячи людей по всему миру для достижения 
            самых разных целей — от здорового образа жизни до профессионального развития.
          </p>
        </div>
      </section>

    </div>
  );
}