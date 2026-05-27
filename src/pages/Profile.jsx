import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './search/Search.module.scss'; // Reusing styles

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoPlaceholder}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#ab47bc" fillOpacity="0.2"/>
                <text x="20" y="26" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#ab47bc">S</text>
              </svg>
            </div>
            <div className={styles.brandInfo}>
              <h1 className={styles.brandName}>Sparsh</h1>
              <p className={styles.brandTagline}>Salon & Spa</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={() => navigate('/')}>Logout</button>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.emptyState}>
          <p>User Profile settings.</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
