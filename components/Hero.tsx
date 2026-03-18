import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { HERO_SLIDES } from '../data/content';
import styles from '../styles/Hero.module.css';

export default function Hero() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const go = useCallback((n: number) => {
    setPrev(cur);
    setCur((n + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [cur]);

  useEffect(() => { const t = setInterval(() => go(cur + 1), 7000); return () => clearInterval(t); }, [cur, go]);

  // Floating particles
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const particles: { x:number; y:number; r:number; vx:number; vy:number; a:number; va:number }[] = [];
    for (let i = 0; i < 55; i++) particles.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*2+0.5, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, a:Math.random(), va:(Math.random()-0.5)*0.005 });
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.a = Math.max(0.05, Math.min(0.6, p.a));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192,57,43,${p.a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const slide = HERO_SLIDES[cur];

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {HERO_SLIDES.map((s, i) => (
        <div key={i} className={`${styles.bg} ${i === cur ? styles.bgActive : i === prev ? styles.bgPrev : ''}`}>
          <Image src={s.img} alt={s.title} fill priority={i===0} style={{objectFit:'cover'}} quality={85} sizes="100vw" />
        </div>
      ))}
      <div className={styles.ov1}/><div className={styles.ov2}/><div className={styles.ov3}/>

      {/* Glass content card */}
      <div className={styles.contentWrap}>
        <div className={styles.glassCard}>
          <div className={styles.tag}>{slide.tag}</div>
          <h1 className={styles.title}>{slide.title}<br/><em className={styles.em}>{slide.em}</em></h1>
          <p className={styles.desc}>{slide.desc}</p>
          <div className={styles.actions}>
            <a href={slide.cta1.h} className={styles.btnP}>{slide.cta1.l} <span>→</span></a>
            <a href={slide.cta2.h} className={styles.btnO}>{slide.cta2.l}</a>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className={styles.indicators}>
        {HERO_SLIDES.map((s, i) => (
          <button key={i} onClick={() => go(i)} className={`${styles.ind} ${i===cur?styles.indActive:''}`}>
            <span className={styles.indNum}>0{i+1}</span>
            <div className={styles.indBar}><div className={styles.indFill} style={i===cur?{}:{width:0}}/></div>
          </button>
        ))}
      </div>

      {/* Arrow nav */}
      <div className={styles.arrows}>
        <button onClick={() => go(cur-1)} className={styles.arr}>‹</button>
        <button onClick={() => go(cur+1)} className={styles.arr}>›</button>
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue}><div className={styles.scrollMouse}><div className={styles.scrollWheel}/></div><span>Scroll</span></div>
    </section>
  );
}
