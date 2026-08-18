import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './images/WhatsApp Image 2026-02-12 at 11.08.16 AM.png';
import './Preloader.css';

export const Preloader = ({ loading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll while preloader is active
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const diff = Math.floor(Math.random() * 14) + 6;
        return Math.min(prev + diff, 95);
      });
    }, 110);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 500);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [loading]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="electo-preloader-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }}
        >
          {/* Ambient Lighting Background */}
          <div className="preloader-glow-orb" />

          <div className="preloader-content">
            {/* Clean Complete ElectoMart Logo Image (No background card/rings) */}
            <motion.div
              className="preloader-logo-container"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <img src={logo} alt="ElectoMart Logo" className="preloader-full-logo" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="preloader-subtitle"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              Electronics & Tech Store
            </motion.p>

            {/* Progress Track */}
            <motion.div
              className="preloader-track"
              initial={{ opacity: 0, scaleX: 0.85 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <div className="preloader-bar" style={{ width: `${progress}%` }} />
            </motion.div>

            {/* Status Line */}
            <motion.div
              className="preloader-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            >
              <span>
                <span className="preloader-status-dot" />
                Loading experience...
              </span>
              <span className="preloader-percent">{progress}%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
