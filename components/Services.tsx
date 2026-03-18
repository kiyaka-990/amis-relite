import { useState } from 'react';
import Image from 'next/image';
import { SERVICES } from '../data/content';
import styles from '../styles/Services.module.css';

export default function Services() {
  const [hover, setHover] = useState<number|null>(null);
  return (
    <section id="services" className={`section section-alt ${styles.wrap}`}>
      <div className={styles.hdr}>
        <div><span className="section-tag">What We Do</span><h2 className="section-title">Building Your Vision<br/>with <em>Expertise & Precision</em></h2></div>
        <p className="section-desc">Six integrated service lines, one dedicated team — delivering projects that exceed expectations every single time.</p>
      </div>
      <div className={styles.grid}>
        {SERVICES.map((s, i) => (
          <div key={s.num} className={`${styles.card} ${hover===i?styles.cardHov:''}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            {/* Background image */}
            <div className={styles.cardBg}>
              <Image src={s.img} alt={s.title} fill style={{objectFit:'cover'}} sizes="33vw"/>
            </div>
            <div className={styles.cardOv}/>
            {/* Glass content */}
            <div className={styles.cardBody}>
              <div className={styles.iconWrap}><span className={styles.cardIcon}>{s.icon}</span></div>
              <div className={styles.cardNum}>{s.num}</div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
              <a href="#contact" className={styles.cardLink}>Get Started <span className={styles.arrow}>→</span></a>
            </div>
            {/* Glow ring on hover */}
            <div className={styles.glowRing}/>
          </div>
        ))}
      </div>
    </section>
  );
}
