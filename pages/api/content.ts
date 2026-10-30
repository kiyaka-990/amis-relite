import type { NextApiRequest, NextApiResponse } from 'next';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { SiteContent } from '../../data/types';
import { DEFAULT_CONTENT } from '../../data/content';
import { mergeContent } from '../../lib/store';

const FILE = path.join(process.cwd(), 'data', 'content.live.json');

/** Public content document: server copy when the host allows writes, shipped defaults otherwise. */
async function load(): Promise<SiteContent> {
  try {
    const raw = await readFile(FILE, 'utf8');
    return mergeContent(DEFAULT_CONTENT, JSON.parse(raw));
  } catch {
    return DEFAULT_CONTENT;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(await load());
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const body = req.body as Partial<SiteContent>;
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid payload' });
    try {
      const next = mergeContent(DEFAULT_CONTENT, body);
      await mkdir(path.dirname(FILE), { recursive: true });
      await writeFile(FILE, JSON.stringify(next, null, 2), 'utf8');
      return res.status(200).json({ ok: true });
    } catch {
      // Read-only filesystem (e.g. serverless) — the admin's local copy still applies.
      return res.status(503).json({ error: 'Read-only filesystem' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
