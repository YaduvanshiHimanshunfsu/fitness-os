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
    this.size = Math.random() * 4 + 1; // Size between 1 and 5
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    // Glowing orange embers
    this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 69)}, 0, `;
    this.maxLife = Math.random() * 30 + 20;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size = Math.max(0, this.size - 0.1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const opacity = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color + `${opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 69, 0, 0.8)';
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

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      isMoving.current = true;
      if (!isVisible) setIsVisible(true);
      
      // Add particles
      for (let i = 0; i < 2; i++) {
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
        particles.current[i].update();
        particles.current[i].draw(ctx);
        
        if (particles.current[i].life <= 0) {
          particles.current.splice(i, 1);
          i--;
        }
      }
      
      // Core cursor dot
      if (isVisible) {
        ctx.beginPath();
        ctx.arc(mousePos.current.x, mousePos.current.y, isMoving.current ? 3 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isMoving.current ? '#FF8C61' : '#FF4500';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF4500';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      document.body.classList.remove('custom-cursor-active');
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
