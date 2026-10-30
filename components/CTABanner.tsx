import Link from 'next/link';
import Image from 'next/image';
import { useContent } from './ContentProvider';
import styles from '../styles/CTABanner.module.css';

export default function CTABanner() {
  const { content } = useContent();
  const site = content.site;
  const wa = site.whatsapp.replace(/[^0-9]/g, '');
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
            <Link href="/contact" className={styles.btnP}>Request Free Quote →</Link>
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent(site.whatsappMsg)}`} target="_blank" rel="noopener noreferrer" className={styles.btnO}>WhatsApp Us</a>
          </div>
          <div className={styles.phones}>
            <span>Direct Line:</span>
            <strong>{site.phone2}</strong>
            <span>|</span>
            <strong>{site.phone1}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
