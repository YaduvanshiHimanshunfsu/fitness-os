'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Lightweight fade-only page transition.
 * Removed the Y-axis translate which caused main-thread layout thrashing
 * and contributed to the site freezing on route changes.
 * Pure opacity transitions are fully GPU-composited and never cause reflow.
 */
export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full min-h-[calc(100vh-4rem)]"
        style={{ willChange: 'opacity' }}  // hint compositor to isolate this layer
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
