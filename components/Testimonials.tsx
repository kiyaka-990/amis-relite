import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '../data/content';
import styles from '../styles/Testimonials.module.css';

export default function Testimonials() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCur(c => (c + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  const visible = [
    TESTIMONIALS[cur % TESTIMONIALS.length],
    TESTIMONIALS[(cur + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(cur + 2) % TESTIMONIALS.length],
  ];

  return (
    <section id="testimonials" className={`section ${styles.wrap}`}>
      <div className={styles.hdr}>
        <span className="section-tag">Client Stories</span>
        <h2 className="section-title">What Our Clients <em>Say</em></h2>
        <p className="section-desc">Our greatest measure of success is the satisfaction and trust of every client we serve across Kenya.</p>
      </div>

      {/* Carousel */}
      <div className={styles.carousel} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div ref={trackRef} className={styles.track}>
          {visible.map((t, i) => (
            <div key={`${cur}-${i}`} className={`${styles.card} ${i === 0 ? styles.featured : ''}`} style={{ animationDelay:`${i * 0.08}s` }}>
              <div className={styles.cardInner}>
                <div className={styles.quoteIcon}>&ldquo;</div>
                <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
                <p className={styles.text}>{t.text}</p>
                <div className={styles.author}>
                  <div className={styles.avatarWrap}>
                    <Image src={t.img} alt={t.name} fill style={{objectFit:'cover'}}/>
                  </div>
                  <div>
                    <div className={styles.name}>{t.name}</div>
                    <div className={styles.role}>{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.arr} onClick={() => { setPaused(true); setCur(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }}>‹</button>
          <div className={styles.dots}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === cur % TESTIMONIALS.length ? styles.dotA : ''}`}
                onClick={() => { setPaused(true); setCur(i); }}/>
            ))}
          </div>
          <button className={styles.arr} onClick={() => { setPaused(true); setCur(c => (c + 1) % TESTIMONIALS.length); }}>›</button>
        </div>
      </div>
    </section>
  );
}
