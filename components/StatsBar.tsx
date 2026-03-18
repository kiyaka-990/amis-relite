import { useEffect, useRef, useState } from 'react';
import { STATS } from '../data/content';
import styles from '../styles/StatsBar.module.css';

export default function StatsBar() {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={styles.bar}>
      <div className={styles.inner}>
        {STATS.map((s, i) => (
          <div key={i} className={`${styles.pill} ${vis ? styles.pillVis : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <strong className={styles.num}>{s.num}</strong>
            <span className={styles.lbl}>{s.lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
