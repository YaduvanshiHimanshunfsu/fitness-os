'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
}

export default function MagicCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);
  const lastEmitTime = useRef(0);
  const mousePos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      // Throttle particle emission for performance (every 30ms)
      if (now - lastEmitTime.current > 30) {
        lastEmitTime.current = now;

        const newParticle: Particle = {
          id: particleIdCounter.current++,
          x: e.clientX,
          y: e.clientY,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 20 + 10, // Fast speed
          size: Math.random() * 4 + 2, // 2px to 6px
        };

        setParticles((prev) => [...prev.slice(-30), newParticle]); // keep max 30 particles
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          // Calculate destination point based on angle and speed
          const destX = p.x + Math.cos(p.angle) * p.speed;
          const destY = p.y + Math.sin(p.angle) * p.speed + 20; // +20 for gravity

          return (
            <motion.div
              key={p.id}
              initial={{
                opacity: 1,
                scale: 1,
                x: p.x,
                y: p.y,
              }}
              animate={{
                opacity: 0,
                scale: 0,
                x: destX,
                y: destY,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                // Bright red / orange sparkles
                background: 'radial-gradient(circle, #FF4500 0%, #FF0000 70%, transparent 100%)',
                boxShadow: '0 0 8px #FF0000',
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
