import { ArrowRight, CheckCircle2, TrendingUp, Target } from "lucide-react";
import styles from "@/styles/components/HeroSection.module.scss";

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      {/* Background Image with Overlay */}
      <div className={styles.backgroundWrapper}>
        <img 
          src={'/images/hero-habits.jpg'} 
          alt="Habit tracking progress visualization" 
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {/* Logo/Brand */}
          <div className={styles.brandBadge}>
            <Target className={styles.brandIcon} />
            <span>Progressor</span>
          </div>

          {/* Main Heading */}
          <h1 className={styles.mainHeading}>
            Построй жизнь своей{" "}
            <span className={styles.gradientText}>
              мечты
            </span>
          </h1>

          {/* Subheading */}
          <p className={styles.subheading}>
            Превращай цели в привычки, привычки в достижения. 
            Отслеживай прогресс и становись лучше каждый день.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>
              Log in
              <ArrowRight className={styles.buttonIcon} />
            </button>
            <button className={styles.secondaryButton}>
              Узнать больше
            </button>
          </div>

          {/* Feature Pills */}
          <div className={styles.featurePills}>
            <div className={styles.featurePill}>
              <CheckCircle2 className={`${styles.featureIcon} ${styles.primary}`} />
              <span className={styles.featureText}>Простое отслеживание</span>
            </div>
            <div className={styles.featurePill}>
              <TrendingUp className={`${styles.featureIcon} ${styles.secondary}`} />
              <span className={styles.featureText}>Визуализация прогресса</span>
            </div>
            <div className={styles.featurePill}>
              <Target className={`${styles.featureIcon} ${styles.primary}`} />
              <span className={styles.featureText}>Достигай целей</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`${styles.decorativeBlob} ${styles.topLeft}`} />
      <div className={`${styles.decorativeBlob} ${styles.bottomRight}`} />
    </section>
  );
};

export default HeroSection;