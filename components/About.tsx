import Image from 'next/image';
import styles from '../styles/About.module.css';

const POINTS = [
  { icon:'✓', text:'Transparent communication and meticulous project management from start to finish.' },
  { icon:'✓', text:'Full compliance with Kenyan building codes and highest safety standards on every site.' },
  { icon:'✓', text:'Certified architects, engineers, quantity surveyors and craftsmen on every project.' },
  { icon:'✓', text:'Serving Nairobi, Kiambu, Machakos and surrounding counties — 100% satisfaction record.' },
];

const METRICS = [
  { num:'10+', lbl:'Projects' },
  { num:'7+',  lbl:'Years'    },
  { num:'100%',lbl:'Safety'   },
  { num:'100%',lbl:'Satisfied'},
];

export default function About() {
  return (
    <section id="about" className={`section section-alt ${styles.wrap}`}>
      <div className={styles.grid}>
        {/* Image side */}
        <div className={styles.imgCol}>
          <div className={styles.imgFrame}>
            <Image
              src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=900&q=85&auto=format&fit=crop"
              alt="Amis Relite construction" fill style={{objectFit:'cover'}} sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className={styles.imgOverlay}/>
          </div>

          {/* Floating badge */}
          <div className={styles.badge}>
            <div className={styles.badgeInner}>
              <strong>7+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>

          {/* Floating stat card */}
          <div className={styles.floatCard}>
            <div className={styles.floatIcon}>🏆</div>
            <div>
              <div className={styles.floatNum}>100%</div>
              <div className={styles.floatLbl}>Client Satisfaction</div>
            </div>
          </div>

          {/* Decorative red blur */}
          <div className={styles.redBlob}/>
        </div>

        {/* Text side */}
        <div className={styles.textCol}>
          <span className="section-tag">Who We Are</span>
          <h2 className="section-title">
            Building Strong Foundations —<br/><em>In Structures & Relationships</em>
          </h2>
          <p className="section-desc">
            Welcome to Amis Relite Limited. For over seven years, we have been a leading force in
            Kenya&apos;s construction industry, specialising in building, roads, civil engineering,
            and high-mast lighting projects across Nairobi and beyond.
          </p>

          <ul className={styles.points}>
            {POINTS.map((p,i) => (
              <li key={i} className={styles.point}>
                <div className={styles.pointIcon}>{p.icon}</div>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>

          {/* Metric pills */}
          <div className={styles.metricsRow}>
            {METRICS.map((m,i) => (
              <div key={i} className={styles.metricPill}>
                <strong>{m.num}</strong>
                <span>{m.lbl}</span>
              </div>
            ))}
          </div>

          <a href="#contact" className={styles.cta}>Work With Us →</a>
        </div>
      </div>
    </section>
  );
}
