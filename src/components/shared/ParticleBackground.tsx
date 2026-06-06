'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 5;
    
    // Clear existing particles if any
    container.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const size = Math.random() * 3 + 1 + 'px';
      const left = Math.random() * 100 + '%';
      const duration = Math.random() * 10 + 10 + 's';
      const delay = Math.random() * 10 + 's';
      
      particle.style.width = size;
      particle.style.height = size;
      particle.style.left = left;
      particle.style.setProperty('--duration', duration);
      particle.style.animationDelay = delay;
      
      container.appendChild(particle);
    }
  }, []);

  return (
    <>
      <div className="ambient-particles"></div>
      <div className="particle-container" id="particles" ref={containerRef}></div>
    </>
  );
}
