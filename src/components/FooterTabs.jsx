import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './FooterTabs.module.scss';

const FooterTabs = () => {
  const location = useLocation();
  
  // Hide footer on login page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className={styles.footer}>
      <ul className={styles.tabList}>
        <li>
          <NavLink 
            to="/search" 
            className={({ isActive }) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}
          >
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/services" 
            className={({ isActive }) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}
          >
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3"/>
                <circle cx="6" cy="18" r="3"/>
                <line x1="20" y1="4" x2="8.12" y2="15.88"/>
                <line x1="14.47" y1="14.48" x2="20" y2="20"/>
                <line x1="8.12" y1="8.12" x2="12" y2="12"/>
              </svg>
            </div>
            <span>SERVICES</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/booking" 
            className={({ isActive }) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}
          >
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span>BOOKINGS</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}
          >
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
            <span>PROFILE</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default FooterTabs;
