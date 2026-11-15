import React, { useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROUTE_CHECKED_KEY = 'ct-route-checked';
const HERO_BG = '/hero-bg.jpg';

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

function readRouteChecked(): boolean {
  try {
    return sessionStorage.getItem(ROUTE_CHECKED_KEY) === '1';
  } catch {
    return false;
  }
}

function markRouteChecked(): void {
  try {
    sessionStorage.setItem(ROUTE_CHECKED_KEY, '1');
  } catch {
    /* private mode, or storage blocked — this view still hides, the next one cannot skip */
  }
}

function heroImageCached(): boolean {
  const img = new Image();
  img.src = HERO_BG;
  return img.complete;
}

export const LoadingScreen: React.FC = () => {
  // Hidden until the layout effect says this view must wait, so a skip never paints.
  const [visible, setVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    if (mq.matches) {
      setVisible(false);
      return;
    }

    if (readRouteChecked()) {
      setVisible(false);
      return;
    }

    if (document.fonts?.status === 'loaded' && heroImageCached()) {
      markRouteChecked();
      setVisible(false);
      return;
    }

    setVisible(true);

    let settled = false;
    const hide = () => {
      if (settled) return;
      settled = true;
      markRouteChecked();
      setVisible(false);
    };

    Promise.all([waitForFonts(), waitForImage(HERO_BG)])
      .then(hide)
      .catch(hide);

    const fallback = setTimeout(hide, 1800);
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
