import Image from 'next/image';
import styles from '../styles/CTABanner.module.css';

export default function CTABanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.bg}>
        <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=85&auto=format&fit=crop"
          alt="Construction aerial" fill style={{objectFit:'cover'}} sizes="100vw"/>
      </div>
      <div className={styles.ov}/>

      {/* Centered glass card */}
      <div className={styles.cardWrap}>
        <div className={styles.glassCard}>
          <span className={styles.tag}>Ready to Build?</span>
          <h2 className={styles.title}>Transform Your Vision<br/>Into <em>Reality Today</em></h2>
          <p className={styles.desc}>
            We don&apos;t just construct buildings — we bring visions to life. Contact us for a
            detailed, transparent quote with zero hidden costs.
          </p>
          <div className={styles.actions}>
            <a href="#contact" className={styles.btnP}>Request Free Quote →</a>
            <a href="tel:+254725590275" className={styles.btnO}>Call +254 725 590275</a>
          </div>
          <div className={styles.phones}>
            <span>Direct Line:</span>
            <strong>+254 725 817475</strong>
            <span>|</span>
            <strong>+254 725 590275</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
