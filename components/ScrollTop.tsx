import { useEffect, useState } from 'react';
import styles from '../styles/ScrollTop.module.css';

/** Top-of-page scroll progress bar + a back-to-top button (one shared scroll listener). */
export default function ScrollTop() {
  const [pct, setPct] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
        setShow(window.scrollY > 480);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const smooth = document.documentElement.dataset.motion !== 'off';
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    document.getElementById('main')?.focus?.();
  };

  return (
    <>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>

      <button
        className={`${styles.top} ${show ? styles.topShow : ''}`}
        onClick={toTop}
        aria-label="Back to top"
        aria-hidden={!show}
        tabIndex={show ? 0 : -1}
        title="Back to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M12 5l-7 7 1.4 1.4L11 8.8V19h2V8.8l4.6 4.6L19 12l-7-7z" fill="currentColor" />
        </svg>
      </button>
    </>
  );
}
