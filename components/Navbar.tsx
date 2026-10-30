import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContent } from './ContentProvider';
import { usePreferences } from './PreferencesProvider';
import styles from '../styles/Navbar.module.css';

const LINKS = [
  { l: 'Home',     h: '/' },
  { l: 'About',    h: '/about' },
  { l: 'Services', h: '/services' },
  { l: 'Projects', h: '/projects' },
  { l: 'Contact',  h: '/contact' },
];

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 4a8 8 0 1 0 8 8 .75.75 0 0 1-.75-.75A6.25 6.25 0 0 1 12 4.75.75.75 0 0 1 12 4z"/>
      <circle cx="15.5" cy="7.5" r="1.1" fill="currentColor"/>
      <circle cx="17.5" cy="11" r="1.4" fill="currentColor"/>
      <circle cx="14.8" cy="14.6" r="1" fill="currentColor"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" fill="currentColor"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <rect key={a} x="11.25" y="1.6" width="1.5" height="3.4" rx="0.75" fill="currentColor"
          transform={`rotate(${a} 12 12)`}/>
      ))}
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { content } = useContent();
  const { resolved, toggleTheme } = usePreferences();
  const dark = resolved === 'dark';

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close the mobile overlay whenever the route changes.
  useEffect(() => { setOpen(false); }, [router.asPath]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: DocumentEventMap['keydown']) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) => (href === '/' ? router.pathname === '/' : router.pathname.startsWith(href.split('#')[0]));

  const words = content.site.name.trim().split(/\s+/);
  const wa = content.site.whatsapp.replace(/[^0-9]/g, '');

  const themeBtn = (
    <button
      className={styles.iconBtn}
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <ThemeIcon dark={dark}/>
    </button>
  );

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${open ? styles.openState : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${content.site.name} — home`}>
          <span>{words[0]?.toUpperCase()}</span> {words.slice(1, 2).join('').toUpperCase()}<em>.</em>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {LINKS.map(l => (
            <Link
              key={l.l + l.h}
              href={l.h}
              className={`${styles.link} ${isActive(l.h) ? styles.active : ''}`}
              aria-current={isActive(l.h) ? 'page' : undefined}
            >
              {l.l}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={`tel:${content.site.phone1.replace(/\s/g,'')}`} className={styles.phone}>{content.site.phone1}</a>
          <span className={styles.themeSlot}>{themeBtn}</span>
          <Link href="/admin" className={styles.admin} title="Admin portal" aria-label="Open admin portal">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.6 0-7 1.8-7 4v2h14v-2c0-2.2-3.4-4-7-4z"/>
            </svg>
            <span>Admin</span>
          </Link>
          <Link href="/contact" className={styles.cta}>Get a Quote</Link>

          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} id="mobile-menu">
        <nav className={styles.overlayNav} aria-label="Mobile navigation">
          {LINKS.map((l, i) => (
            <Link
              key={l.l}
              href={l.h}
              className={`${styles.oLink} ${isActive(l.h) ? styles.oActive : ''} ${open ? styles.oIn : ''}`}
              style={{ transitionDelay: `${80 + i * 55}ms` }}
              onClick={() => setOpen(false)}
            >
              <span className={styles.oIndex}>0{i + 1}</span>
              {l.l}
            </Link>
          ))}
        </nav>

        <div className={`${styles.overlayFoot} ${open ? styles.oIn : ''}`} style={{ transitionDelay: '440ms' }}>
          <a href={`tel:${content.site.phone1.replace(/\s/g,'')}`} className={styles.oAction}>📞 {content.site.phone1}</a>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className={styles.oAction}>
              💬 WhatsApp
            </a>
          )}
          <Link href="/admin" className={styles.oAction} onClick={() => setOpen(false)}>👤 Admin portal</Link>
          <div className={styles.oTheme}>
            <span>Appearance</span>
            {themeBtn}
          </div>
        </div>
      </div>
    </header>
  );
}
