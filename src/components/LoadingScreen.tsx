import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function waitForFonts(): Promise<void> {
  return (document.fonts?.ready ?? Promise.resolve()).then(() => {});
}

function waitForImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    if (mq.matches) {
      setVisible(false);
      return;
    }

    Promise.all([waitForFonts(), waitForImage('/hero-bg.jpg')])
      .then(() => setVisible(false))
      .catch(() => setVisible(false));

    const fallback = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(fallback);
  }, []);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="loading-screen-inner">
            <div className="loading-screen-logo">CT</div>
            <p className="loading-screen-text">Checking route conditions…</p>
            <div className="loading-screen-bar">
              <motion.div
                className="loading-screen-bar-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};