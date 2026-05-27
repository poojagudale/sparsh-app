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
        <h1 className={styles.heroTitle}>Search</h1>
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

      <div className={styles.graphicOverlay}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={styles.blob}>
          <path fill="#aecbc7" d="M65.7,-38.3C80.3,-18.2,84,10.6,73.5,33.5C63,56.4,38.3,73.5,12.7,80.1C-12.9,86.7,-39.3,82.8,-54.1,65.8C-68.9,48.8,-71.9,18.8,-63.3,-4.2C-54.7,-27.2,-34.4,-43.3,-14.2,-51.2C6,-59.1,26.8,-58.8,44.9,-51.2Z" transform="translate(100 100) scale(1.1)" />
          <path fill="#9bbab6" d="M48,-31.2C62.4,-15.5,74.5,4.7,70.5,21.8C66.5,38.9,46.3,53,24.1,62C1.8,71,-22.6,74.8,-42.6,65.3C-62.6,55.8,-78.3,33.1,-78.2,11.2C-78.1,-10.8,-62.3,-31.9,-44.6,-46C-26.9,-60.2,-7.3,-57.4,8.1,-48C23.6,-38.6,33.6,-46.9,48,-31.2Z" transform="translate(110 110) scale(0.9)" />
          <circle cx="120" cy="40" r="4" fill="#aecbc7" opacity="0.8"/>
          <circle cx="160" cy="70" r="3" fill="#aecbc7" opacity="0.8"/>
          <circle cx="50" cy="150" r="5" fill="#aecbc7" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
};

export default Search;
