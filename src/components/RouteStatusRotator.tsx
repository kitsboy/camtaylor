import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route } from 'lucide-react';
import { SITE } from '../data/site';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function RouteStatusRotator() {
  const reduced = useReducedMotion();
  const routes = SITE.currentRoutes;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || routes.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % routes.length), 4000);
    return () => clearInterval(id);
  }, [reduced, routes.length]);

  const current = routes[index] ?? routes[0];

  return (
    <p className="hero-route-status">
      <Route size={13} />
      <span className="hero-route-rotator">
        {reduced || routes.length <= 1 ? (
          <span>{current}</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {current}
            </motion.span>
          </AnimatePresence>
        )}
        <span className="hero-route-cursor" aria-hidden="true">
          |
        </span>
      </span>
    </p>
  );
}