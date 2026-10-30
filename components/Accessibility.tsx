import { useEffect, useRef, useState } from 'react';
import { usePreferences, type BoolPrefKey, type TextScale, type ThemePref } from './PreferencesProvider';
import styles from '../styles/Accessibility.module.css';

const SCALE_LABELS: Array<{ v: TextScale; label: string; aria: string }> = [
  { v: 0, label: 'A', aria: 'Normal text size' },
  { v: 1, label: 'A+', aria: 'Larger text' },
  { v: 2, label: 'A++', aria: 'Largest text' },
];

const THEME_OPTIONS: Array<{ v: ThemePref; label: string }> = [
  { v: 'light', label: 'Light' },
  { v: 'dark', label: 'Dark' },
  { v: 'system', label: 'System' },
];

const TOGGLES: Array<{ key: BoolPrefKey; label: string; desc: string }> = [
  { key: 'contrast', label: 'High contrast', desc: 'Stronger colours and opaque surfaces' },
  { key: 'motion', label: 'Reduce motion', desc: 'Turn off animations and smooth scrolling' },
  { key: 'links', label: 'Underline links', desc: 'Make every link easy to spot' },
  { key: 'dyslexia', label: 'Dyslexia-friendly font', desc: 'Lexend typeface with wider spacing' },
];

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`${styles.switch} ${on ? styles.switchOn : ''}`}
      onClick={() => onChange(!on)}
    >
      <span className={styles.knob} />
    </button>
  );
}

export default function Accessibility() {
  const { prefs, set, setTheme, reset } = usePreferences();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open]);

  return (
    <div className={styles.root}>
      <button
        ref={triggerRef}
        className={`${styles.tab} ${open ? styles.tabOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label={open ? 'Close accessibility menu' : 'Open accessibility menu'}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4.2" r="2.2" fill="currentColor" />
          <path
            fill="currentColor"
            d="M20 7.2c-2.4.9-5 1.4-8 1.4s-5.6-.5-8-1.4v2.1c1.6.6 3.3 1 5 1.3l-.7 3.9L7.4 22h2.2l1.5-6.2h1.8L14.4 22h2.2l-1.9-7.5-.7-3.9c1.7-.3 3.4-.7 5-1.3V7.2z"
          />
        </svg>
        <span className={styles.tabLabel}>Accessibility</span>
      </button>

      <div
        id="a11y-panel"
        ref={panelRef}
        tabIndex={-1}
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        role="dialog"
        aria-label="Accessibility options"
        aria-hidden={!open}
      >
        <div className={styles.head}>
          <div>
            <h2 className={styles.title}>Accessibility</h2>
            <p className={styles.sub}>Adjust this site to suit you</p>
          </div>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close accessibility menu">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.group}>
            <h3 className={styles.groupTitle}>Theme</h3>
            <div className={styles.segment} role="group" aria-label="Colour theme">
              {THEME_OPTIONS.map(o => (
                <button
                  key={o.v}
                  className={`${styles.segBtn} ${prefs.theme === o.v ? styles.segActive : ''}`}
                  onClick={() => setTheme(o.v)}
                  aria-pressed={prefs.theme === o.v}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.group}>
            <h3 className={styles.groupTitle}>Text size</h3>
            <div className={styles.segment} role="group" aria-label="Text size">
              {SCALE_LABELS.map(s => (
                <button
                  key={s.v}
                  className={`${styles.segBtn} ${styles.scaleBtn} ${prefs.scale === s.v ? styles.segActive : ''}`}
                  onClick={() => set('scale', s.v)}
                  aria-pressed={prefs.scale === s.v}
                  aria-label={s.aria}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.group}>
            <h3 className={styles.groupTitle}>Options</h3>
            <ul className={styles.list}>
              {TOGGLES.map(t => (
                <li key={t.key} className={styles.row}>
                  <span className={styles.rowText}>
                    <span className={styles.rowLabel}>{t.label}</span>
                    <span className={styles.rowDesc}>{t.desc}</span>
                  </span>
                  <Switch on={prefs[t.key]} label={t.label} onChange={v => set(t.key, v)} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.foot}>
          <button className={styles.reset} onClick={reset}>
            Reset all settings
          </button>
          <p className={styles.note}>Saved on this device for your next visit.</p>
        </div>
      </div>
    </div>
  );
}
