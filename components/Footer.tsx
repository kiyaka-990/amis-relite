import { SITE } from '../data/content';
import styles from '../styles/Footer.module.css';

const COLS = {
  Company: [{l:'About Us',h:'#about'},{l:'Our Team',h:'#team'},{l:'Projects',h:'#projects'},{l:'Careers',h:'#contact'}],
  Services: [{l:'Commercial',h:'#services'},{l:'Residential',h:'#services'},{l:'Design Build',h:'#services'},{l:'Renovation',h:'#services'}],
  Support:  [{l:'Help & FAQ',h:'#faq'},{l:'Contact Us',h:'#contact'},{l:'Privacy Policy',h:'#'},{l:'Terms of Service',h:'#'}],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}><span>AMIS</span> RELITE<em>.</em></div>
          <p className={styles.tagline}>{SITE.tag}</p>
          <p className={styles.about}>Nairobi&apos;s trusted construction partner for residential, commercial, and civil engineering projects since 2017.</p>
          <div className={styles.contacts}>
            <a href={`tel:${SITE.phone1.replace(/\s/g,'')}`}>{SITE.phone1}</a>
            <a href={`mailto:${SITE.email1}`}>{SITE.email1}</a>
          </div>
        </div>
        {Object.entries(COLS).map(([heading, links]) => (
          <div key={heading} className={styles.col}>
            <h4 className={styles.colHd}>{heading}</h4>
            <ul className={styles.list}>
              {links.map(l => <li key={l.l}><a href={l.h} className={styles.link}>{l.l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Amis Relite Limited. All rights reserved.</span>
        <span className={styles.sep}>·</span>
        <span>Developed by Asterleigh Systems</span>
      </div>
    </footer>
  );
}
