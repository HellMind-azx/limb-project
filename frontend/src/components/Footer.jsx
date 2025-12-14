// Footer.jsx
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import styles from '@/styles/components/Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* О проекте */}
          <div className={styles.section}>
            <h3 className={styles.title}>HabitTracker</h3>
            <p className={styles.description}>
              Создавай полезные привычки и достигай своих целей каждый день
            </p>
          </div>

          {/* Навигация */}
          <div className={styles.section}>
            <h4 className={styles.heading}>Навигация</h4>
            <ul className={styles.list}>
              <li><a href="/dashboard">Панель</a></li>
              <li><a href="/habits">Мои привычки</a></li>
              <li><a href="/statistics">Статистика</a></li>
              <li><a href="/profile">Профиль</a></li>
            </ul>
          </div>

          {/* Ресурсы */}
          <div className={styles.section}>
            <h4 className={styles.heading}>Ресурсы</h4>
            <ul className={styles.list}>
              <li><a href="/blog">Блог</a></li>
              <li><a href="/guides">Гайды</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Поддержка</a></li>
            </ul>
          </div>

          {/* Социальные сети */}
          <div className={styles.section}>
            <h4 className={styles.heading}>Связаться</h4>
            <div className={styles.social}>
              <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="mailto:info@habittracker.com" aria-label="Email">
                <MdEmail />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {currentYear} HabitTracker. Все права защищены.
        </p>
        <div className={styles.links}>
          <a href="/privacy">Конфиденциальность</a>
          <a href="/terms">Условия использования</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;