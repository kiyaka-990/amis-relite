import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type ThemePref = 'light' | 'dark' | 'system';
export type TextScale = 0 | 1 | 2;
export type BoolPrefKey = 'contrast' | 'motion' | 'links' | 'dyslexia';

export interface Preferences {
  theme: ThemePref;
  scale: TextScale;
  contrast: boolean;
  motion: boolean;
  links: boolean;
  dyslexia: boolean;
}

export const PREFS_KEY = 'ar.prefs.v1';

export const DEFAULT_PREFS: Preferences = {
  theme: 'light',
  scale: 0,
  contrast: false,
  motion: true,
  links: false,
  dyslexia: false,
};

interface PrefCtx {
  prefs: Preferences;
  resolved: 'light' | 'dark';
  set: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  setTheme: (t: ThemePref) => void;
  toggleTheme: () => void;
  reset: () => void;
}

const Ctx = createContext<PrefCtx>({
  prefs: DEFAULT_PREFS,
  resolved: 'light',
  set: () => {},
  setTheme: () => {},
  toggleTheme: () => {},
  reset: () => {},
});

function systemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readPrefs(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

/** Mirror preferences onto <html> so CSS and the boot script stay in sync. */
function apply(p: Preferences, resolved: 'light' | 'dark') {
  const el = document.documentElement;
  el.dataset.theme = resolved;
  el.dataset.themePref = p.theme;
  el.dataset.text = String(p.scale);
  el.dataset.contrast = p.contrast ? 'on' : 'off';
  el.dataset.motion = p.motion ? 'on' : 'off';
  el.dataset.links = p.links ? 'on' : 'off';
  el.dataset.dyslexia = p.dyslexia ? 'on' : 'off';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [sys, setSys] = useState<'light' | 'dark'>('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readPrefs();
    // Default to light unless the visitor already chose otherwise.
    setPrefs({ ...DEFAULT_PREFS, ...stored });
    setSys(systemTheme());
    setHydrated(true);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSys = () => setSys(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onSys);
    return () => mq.removeEventListener('change', onSys);
  }, []);

  const resolved: 'light' | 'dark' = prefs.theme === 'system' ? sys : prefs.theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!hydrated) return;
    apply(prefs, resolved);
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch { /* noop */ }
  }, [prefs, resolved, hydrated]);

  const set = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs(p => ({ ...p, [key]: value }));
  }, []);

  const setTheme = useCallback((t: ThemePref) => setPrefs(p => ({ ...p, theme: t })), []);
  const toggleTheme = useCallback(() => {
    setPrefs(p => ({ ...p, theme: resolved === 'dark' ? 'light' : 'dark' }));
  }, [resolved]);
  const reset = useCallback(() => setPrefs(DEFAULT_PREFS), []);

  const value = useMemo(
    () => ({ prefs, resolved, set, setTheme, toggleTheme, reset }),
    [prefs, resolved, set, setTheme, toggleTheme, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePreferences = () => useContext(Ctx);
