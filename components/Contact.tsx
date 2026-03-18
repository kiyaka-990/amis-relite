import { useState, FormEvent } from 'react';
import { SITE } from '../data/content';
import styles from '../styles/Contact.module.css';

const INFO = [
  { icon:'📞', label:'Phone',        lines:[SITE.phone1, SITE.phone2] },
  { icon:'✉️', label:'Email',        lines:[SITE.email1, SITE.email2] },
  { icon:'🕐', label:'Office Hours', lines:[SITE.hours, 'Sat: By Appointment'] },
  { icon:'📍', label:'Location',     lines:[SITE.addr, 'Serving all major counties'] },
];

export default function Contact() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
    setTimeout(() => setSent(false), 5500);
  };

  return (
    <section id="contact" className={`section ${styles.wrap}`}>
      <div className={styles.hdr}>
        <span className="section-tag">Get In Touch</span>
        <h2 className="section-title">Let&apos;s Build Something <em>Extraordinary</em></h2>
        <p className="section-desc">We&apos;d love to hear about your project. Our team responds within 24 hours with a personalised, transparent quote.</p>
      </div>

      <div className={styles.grid}>
        {/* Info column */}
        <div className={styles.infoCol}>
          {INFO.map((c, i) => (
            <div key={i} className={styles.infoCard}>
              <div className={styles.infoIcon}>{c.icon}</div>
              <div>
                <div className={styles.infoLabel}>{c.label}</div>
                {c.lines.map((l, j) => <div key={j} className={styles.infoVal}>{l}</div>)}
              </div>
            </div>
          ))}
          {/* Map image */}
          <div className={styles.mapCard}>
            <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=700&q=80&auto=format&fit=crop" alt="Nairobi" className={styles.mapImg}/>
            <div className={styles.mapOv}>
              <div className={styles.mapPin}>📍 Nairobi, Kenya</div>
            </div>
          </div>
        </div>

        {/* Form column */}
        <form className={styles.form} onSubmit={submit}>
          <h3 className={styles.formTitle}>Send Us a Message</h3>
          <div className={styles.row}>
            <div className={styles.field}><label className={styles.label}>Full Name *</label><input type="text" placeholder="John Kamau" required className={styles.input}/></div>
            <div className={styles.field}><label className={styles.label}>Email Address *</label><input type="email" placeholder="john@example.com" required className={styles.input}/></div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}><label className={styles.label}>Phone Number</label><input type="tel" placeholder="+254 7XX XXX XXX" className={styles.input}/></div>
            <div className={styles.field}>
              <label className={styles.label}>Project Type</label>
              <select className={styles.input}>
                <option value="">Select a service…</option>
                <option>Commercial Construction</option>
                <option>Residential Project</option>
                <option>Design &amp; Build</option>
                <option>Renovation &amp; Remodelling</option>
                <option>Site Development</option>
                <option>Project Consulting</option>
                <option>Civil Engineering</option>
              </select>
            </div>
          </div>
          <div className={styles.field}><label className={styles.label}>Project Location</label><input type="text" placeholder="e.g. Parklands, Nairobi" className={styles.input}/></div>
          <div className={styles.field}>
            <label className={styles.label}>Project Details *</label>
            <textarea required placeholder="Describe your project — size, timeline, budget range, and any specific requirements…" className={`${styles.input} ${styles.ta}`}/>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading || sent}>
            {sent ? '✓ Message Sent! We\'ll respond within 24 hours.' : loading ? 'Sending…' : 'Send Message & Request Quote →'}
          </button>
          <p className={styles.privacy}>🔒 Your information is secure and never shared.</p>
        </form>
      </div>
    </section>
  );
}
