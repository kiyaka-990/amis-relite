/** Client-side admin lock. The portal lives in the browser, so this is a
 *  convenience gate (SHA-256 when available), not server-side security. */

const KEY = 'ar.admin.v1';
const SESSION = 'ar.admin.session';

interface Stored { salt: string; hash: string }

function fallbackHash(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c + i, 2654435761) >>> 0;
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

async function hash(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      /* insecure context — fall through */
    }
  }
  return fallbackHash(`${salt}:${password}`);
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

export function passwordExists(): boolean {
  return read() !== null;
}

export async function createPassword(password: string): Promise<void> {
  const salt = randomSalt();
  localStorage.setItem(KEY, JSON.stringify({ salt, hash: await hash(password, salt) }));
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = read();
  if (!stored) return false;
  return (await hash(password, stored.salt)) === stored.hash;
}

export function isLoggedIn(): boolean {
  try { return sessionStorage.getItem(SESSION) === '1'; } catch { return false; }
}

export function login(): void {
  try { sessionStorage.setItem(SESSION, '1'); } catch { /* noop */ }
}

export function logout(): void {
  try { sessionStorage.removeItem(SESSION); } catch { /* noop */ }
}
