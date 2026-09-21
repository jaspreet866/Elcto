import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GoToTop.css';

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Universal Go To Top button component.
 * Displays a floating action button with smooth circular scroll progress indicator,
 * tooltip, keyboard accessibility, and seamless smooth scroll to top.
 */
export const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Show button when user has scrolled down > 200px
    if (scrollTop > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Calculate percentage (0 to 100)
    if (scrollHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  // SVG Circle calculation (Radius = 20, Circumference = 2 * PI * 20 ≈ 125.66)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="go-to-top-wrapper"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
          {/* Floating Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                className="go-to-top-tooltip"
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.9 }}
                transition={{ duration: 0.18 }}
              >
                Back to Top
                <span className="tooltip-progress">{Math.round(scrollProgress)}%</span>
              </motion.span>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            type="button"
            className="go-to-top-btn"
            onClick={scrollToTop}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            aria-label={`Scroll to top of page, currently at ${Math.round(scrollProgress)}%`}
            title="Go to top"
            tabIndex={0}
          >
            {/* SVG Circular Progress Bar */}
            <svg
              className="go-to-top-progress-ring"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              aria-hidden="true"
            >
              {/* Background track circle */}
              <circle
                className="progress-ring-track"
                cx="25"
                cy="25"
                r={radius}
                strokeWidth="3"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                className="progress-ring-indicator"
                cx="25"
                cy="25"
                r={radius}
                strokeWidth="3.2"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Icon Content */}
            <span className="go-to-top-icon-container" aria-hidden="true">
              <i className="bi bi-chevron-up go-to-top-arrow"></i>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoToTop;
