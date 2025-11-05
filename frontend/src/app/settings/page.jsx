"use client";

import { useState, useEffect } from "react";
import {
  FiSettings,
  FiMoon,
  FiSun,
  FiBell,
  FiMail,
  FiGlobe,
  FiShield,
  FiDatabase,
  FiSave,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiVolume2,
  FiEye,
  FiDownload,
  FiTrash2,
  FiRefreshCw
} from "react-icons/fi";
import styles from "./settings.module.scss";
import { getPreferences, updatePreferences } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "dark",
    fontSize: "medium",
    compactMode: false
  });

  // Notifications settings
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    weeklyReports: true,
    sounds: true,
    habitReminders: true,
    achievementAlerts: true
  });

  // Language & Region settings
  const [language, setLanguage] = useState({
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC"
  });

  // Privacy & Security settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showStats: true,
    showProgress: true,
    allowMessages: true
  });

  // Load preferences on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await getPreferences();
      
      // Set appearance settings
      if (data.theme) {
        const savedTheme = localStorage.getItem("theme") || data.theme;
        setAppearance(prev => ({
          ...prev,
          theme: savedTheme,
          fontSize: data.fontSize || "medium",
          compactMode: data.compactMode || false
        }));
        applyTheme(savedTheme);
      }

      // Set notification settings
      setNotifications({
        push: data.notifications !== false,
        email: data.email_notifications !== false,
        weeklyReports: data.weekly_reports !== false,
        sounds: data.sounds !== false,
        habitReminders: data.habit_reminders !== false,
        achievementAlerts: data.achievement_alerts !== false
      });

      // Set language settings
      setLanguage({
        language: data.language || "en",
        dateFormat: data.date_format || "MM/DD/YYYY",
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Set privacy settings
      setPrivacy({
        profileVisibility: data.profile_visibility || "public",
        showStats: data.show_stats !== false,
        showProgress: data.show_progress !== false,
        allowMessages: data.allow_messages !== false
      });
    } catch (error) {
      console.error("Failed to load preferences:", error);
      showMessage("error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleAppearanceSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        theme: appearance.theme,
        fontSize: appearance.fontSize,
        compactMode: appearance.compactMode
      });
      applyTheme(appearance.theme);
      showMessage("success", "Appearance settings saved!");
    } catch (error) {
      showMessage("error", error.response?.data?.error || "Failed to save appearance settings");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        notifications: notifications.push,
        email_notifications: notifications.email,
        weekly_reports: notifications.weeklyReports,
        sounds: notifications.sounds,
        habit_reminders: notifications.habitReminders,
        achievement_alerts: notifications.achievementAlerts
      });
      showMessage("success", "Notification settings saved!");
    } catch (error) {
      showMessage("error", error.response?.data?.error || "Failed to save notification settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        language: language.language,
        date_format: language.dateFormat,
        timezone: language.timezone
      });
      localStorage.setItem("language", language.language);
      showMessage("success", "Language settings saved!");
    } catch (error) {
      showMessage("error", error.response?.data?.error || "Failed to save language settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePrivacySave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        profile_visibility: privacy.profileVisibility,
        show_stats: privacy.showStats,
        show_progress: privacy.showProgress,
        allow_messages: privacy.allowMessages
      });
      showMessage("success", "Privacy settings saved!");
    } catch (error) {
      showMessage("error", error.response?.data?.error || "Failed to save privacy settings");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    const data = {
      preferences: {
        appearance,
        notifications,
        language,
        privacy
      },
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settings-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage("success", "Settings exported successfully!");
  };

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear cache? This will log you out.")) {
      localStorage.clear();
      sessionStorage.clear();
      showMessage("success", "Cache cleared. Please refresh the page.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FiSettings size={32} className={styles.titleIcon} />
          <span className={styles.primaryText}>Settings</span>
        </h1>
        <p className={styles.subtitle}>Manage your account preferences and global settings</p>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.type === "success" ? (
            <FiCheck size={20} />
          ) : message.type === "error" ? (
            <FiAlertCircle size={20} />
          ) : null}
          <span>{message.text}</span>
        </div>
      )}

      {/* Appearance Section */}
      <SettingsSection
        icon={FiMoon}
        title="Appearance"
        description="Customize the look and feel of the application"
      >
        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Theme</label>
            <p className={styles.settingDescription}>Choose your preferred color scheme</p>
          </div>
          <div className={styles.themeButtons}>
            <button
              className={`${styles.themeButton} ${appearance.theme === "light" ? styles.active : ""}`}
              onClick={() => setAppearance({ ...appearance, theme: "light" })}
            >
              <FiSun size={20} />
              Light
            </button>
            <button
              className={`${styles.themeButton} ${appearance.theme === "dark" ? styles.active : ""}`}
              onClick={() => setAppearance({ ...appearance, theme: "dark" })}
            >
              <FiMoon size={20} />
              Dark
            </button>
            <button
              className={`${styles.themeButton} ${appearance.theme === "auto" ? styles.active : ""}`}
              onClick={() => setAppearance({ ...appearance, theme: "auto" })}
            >
              <FiSettings size={20} />
              Auto
            </button>
          </div>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Font Size</label>
            <p className={styles.settingDescription}>Adjust text size for better readability</p>
          </div>
          <select
            value={appearance.fontSize}
            onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
            className={styles.select}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Compact Mode</label>
            <p className={styles.settingDescription}>Reduce spacing for a more compact interface</p>
          </div>
          <ToggleSwitch
            checked={appearance.compactMode}
            onChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
          />
        </div>

        <button
          className={styles.saveButton}
          onClick={handleAppearanceSave}
          disabled={saving}
        >
          <FiSave size={18} />
          {saving ? "Saving..." : "Save Appearance"}
        </button>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection
        icon={FiBell}
        title="Notifications"
        description="Control how and when you receive notifications"
      >
        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Push Notifications</label>
            <p className={styles.settingDescription}>Receive browser push notifications</p>
          </div>
          <ToggleSwitch
            checked={notifications.push}
            onChange={(checked) => setNotifications({ ...notifications, push: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Email Notifications</label>
            <p className={styles.settingDescription}>Receive notifications via email</p>
          </div>
          <ToggleSwitch
            checked={notifications.email}
            onChange={(checked) => setNotifications({ ...notifications, email: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Weekly Reports</label>
            <p className={styles.settingDescription}>Get weekly progress summaries</p>
          </div>
          <ToggleSwitch
            checked={notifications.weeklyReports}
            onChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Sounds</label>
            <p className={styles.settingDescription}>Play sounds for notifications</p>
          </div>
          <ToggleSwitch
            checked={notifications.sounds}
            onChange={(checked) => setNotifications({ ...notifications, sounds: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Habit Reminders</label>
            <p className={styles.settingDescription}>Get reminders for incomplete habits</p>
          </div>
          <ToggleSwitch
            checked={notifications.habitReminders}
            onChange={(checked) => setNotifications({ ...notifications, habitReminders: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Achievement Alerts</label>
            <p className={styles.settingDescription}>Get notified when you achieve milestones</p>
          </div>
          <ToggleSwitch
            checked={notifications.achievementAlerts}
            onChange={(checked) => setNotifications({ ...notifications, achievementAlerts: checked })}
          />
        </div>

        <button
          className={styles.saveButton}
          onClick={handleNotificationsSave}
          disabled={saving}
        >
          <FiSave size={18} />
          {saving ? "Saving..." : "Save Notifications"}
        </button>
      </SettingsSection>

      {/* Language & Region Section */}
      <SettingsSection
        icon={FiGlobe}
        title="Language & Region"
        description="Set your language and regional preferences"
      >
        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Language</label>
            <p className={styles.settingDescription}>Choose your preferred language</p>
          </div>
          <select
            value={language.language}
            onChange={(e) => setLanguage({ ...language, language: e.target.value })}
            className={styles.select}
          >
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Date Format</label>
            <p className={styles.settingDescription}>How dates should be displayed</p>
          </div>
          <select
            value={language.dateFormat}
            onChange={(e) => setLanguage({ ...language, dateFormat: e.target.value })}
            className={styles.select}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD MMM YYYY">DD MMM YYYY</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Timezone</label>
            <p className={styles.settingDescription}>Your local timezone</p>
          </div>
          <select
            value={language.timezone}
            onChange={(e) => setLanguage({ ...language, timezone: e.target.value })}
            className={styles.select}
          >
            {Intl.supportedValuesOf("timeZone").slice(0, 20).map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <button
          className={styles.saveButton}
          onClick={handleLanguageSave}
          disabled={saving}
        >
          <FiSave size={18} />
          {saving ? "Saving..." : "Save Language"}
        </button>
      </SettingsSection>

      {/* Privacy & Security Section */}
      <SettingsSection
        icon={FiShield}
        title="Privacy & Security"
        description="Control your privacy and security settings"
      >
        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Profile Visibility</label>
            <p className={styles.settingDescription}>Who can see your profile</p>
          </div>
          <select
            value={privacy.profileVisibility}
            onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
            className={styles.select}
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Show Statistics</label>
            <p className={styles.settingDescription}>Allow others to see your statistics</p>
          </div>
          <ToggleSwitch
            checked={privacy.showStats}
            onChange={(checked) => setPrivacy({ ...privacy, showStats: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Show Progress</label>
            <p className={styles.settingDescription}>Allow others to see your progress</p>
          </div>
          <ToggleSwitch
            checked={privacy.showProgress}
            onChange={(checked) => setPrivacy({ ...privacy, showProgress: checked })}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Allow Messages</label>
            <p className={styles.settingDescription}>Let other users send you messages</p>
          </div>
          <ToggleSwitch
            checked={privacy.allowMessages}
            onChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
          />
        </div>

        <button
          className={styles.saveButton}
          onClick={handlePrivacySave}
          disabled={saving}
        >
          <FiSave size={18} />
          {saving ? "Saving..." : "Save Privacy"}
        </button>
      </SettingsSection>

      {/* Data & Storage Section */}
      <SettingsSection
        icon={FiDatabase}
        title="Data & Storage"
        description="Manage your data and storage settings"
      >
        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Export Settings</label>
            <p className={styles.settingDescription}>Download your settings as a JSON file</p>
          </div>
          <button
            className={styles.actionButton}
            onClick={handleExportData}
          >
            <FiDownload size={18} />
            Export Data
          </button>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingLabel}>
            <label>Clear Cache</label>
            <p className={styles.settingDescription}>Clear all cached data and reload</p>
          </div>
          <button
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={handleClearCache}
          >
            <FiTrash2 size={18} />
            Clear Cache
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionDescription}>{description}</p>
        </div>
      </div>
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.toggleActive : ""}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

