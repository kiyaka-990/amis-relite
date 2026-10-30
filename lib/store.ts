import type { SiteContent } from '../data/types';
import { DEFAULT_CONTENT } from '../data/content';

export const CONTENT_KEY = 'ar.content.v1';
export const API_PATH = '/api/content';

/** Read the admin's locally saved content, or null when it has never been saved. */
export function readLocalContent(): SiteContent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return mergeContent(DEFAULT_CONTENT, parsed);
  } catch {
    return null;
  }
}

/** Overlay admin edits onto a base document, section by section. */
export function mergeContent(base: SiteContent, patch: Partial<SiteContent>): SiteContent {
  return {
    site: { ...base.site, ...(patch.site || {}) },
    hero: patch.hero?.length ? patch.hero : base.hero,
    stats: patch.stats?.length ? patch.stats : base.stats,
    services: patch.services?.length ? patch.services : base.services,
    projects: patch.projects?.length ? patch.projects : base.projects,
    testimonials: patch.testimonials?.length ? patch.testimonials : base.testimonials,
    team: patch.team?.length ? patch.team : base.team,
    faqs: patch.faqs?.length ? patch.faqs : base.faqs,
  };
}

export function writeLocalContent(content: SiteContent) {
  try {
    window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  } catch {
    /* storage full or unavailable — the in-memory state still applies */
  }
}

/** Best-effort server persistence: works on any host with a writable filesystem. */
export async function pushContent(content: SiteContent): Promise<boolean> {
  try {
    const res = await fetch(API_PATH, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function pullContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(API_PATH, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<SiteContent>;
    return mergeContent(DEFAULT_CONTENT, data);
  } catch {
    return null;
  }
}
