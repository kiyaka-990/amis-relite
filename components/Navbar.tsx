import { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css';

const LINKS = [
  {l:'About',h:'#about'},{l:'Services',h:'#services'},{l:'Projects',h:'#projects'},
  {l:'Team',h:'#team'},{l:'FAQ',h:'#faq'},{l:'Contact',h:'#contact'},
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#hero" className={styles.logo}><span>AMIS</span> RELITE<em>.</em></a>
      <ul className={styles.links}>
        {LINKS.map(l => <li key={l.h}><a href={l.h} className={styles.link}>{l.l}</a></li>)}
      </ul>
      <div className={styles.right}>
        <a href="tel:+254725590275" className={styles.phone}>+254 725 590275</a>
        <a href="#contact" className={styles.cta}>Get a Quote</a>
      </div>
      <button className={`${styles.burger} ${open ? styles.open : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
        <span/><span/><span/>
      </button>
      {open && (
        <div className={styles.mobile}>
          {LINKS.map(l => <a key={l.h} href={l.h} className={styles.ml} onClick={() => setOpen(false)}>{l.l}</a>)}
          <a href="#contact" className={styles.mcta} onClick={() => setOpen(false)}>Get a Free Quote</a>
        </div>
      )}
    </nav>
  );
}
