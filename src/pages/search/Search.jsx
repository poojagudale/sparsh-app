import React, { useState } from 'react';
import styles from './Search.module.scss';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Search action here
  };

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
        </div>
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.heroTitle}>SEARCH</h1>
        <p className={styles.heroSubtitle}>
          Enter your mobile number to search .
        </p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.inputWrapper}>
            <label className={styles.floatingLabel}>MOBILE NUMBER</label>
            <input 
              type="tel" 
              placeholder="e.g. +1 234 567 890" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className={styles.textInput}
            />
            <div className={styles.keypadIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="1.5" fill="#c4b8b8"/>
                <circle cx="12" cy="6" r="1.5" fill="#c4b8b8"/>
                <circle cx="18" cy="6" r="1.5" fill="#c4b8b8"/>
                <circle cx="6" cy="12" r="1.5" fill="#c4b8b8"/>
                <circle cx="12" cy="12" r="1.5" fill="#c4b8b8"/>
                <circle cx="18" cy="12" r="1.5" fill="#c4b8b8"/>
                <circle cx="6" cy="18" r="1.5" fill="#c4b8b8"/>
                <circle cx="12" cy="18" r="1.5" fill="#c4b8b8"/>
                <circle cx="18" cy="18" r="1.5" fill="#c4b8b8"/>
              </svg>
            </div>
          </div>
          
          <button type="submit" className={styles.searchBtn}>
            SEARCH <span>&rarr;</span>
          </button>
        </form>
      </main>
    </div>
  );
};

export default Search;
