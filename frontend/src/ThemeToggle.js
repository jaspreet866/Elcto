import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './usecontext';
import './ThemeToggle.css';

export const ThemeToggle = ({ variant = 'icon', className = '' }) => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        className={`theme-toggle-pill ${className}`}
        onClick={toggleTheme}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <span className="pill-thumb">
          <motion.div
            key={theme}
            initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDark ? (
              <i className="bi bi-sun-fill text-warning" style={{ fontSize: '13px' }} />
            ) : (
              <i className="bi bi-moon-stars-fill text-primary" style={{ fontSize: '12px' }} />
            )}
          </motion.div>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="theme-halo" />
      <div className="theme-icon-container">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ y: 8, opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -8, opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="bi bi-sun-fill text-warning fs-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: -8, opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: 8, opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="bi bi-moon-stars-fill text-primary fs-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
};

export default ThemeToggle;
