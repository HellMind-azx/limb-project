'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getStoredUser, setStoredUser } from '@/lib/auth';
import { getProfile, updateProfile } from '@/lib/api';
import { FiUser, FiMail, FiCalendar, FiClock, FiEdit2, FiSave, FiX, FiLoader } from 'react-icons/fi';
import styles from './profile.module.scss';


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = getStoredUser();
    setUser(storedUser);
    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProfile();
      setProfileData(response.user);
      setEditFormData({
        username: response.user.username || '',
        email: response.user.email || '',
        first_name: response.user.first_name || '',
        last_name: response.user.last_name || '',
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.response?.data?.error || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profileData) {
      setEditFormData({
        username: profileData.username || '',
        email: profileData.email || '',
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
      });
    }
  };

  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await updateProfile(editFormData);
      setProfileData(response.user);
      
      // Update stored user data
      const updatedUser = {
        ...user,
        username: response.user.username,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
      };
      setStoredUser(updatedUser);
      setUser(updatedUser);
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = () => {
    if (profileData?.first_name && profileData?.last_name) {
      return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
    }
    if (profileData?.first_name) {
      return profileData.first_name[0].toUpperCase();
    }
    if (profileData?.username) {
      return profileData.username[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1 className={styles.profileTitle}>Profile</h1>
        {!isEditing && (
          <button onClick={handleEdit} className={styles.editButton}>
            <FiEdit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorCard}>
          <div className={styles.errorText}>{error}</div>
        </div>
      )}

      <div className={styles.profileContent}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {getInitials()}
          </div>
          <div className={styles.avatarInfo}>
            <h2 className={styles.userName}>
              {profileData?.first_name && profileData?.last_name
                ? `${profileData.first_name} ${profileData.last_name}`
                : profileData?.first_name
                ? profileData.first_name
                : profileData?.username
                ? profileData.username
                : 'User'}
            </h2>
            <p className={styles.userEmail}>{profileData?.email || 'No email'}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className={styles.profileForm}>
          {isEditing ? (
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <FiUser size={16} />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <FiMail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <FiUser size={16} />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={editFormData.first_name}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <FiUser size={16} />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={editFormData.last_name}
                    onChange={handleChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={saving}
                >
                  <FiX size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FiLoader className={styles.spinner} size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileInfo}>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FiUser size={16} />
                    Username
                  </div>
                  <div className={styles.infoValue}>{profileData?.username || 'Not set'}</div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FiMail size={16} />
                    Email
                  </div>
                  <div className={styles.infoValue}>{profileData?.email || 'Not set'}</div>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FiUser size={16} />
                    First Name
                  </div>
                  <div className={styles.infoValue}>
                    {profileData?.first_name || 'Not set'}
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FiUser size={16} />
                    Last Name
                  </div>
                  <div className={styles.infoValue}>
                    {profileData?.last_name || 'Not set'}
                  </div>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FiCalendar size={16} />
                    Member Since
                  </div>
                  <div className={styles.infoValue}>
                    {formatDate(profileData?.date_joined)}
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FiClock size={16} />
                    Last Login
                  </div>
                  <div className={styles.infoValue}>
                    {formatDate(profileData?.last_login)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

