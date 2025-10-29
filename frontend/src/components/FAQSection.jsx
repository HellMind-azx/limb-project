'use client';

import { useState } from 'react';
import { FiSearch, FiPlus, FiX, FiMail } from 'react-icons/fi';
import styles from '@/styles/components/FAQSection.module.scss';

export default function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "Что такое Progressor?",
      answer: "Progressor — это платформа для отслеживания привычек и личного развития на базе ИИ, разработанная, чтобы помочь вам формировать и поддерживать позитивные привычки. Мы предоставляем инструменты для постановки целей, отслеживания прогресса и анализа ваших паттернов поведения."
    },
    {
      question: "Как ИИ помогает в отслеживании привычек?",
      answer: "Наш ИИ анализирует ваш прогресс, выявляет тенденции и предоставляет персонализированные рекомендации для оптимизации вашего пути формирования привычек. Он может предсказывать, когда вы можете пропустить привычку, и предлагать стратегии для поддержания мотивации."
    },
    {
      question: "Progressor бесплатен?",
      answer: "Progressor предлагает бесплатный уровень с основными функциями отслеживания привычек, базовой аналитикой и ограниченным количеством привычек. Премиум-планы включают расширенную аналитику, неограниченное количество привычек, приоритетную поддержку и дополнительные инструменты."
    },
    {
      question: "Могу ли я отслеживать несколько привычек?",
      answer: "Да, вы можете отслеживать неограниченное количество привычек и категоризировать их для лучшей организации. Наша платформа поддерживает различные типы привычек: ежедневные, еженедельные, ежемесячные и даже нерегулярные активности."
    },
    {
      question: "Как работает система напоминаний?",
      answer: "Система напоминаний использует умные алгоритмы для определения оптимального времени для каждой привычки на основе вашей активности и предпочтений. Вы можете настроить время, частоту и тип уведомлений для каждой привычки отдельно."
    },
    {
      question: "Безопасны ли мои данные?",
      answer: "Да, мы серьезно относимся к безопасности данных. Все ваши личные данные и информация о привычках шифруются и хранятся безопасно. Мы никогда не передаем ваши данные третьим лицам без вашего явного согласия."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        {/* Glassmorphic FAQ card */}
        <div className={styles.faqCard}>
          {/* Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Часто задаваемые вопросы
            </h2>
            <p className={styles.sectionDescription}>
              Наша платформа создана, чтобы помочь вам работать умнее, а не усерднее. 
              Она адаптируется к вашим потребностям и поддерживает ваши цели.
            </p>
          </div>

          {/* Search bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Поиск ответов"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* FAQ List */}
          <div className={styles.faqList}>
            {filteredFaqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                  className={styles.faqButton}
                >
                  <h3 className={styles.faqQuestion}>
                    {faq.question}
                  </h3>
                  <div className={styles.faqIcon}>
                    {expandedFaq === index ? (
                      <FiX className={styles.expand} size={20} />
                    ) : (
                      <FiPlus className={styles.collapse} size={20} />
                    )}
                  </div>
                </button>
                
                {expandedFaq === index && (
                  <div className={styles.faqAnswer}>
                    <p>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact section */}
          <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>
              Остались вопросы?
            </h3>
            <p className={styles.contactDescription}>
              Наша команда поддержки готова помочь вам
            </p>
            <button className={styles.contactButton}>
              <FiMail className={styles.contactIcon} size={18} />
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
