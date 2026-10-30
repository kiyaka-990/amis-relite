import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { SiteContent } from '../data/types';
import { DEFAULT_CONTENT } from '../data/content';
import { pullContent, pushContent, readLocalContent, writeLocalContent } from '../lib/store';

interface ContentCtx {
  content: SiteContent;
  ready: boolean;
  /** Persist content locally (instant) and to the server when available. */
  save: (next: SiteContent, opts?: { server?: boolean }) => void;
  reset: () => void;
}

const Ctx = createContext<ContentCtx>({
  content: DEFAULT_CONTENT,
  ready: false,
  save: () => {},
  reset: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const local = readLocalContent();
    pullContent()
      .then(server => {
        if (!alive) return;
        // Local edits win in the admin's own browser; server copy wins for everyone else.
        setContent(local ?? server ?? DEFAULT_CONTENT);
      })
      .catch(() => {
        if (alive) setContent(local ?? DEFAULT_CONTENT);
      })
      .finally(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  const save = useCallback((next: SiteContent, opts?: { server?: boolean }) => {
    setContent(next);
    writeLocalContent(next);
    if (opts?.server !== false) pushContent(next);
  }, []);

  const reset = useCallback(() => {
    try { window.localStorage.removeItem('ar.content.v1'); } catch { /* noop */ }
    setContent(DEFAULT_CONTENT);
    pushContent(DEFAULT_CONTENT);
  }, []);

  const value = useMemo(() => ({ content, ready, save, reset }), [content, ready, save, reset]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
