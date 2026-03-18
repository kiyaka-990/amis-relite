import { useState } from 'react';
import { FAQS } from '../data/content';
import styles from '../styles/FAQ.module.css';

export default function FAQ() {
  const [open, setOpen] = useState<number|null>(0);
  return (
    <section id="faq" className={`section section-alt2 ${styles.wrap}`}>
      <div className={styles.grid}>
        {/* Left panel */}
        <div className={styles.left}>
          <span className="section-tag">Common Questions</span>
          <h2 className="section-title">Frequently<br/><em>Asked Questions</em></h2>
          <p className="section-desc" style={{marginBottom:'32px'}}>
            Can&apos;t find your answer? Our AI assistant ARIA is available 24/7, or reach us directly — we respond within 24 hours.
          </p>
          <a href="#contact" className={styles.cta}>Contact Us Directly →</a>

          {/* Decorative card */}
          <div className={styles.sideCard}>
            <div className={styles.sideImg}>
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop" alt="construction site"/>
            </div>
            <div className={styles.sideBody}>
              <strong>Free Consultation</strong>
              <span>No hidden costs · 24h response · Expert guidance</span>
            </div>
          </div>
        </div>

        {/* Right accordion */}
        <div className={styles.accordion}>
          {FAQS.map((item, i) => (
            <div key={i} className={`${styles.item} ${open===i ? styles.itemOpen : ''}`}>
              <button className={styles.q} onClick={() => setOpen(open===i ? null : i)}>
                <span className={styles.qNum}>0{i+1}</span>
                <span className={styles.qText}>{item.q}</span>
                <div className={styles.qIcon}>{open===i ? '−' : '+'}</div>
              </button>
              <div className={styles.a}>
                <div className={styles.aInner}>
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
