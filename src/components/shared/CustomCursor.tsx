'use client';

import React, { useEffect, useRef, useState } from 'react';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1.5; // Size between 1.5 and 4.5
    // Faster, more explosive movement for sprinkles
    this.speedX = (Math.random() - 0.5) * 6;
    this.speedY = (Math.random() - 0.5) * 6 + 1; // Slight downward gravity
    // Pure red color
    this.color = `rgba(255, 0, 0, `;
    this.maxLife = Math.random() * 20 + 15;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size = Math.max(0, this.size - 0.15); // Shrink faster
  }

  draw(ctx: CanvasRenderingContext2D) {
    const opacity = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color + `${opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Intense glow effect
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.9)';
  }
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // We do NOT add 'custom-cursor-active' anymore so the default cursor remains visible

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      isMoving.current = true;
      if (!isVisible) setIsVisible(true);
      
      // Add more particles for a denser sprinkle effect
      for (let i = 0; i < 3; i++) {
        particles.current.push(new Particle(e.clientX, e.clientY));
      }

      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        isMoving.current = false;
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.current.length; i++) {
        particles.current[i]!.update();
        particles.current[i]!.draw(ctx);
        
        if (particles.current[i]!.life <= 0) {
          particles.current.splice(i, 1);
          i--;
        }
      }
      
      // Removed the core cursor dot rendering so only the native cursor and sprinkles are visible

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
