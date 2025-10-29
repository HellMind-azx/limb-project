'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthIllustration from '@/components/AuthIllustration';
import api from '@/lib/api';
import { setTokens, setStoredUser } from '@/lib/auth';
import { FiCheck } from 'react-icons/fi';
import styles from './Register.module.scss';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register/', formData);
      const { user, tokens } = response.data;
      
      setTokens(tokens.access, tokens.refresh);
      setStoredUser(user);
      
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      {/* Left Section - Form */}
      <div className={styles.formSection}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>P</div>
            <span className={styles.logoText}>Progressor</span>
          </div>

          {/* Welcome Text */}
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>Create Your Account</h1>
            <p className={styles.welcomeSubtitle}>
              Start your personal growth journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Username Input */}
            <div className={styles.inputGroup}>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={styles.input}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div className={styles.inputGroup}>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Name Inputs */}
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className={styles.input}
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className={styles.input}
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className={styles.inputGroup}>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            {/* Sign In Link */}
            <div className={styles.signinRow}>
              <span className={styles.signinText}>Already have an account?</span>
              <Link href="/login" className={styles.signinLink}>
                Sign In
              </Link>
            </div>
          </form>
      </div>

      {/* Right Section - Illustration */}
      <div className={styles.illustrationSection}>
        <AuthIllustration />
      </div>
    </div>
  );
}
