'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setTokens, setStoredUser } from '@/lib/auth';
import { FiCheck } from 'react-icons/fi';
import styles from './Login.module.scss';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
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
      const response = await api.post('/auth/login/', formData);
      const { user, tokens } = response.data;
      
      setTokens(tokens.access, tokens.refresh);
      setStoredUser(user);
      
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Section - Form */}
      <div className={styles.formSection}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>P</div>
            <span className={styles.logoText}>Progressor</span>
          </div>

          {/* Welcome Text */}
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>Hello, Welcome Back</h2>
            <p className={styles.welcomeSubtitle}>
              Hey, welcome back to your special place
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email Input */}
            <div className={styles.inputGroup}>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={styles.input}
                placeholder="stanley@gmail.com"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div className={styles.inputGroup}>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Remember Me & Forgot Password */}
            <div className={styles.optionsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkmark}>
                  {rememberMe && <FiCheck />}
                </span>
                <span className={styles.checkboxText}>Remember me</span>
              </label>
              <Link href="#" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <div className={styles.signupRow}>
              <span className={styles.signupText}>Don't have an account?</span>
              <Link href="/register" className={styles.signupLink}>
                Sign Up
              </Link>
            </div>
          </form>
      </div>

      {/* Right Section - Illustration */}
      <div className={styles.illustrationSection}>
        <img className={styles.illustrationImage}src="images/login.jpg"/>
      </div>
    </div>
  );
}
