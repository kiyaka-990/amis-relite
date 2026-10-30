import type { CollectionKey, SiteContent } from '../../data/types';

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'color' | 'url';

export interface Field {
  key: string;          // supports dot paths, e.g. "cta1.l"
  label: string;
  type?: FieldType;     // defaults to 'text'
  options?: string[];
  required?: boolean;
  hint?: string;
  rows?: number;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface CollectionConfig {
  key: CollectionKey;
  label: string;
  singular: string;
  intro: string;
  primary: string;      // field shown as the row title
  secondary?: string;   // field shown as the row subtitle
  fields: Field[];

  create: () => Record<string, unknown>;
}

const PROJECT_CATS = ['Commercial', 'Residential', 'Civil'];
const PROJECT_STATUS = ['Completed', 'In Progress', 'Planned'];

export const COLLECTIONS: CollectionConfig[] = [
  {
    key: 'hero',
    label: 'Hero Slides',
    singular: 'Slide',
    intro: 'The rotating banner at the very top of the home page.',
    primary: 'title',
    secondary: 'tag',
    fields: [
      { key: 'tag', label: 'Eyebrow label', required: true, placeholder: 'Quality Construction Since 2017' },
      { key: 'title', label: 'Headline', required: true, placeholder: 'Building the Future,' },
      { key: 'em', label: 'Headline emphasis', required: true, hint: 'Rendered in the accent colour on the second line.' },
      { key: 'desc', label: 'Description', type: 'textarea', rows: 3, required: true },
      { key: 'img', label: 'Background image path', required: true, placeholder: '/images/atlantis.jpeg' },
      { key: 'cta1.l', label: 'Primary button label', required: true },
      { key: 'cta1.h', label: 'Primary button link', placeholder: '/contact' },
      { key: 'cta2.l', label: 'Secondary button label' },
      { key: 'cta2.h', label: 'Secondary button link', placeholder: '/projects' },
    ],
    create: () => ({
      tag: 'New slide', title: 'Headline', em: 'emphasis', desc: 'Describe this slide.',
      img: '/images/atlantis.jpeg',
      cta1: { l: 'Request a Quote', h: '/contact' },
      cta2: { l: 'View Projects', h: '/projects' },
    }),
  },
  {
    key: 'stats',
    label: 'Stats Bar',
    singular: 'Stat',
    intro: 'The animated counters shown directly below the hero.',
    primary: 'num',
    secondary: 'lbl',
    fields: [
      { key: 'num', label: 'Value', required: true, placeholder: '10+' },
      { key: 'lbl', label: 'Label', required: true, placeholder: 'Projects Completed' },
    ],
    create: () => ({ num: '10+', lbl: 'New stat' }),
  },
  {
    key: 'services',
    label: 'Services',
    singular: 'Service',
    intro: 'The service cards offered to clients.',
    primary: 'title',
    secondary: 'desc',
    fields: [
      { key: 'num', label: 'Display number', required: true, placeholder: '01' },
      { key: 'icon', label: 'Icon (emoji)', required: true, placeholder: '🏢' },
      { key: 'title', label: 'Title', required: true },
      { key: 'desc', label: 'Description', type: 'textarea', rows: 3, required: true },
      { key: 'img', label: 'Image path', required: true, placeholder: '/images/clock-tower.jpeg' },
    ],
    create: () => ({ num: '07', icon: '🏗️', title: 'New service', desc: 'Describe this service.', img: '/images/site.jpeg' }),
  },
  {
    key: 'projects',
    label: 'Projects',
    singular: 'Project',
    intro: 'Portfolio entries shown in the filterable project grid.',
    primary: 'name',
    secondary: 'loc',
    fields: [
      { key: 'name', label: 'Project name', required: true },
      { key: 'cat', label: 'Category', type: 'select', options: PROJECT_CATS, required: true },
      { key: 'status', label: 'Status', type: 'select', options: PROJECT_STATUS, required: true },
      { key: 'loc', label: 'Location', required: true, placeholder: 'Parklands, Nairobi' },
      { key: 'dur', label: 'Duration', required: true, placeholder: '12 Months' },
      { key: 'desc', label: 'Description', type: 'textarea', rows: 3, required: true },
      { key: 'img', label: 'Image path', required: true, placeholder: '/images/belgravia.jpeg' },
      { key: 'color', label: 'Accent colour', type: 'color' },
    ],
    create: () => ({
      name: 'New project', cat: 'Commercial', status: 'In Progress',
      loc: 'Nairobi', dur: '12 Months', desc: 'Describe this project.',
      img: '/images/project1.jpeg', color: '#C0392B',
    }),
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    singular: 'Testimonial',
    intro: 'Client quotes in the rotating review carousel.',
    primary: 'name',
    secondary: 'role',
    fields: [
      { key: 'text', label: 'Quote', type: 'textarea', rows: 4, required: true },
      { key: 'name', label: 'Client name', required: true },
      { key: 'role', label: 'Client role', required: true, placeholder: 'Property Investor' },
      { key: 'img', label: 'Avatar image path', required: true, placeholder: '/images/jane.jpg' },
      { key: 'stars', label: 'Rating (1–5)', type: 'number', min: 1, max: 5 },
    ],
    create: () => ({ text: 'Share what the client said…', name: 'Client Name', role: 'Role', img: '/images/jane.jpg', stars: 5 }),
  },
  {
    key: 'team',
    label: 'Team',
    singular: 'Member',
    intro: 'The people behind the company.',
    primary: 'name',
    secondary: 'role',
    fields: [
      { key: 'name', label: 'Full name', required: true },
      { key: 'role', label: 'Job title', required: true },
      { key: 'img', label: 'Photo path', required: true, placeholder: '/images/team-1.jpeg' },
      { key: 'bio', label: 'Short bio', type: 'textarea', rows: 3, required: true },
    ],
    create: () => ({ name: 'New member', role: 'Job title', img: '/images/team-1.jpeg', bio: 'Describe this person.' }),
  },
  {
    key: 'faqs',
    label: 'FAQs',
    singular: 'Question',
    intro: 'Questions and answers in the accordion.',
    primary: 'q',
    secondary: 'a',
    fields: [
      { key: 'q', label: 'Question', required: true },
      { key: 'a', label: 'Answer', type: 'textarea', rows: 4, required: true },
    ],
    create: () => ({ q: 'New question?', a: 'The answer goes here.' }),
  },
];

export const SITE_FIELDS: Field[] = [
  { key: 'name', label: 'Company name', required: true },
  { key: 'tag', label: 'Tagline', required: true },
  { key: 'phone1', label: 'Primary phone', required: true, placeholder: '+254 725 590275' },
  { key: 'phone2', label: 'Alternate phone', placeholder: '+254 725 817475' },
  { key: 'email1', label: 'Primary email', required: true, type: 'text' },
  { key: 'email2', label: 'Alternate email' },
  { key: 'addr', label: 'Address / location', required: true },
  { key: 'hours', label: 'Office hours', required: true },
  { key: 'whatsapp', label: 'WhatsApp number', required: true, hint: 'International format, digits only — e.g. 254725590275', placeholder: '254725590275' },
  { key: 'whatsappMsg', label: 'WhatsApp pre-filled message', type: 'textarea', rows: 2 },
  { key: 'facebook', label: 'Facebook URL', type: 'url' },
  { key: 'instagram', label: 'Instagram URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
];

/* ── value helpers (dot paths) ─────────────────────────── */
export function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.');
  const clone: unknown = JSON.parse(JSON.stringify(obj));
  let cursor = clone as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (typeof cursor[k] !== 'object' || cursor[k] === null) cursor[k] = {};
    cursor = cursor[k] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return clone as T;
}

export function collectionOf(key: string): CollectionConfig | undefined {
  return COLLECTIONS.find(c => c.key === key);
}

export type ContentKey = keyof SiteContent;
