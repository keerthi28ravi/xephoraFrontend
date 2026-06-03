import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseOut  = ()  => { mouse.x = null; mouse.y = null; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.r  = Math.random() * 1.8 + 0.8;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,240,255,0.5)';
        ctx.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
        if (mouse.x != null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const f = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * f * 1.8;
            this.y += (dy / dist) * f * 1.8;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const n = Math.min(90, Math.floor((canvas.width * canvas.height) / 16000));
      for (let i = 0; i < n; i++) particles.push(new Particle());
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(112,0,255,${(115 - d) / 115 * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="neural-bg"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
      />
      <div className="hologram-grid-overlay" />
    </>
  );
}
