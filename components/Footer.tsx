import type { ReactNode } from 'react';
import Link from 'next/link';
import { useContent } from './ContentProvider';
import styles from '../styles/Footer.module.css';

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return href.startsWith('/')
    ? <Link href={href} className={styles.link}>{children}</Link>
    : <a href={href} className={styles.link}>{children}</a>;
}

const COLS = {
  Company: [{l:'About Us',h:'/about'},{l:'Our Team',h:'/about'},{l:'Projects',h:'/projects'},{l:'Careers',h:'/contact'}],
  Services: [{l:'Commercial',h:'/services'},{l:'Residential',h:'/services'},{l:'Design Build',h:'/services'},{l:'Renovation',h:'/services'}],
  Support:  [{l:'Help & FAQ',h:'/contact'},{l:'Contact Us',h:'/contact'},{l:'Privacy Policy',h:'/privacy'},{l:'Terms of Service',h:'/terms'}],
};

export default function Footer() {
  const { content } = useContent();
  const site = content.site;
  const wa = site.whatsapp.replace(/[^0-9]/g, '');
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}><span>{site.name.split(/\s+/)[0]?.toUpperCase()}</span> {site.name.split(/\s+/).slice(1, 2).join('').toUpperCase()}<em>.</em></div>
          <p className={styles.tagline}>{site.tag}</p>
          <p className={styles.about}>Nairobi&apos;s trusted construction partner for residential, commercial, and civil engineering projects since 2017.</p>
          <div className={styles.contacts}>
            <a href={`tel:${site.phone1.replace(/\s/g,'')}`}>{site.phone1}</a>
            <a href={`mailto:${site.email1}`}>{site.email1}</a>
          </div>
          <div className={styles.social}>
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WhatsApp</a>}
            {site.facebook  && <a href={site.facebook}  target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>}
            {site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>}
            {site.linkedin  && <a href={site.linkedin}  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>}
          </div>
        </div>
        {Object.entries(COLS).map(([heading, links]) => (
          <div key={heading} className={styles.col}>
            <h4 className={styles.colHd}>{heading}</h4>
            <ul className={styles.list}>
              {links.map(l => <li key={l.l}><NavLink href={l.h}>{l.l}</NavLink></li>)}
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
