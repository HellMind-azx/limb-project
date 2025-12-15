// HeroSection.jsx
import styles from '@/styles/components/HeroSection.module.scss';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/habits', label: 'Habits' },
  { href: '/support', label: 'Support' },
];

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Новое</span>
            <span className={styles.badgeLabel}>Отслеживание привычек</span>
          </div>
          
          <h2 className={styles.title}>
            Все привычки в одном приложении
          </h2>
          
          <p className={styles.description}>
            Держите ваши цели под контролем. Отслеживайте прогресс, 
            создавайте новые привычки легко и эффективно.
          </p>
          
          <div className={styles.buttons}>
            <Link href='/habits'>
            <button className={styles.btnPrimary}>
              Попробовать бесплатно
            </button>
            </Link>
            <button className={styles.btnSecondary}>
              <span className={styles.previewIcon}>▶</span>
              Предварительный просмотр
            </button>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.avatars}>
              <img src="https://i.pravatar.cc/40?img=1" alt="User" />
              <img src="https://i.pravatar.cc/40?img=2" alt="User" />
              <img src="https://i.pravatar.cc/40?img=3" alt="User" />
            </div>
            <div className={styles.statsText}>
              <strong>12k+</strong>
              <span>Используется пользователями по всему миру</span>
            </div>
          </div>
        </div>
        
        <div className={styles.imageWrapper}>
          <div className={styles.mockup}>
            <div className={styles.mockupHeader}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
            
            <div className={styles.mockupContent}>
              <div className={styles.balanceCard}>
                <div className={styles.flag}>🔥</div>
                <span className={styles.amount}>90 дней</span>
              </div>
              
              <div className={styles.totalSection}>
                <h3>Общий прогресс</h3>
                <div className={styles.totalValue}>73%</div>
              </div>
              
              <div className={styles.chart}>
                <div className={styles.chartLabels}>
                  <span>100%</span>
                  <span>50%</span>
                  <span>0</span>
                </div>
                <div className={styles.chartBar}>
                  <div className={styles.barFill}>
                    <span className={styles.tooltip}>73%</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.habits}>
                <div className={styles.habitItem}>
                  <span className={styles.habitIcon}>💧</span>
                  <span>8 стаканов</span>
                  <span className={styles.habitLabel}>Выпить воды</span>
                </div>
                <div className={styles.habitItem}>
                  <span className={styles.habitIcon}>🏃</span>
                  <span>5 км</span>
                  <span className={styles.habitLabel}>Пробежка утром</span>
                </div>
                <div className={styles.habitItem}>
                  <span className={styles.habitIcon}>📚</span>
                  <span>30 минут</span>
                  <span className={styles.habitLabel}>Чтение книг</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.brands}>
        <div className={styles.brandItem}>slack</div>
        <div className={styles.brandItem}>zoom</div>
        <div className={styles.brandItem}>airbnb</div>
        <div className={styles.brandItem}>spotify</div>
        <div className={styles.brandItem}>envato</div>
      </div>
    </section>
  );
}