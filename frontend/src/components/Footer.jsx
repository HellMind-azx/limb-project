// Footer.jsx
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import styles from '@/styles/components/Footer.module.scss';
import Link from 'next/link';

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
              <li><Link href="/dashboard">Панель</Link></li>
              <li><Link href="/habits">Мои привычки</Link></li>
              <li><Link href="/statistics">Статистика</Link></li>
              <li><Link href="/profile">Профиль</Link></li>
            </ul>
          </div>

          {/* Ресурсы */}
          <div className={styles.section}>
            <h4 className={styles.heading}>Ресурсы</h4>
            <ul className={styles.list}>
              <li><Link href="/blog">Блог</Link></li>
              <li><Link href="/guides">Гайды</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/support">Поддержка</Link></li>
            </ul>
          </div>

          {/* Социальные сети */}
          <div className={styles.section}>
            <h4 className={styles.heading}>Связаться</h4>
            <div className={styles.social}>
              <Link href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </Link>
              <Link href="mailto:info@habittracker.com" aria-label="Email">
                <MdEmail />
              </Link>
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
          <Link href="/privacy">Конфиденциальность</Link>
          <Link href="/terms">Условия использования</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;