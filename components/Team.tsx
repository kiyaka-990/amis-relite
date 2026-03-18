import { useState } from 'react';
import Image from 'next/image';
import { TEAM } from '../data/content';
import styles from '../styles/Team.module.css';

export default function Team() {
  const [hov, setHov] = useState<number|null>(null);
  return (
    <section id="team" className={`section section-alt ${styles.wrap}`}>
      <div className={styles.hdr}>
        <span className="section-tag">Our People</span>
        <h2 className="section-title">The <em>Expert Team</em> Behind Every Build</h2>
        <p className="section-desc">Architects, engineers, surveyors, and craftsmen united by a shared passion for building excellence across Kenya.</p>
      </div>
      <div className={styles.grid}>
        {TEAM.map((m, i) => (
          <div key={i} className={`${styles.card} ${hov===i?styles.cardHov:''}`}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            {/* Photo */}
            <div className={styles.photo}>
              <Image src={m.img} alt={m.name} fill style={{objectFit:'cover', objectPosition:'top'}} sizes="33vw"/>
              <div className={styles.photoOv}/>
              {/* Bio reveal */}
              <div className={`${styles.bioReveal} ${hov===i?styles.bioVisible:''}`}>
                <p className={styles.bioText}>{m.bio}</p>
                <a href="#contact" className={styles.bioBtn}>Get in Touch →</a>
              </div>
            </div>
            {/* Info glass strip */}
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <h3 className={styles.name}>{m.name}</h3>
                <span className={styles.role}>{m.role}</span>
              </div>
              <div className={`${styles.infoArrow} ${hov===i?styles.arrowHov:''}`}>→</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
