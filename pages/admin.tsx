import { useEffect, useState, type FormEvent } from 'react';
import Head from 'next/head';
import { useContent } from '../components/ContentProvider';
import { usePreferences } from '../components/PreferencesProvider';
import { Dashboard, ResourceEditor, SettingsEditor } from '../components/admin/Editor';
import { COLLECTIONS } from '../components/admin/schema';
import { createPassword, isLoggedIn, login, logout, passwordExists, verifyPassword } from '../lib/adminAuth';
import type { SiteContent } from '../data/types';
import { DEFAULT_CONTENT } from '../data/content';
import styles from '../styles/Admin.module.css';

type View = 'dashboard' | 'settings' | 'data' | string;

/* ── auth screens ─────────────────────────────────────── */

function Gate({ onPass }: { onPass: () => void }) {
  const [setup, setSetup] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { setSetup(!passwordExists()); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (setup) {
      if (pw.length < 6) return setError('Use at least 6 characters.');
      if (pw !== pw2) return setError('Passwords do not match.');
      setBusy(true);
      await createPassword(pw);
      login();
      setBusy(false);
      return onPass();
    }
    setBusy(true);
    const ok = await verifyPassword(pw);
    setBusy(false);
    if (!ok) return setError('Incorrect password.');
    login();
    onPass();
  };

  return (
    <div className={styles.gate}>
      <form className={styles.gateCard} onSubmit={submit}>
        <div className={styles.gateLogo}>AMIS RELITE<em>.</em></div>
        <h1 className={styles.gateTitle}>{setup ? 'Set up your admin portal' : 'Admin sign in'}</h1>
        <p className={styles.gateSub}>
          {setup
            ? 'Choose a password to protect the content manager. It is stored on this device only.'
            : 'Enter your password to manage site content.'}
        </p>

        <label className={styles.label} htmlFor="pw">Password</label>
        <input
          id="pw" className={styles.input} type="password" value={pw} autoFocus
          onChange={e => setPw(e.target.value)} placeholder="••••••••" required
        />

        {setup && (
          <>
            <label className={styles.label} htmlFor="pw2">Confirm password</label>
            <input
              id="pw2" className={styles.input} type="password" value={pw2}
              onChange={e => setPw2(e.target.value)} placeholder="••••••••" required
            />
          </>
        )}

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button className={`${styles.btnPrimary} ${styles.gateBtn}`} disabled={busy}>
          {busy ? 'Please wait…' : setup ? 'Create password & continue' : 'Sign in'}
        </button>

        <a className={styles.gateLink} href="/">← Back to website</a>
      </form>
    </div>
  );
}

/* ── data / backup view ───────────────────────────────── */

function DataTools() {
  const { content, save, reset } = useContent();
  const [server, setServer] = useState<'checking' | 'yes' | 'no'>('checking');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then(r => setServer(r.ok ? 'yes' : 'no'))
      .catch(() => setServer('no'));
  }, []);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amis-relite-content.json';
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Exported amis-relite-content.json');
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Partial<SiteContent>;
        save({ ...DEFAULT_CONTENT, ...data, site: { ...DEFAULT_CONTENT.site, ...(data.site || {}) } });
        setMsg('Content imported and saved.');
      } catch {
        setMsg('That file is not valid JSON content.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Data &amp; Backup</h2>
          <p className={styles.sectionIntro}>Move content between devices or restore the shipped defaults.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.dataRow}>
          <div>
            <strong>Export content</strong>
            <p>Download every setting and collection as a JSON file.</p>
          </div>
          <button className={styles.btnGhost} onClick={exportJson}>Export JSON</button>
        </div>

        <div className={styles.dataRow}>
          <div>
            <strong>Import content</strong>
            <p>Load a previously exported JSON file (replaces current content).</p>
          </div>
          <label className={`${styles.btnGhost} ${styles.fileLabel}`}>
            Import JSON
            <input
              type="file" accept="application/json" className={styles.fileInput}
              onChange={e => e.target.files?.[0] && importJson(e.target.files[0])}
            />
          </label>
        </div>

        <div className={styles.dataRow}>
          <div>
            <strong>Reset to defaults</strong>
            <p>Discard all edits and restore the original site content.</p>
          </div>
          <button
            className={styles.btnDanger}
            onClick={() => { if (window.confirm('Reset all content to the shipped defaults?')) { reset(); setMsg('Content reset to defaults.'); } }}
          >
            Reset everything
          </button>
        </div>
      </div>

      <div className={`${styles.card} ${styles.noteCard}`}>
        <strong>Where is my content saved?</strong>
        <p>
          {server === 'checking' && 'Checking server storage…'}
          {server === 'yes' && 'Server storage is available — edits are shared with every visitor.'}
          {server === 'no' && (
            'This host has no writable storage (common on serverless), so edits are saved to this browser and exported JSON can be redeployed.'
          )}
        </p>
        {msg && <p className={styles.success} role="status">{msg}</p>}
      </div>
    </div>
  );
}

/* ── app shell ────────────────────────────────────────── */

function Shell() {
  const [view, setView] = useState<View>('dashboard');
  const { ready } = useContent();
  const { resolved, toggleTheme } = usePreferences();

  const nav: Array<{ key: View; label: string; group?: boolean }> = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'settings', label: 'Site settings' },
    ...COLLECTIONS.map(c => ({ key: c.key as View, label: c.label, group: true })),
    { key: 'data', label: 'Data & backup', group: true },
  ];

  return (
    <div className={styles.admin}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}>AMIS RELITE<em>.</em> <span>Admin</span></a>
        <div className={styles.topActions}>
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle colour theme">
            {resolved === 'dark' ? '☀️' : '🌙'}
          </button>
          <a className={styles.btnGhost} href="/">View site</a>
          <button className={styles.btnGhost} onClick={() => { logout(); window.location.reload(); }}>Log out</button>
        </div>
      </header>

      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <nav aria-label="Admin sections">
            <ul className={styles.nav}>
              {nav.map(item => (
                <li key={item.key} className={item.group ? styles.navGroup : undefined}>
                  <button
                    className={`${styles.navBtn} ${view === item.key ? styles.navBtnActive : ''}`}
                    onClick={() => setView(item.key)}
                    aria-current={view === item.key ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.sideNote}>Changes appear on the site as soon as you save them.</p>
        </aside>

        <main className={styles.content}>
          {!ready ? (
            <p className={styles.loading}>Loading content…</p>
          ) : view === 'dashboard' ? (
            <Dashboard onOpen={setView} />
          ) : view === 'settings' ? (
            <SettingsEditor />
          ) : view === 'data' ? (
            <DataTools />
          ) : (
            <ResourceEditor config={COLLECTIONS.find(c => c.key === view) || COLLECTIONS[0]} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn() && passwordExists());
    setChecked(true);
  }, []);

  return (
    <>
      <Head>
        <title>Admin — Amis Relite Limited</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {!checked ? (
        <div className={styles.gate}>
          <p className={styles.gateLoading}>Loading admin portal…</p>
        </div>
      ) : authed ? (
        <Shell />
      ) : (
        <Gate onPass={() => setAuthed(true)} />
      )}
    </>
  );
}
