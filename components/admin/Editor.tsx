import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { useContent } from '../ContentProvider';
import type { SiteContent } from '../../data/types';
import { COLLECTIONS, SITE_FIELDS, getPath, setPath, type CollectionConfig, type Field } from './schema';
import styles from '../../styles/Admin.module.css';

/* ── shared bits ──────────────────────────────────────── */

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const str = value === undefined || value === null ? '' : String(value);
  const common = {
    id: `f-${field.key}`,
    className: styles.input,
    required: field.required,
    placeholder: field.placeholder,
    value: str,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const raw = e.target.value;
      onChange(field.type === 'number' ? (raw === '' ? '' : Number(raw)) : raw);
    },
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`f-${field.key}`}>
        {field.label}
        {field.required && <span className={styles.req} aria-hidden="true"> *</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea id={`f-${field.key}`} className={`${styles.input} ${styles.textarea}`} rows={field.rows || 3}
          required={field.required} placeholder={field.placeholder} value={str}
          onChange={e => onChange(e.target.value)} />
      ) : field.type === 'select' ? (
        <select {...common}>{(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}</select>
      ) : field.type === 'color' ? (
        <div className={styles.colorRow}>
          <input type="color" className={styles.color} value={/^#[0-9a-fA-F]{6}$/.test(str) ? str : '#C0392B'}
            onChange={e => onChange(e.target.value)} aria-label={field.label} />
          <input type="text" className={styles.input} value={str} onChange={e => onChange(e.target.value)} placeholder="#C0392B" />
        </div>
      ) : (
        <input
          {...common}
          type={field.type === 'number' ? 'number' : 'text'}
          min={field.min}
          max={field.max}
        />
      )}
      {field.hint && <p className={styles.hint}>{field.hint}</p>}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, footer }: {
  title: string; subtitle?: string; onClose: () => void; children: ReactNode; footer: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: DocumentEventMap['keydown']) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className={styles.backdrop} onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        <header className={styles.modalHead}>
          <div>
            <h3 className={styles.modalTitle}>{title}</h3>
            {subtitle && <p className={styles.modalSub}>{subtitle}</p>}
          </div>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Close dialog">✕</button>
        </header>
        <div className={styles.modalBody}>{children}</div>
        <footer className={styles.modalFoot}>{footer}</footer>
      </div>
    </div>
  );
}

/* ── collection CRUD ──────────────────────────────────── */

export function ResourceEditor({ config }: { config: CollectionConfig }) {
  const { content, save } = useContent();
  const items = (content[config.key] as unknown as Record<string, unknown>[]) || [];
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const commit = (next: Record<string, unknown>[]) => {
    save({ ...content, [config.key]: next } as unknown as SiteContent);
  };

  const openCreate = () => { setDraft(config.create()); setEditingIndex(null); };
  const openEdit = (i: number) => { setDraft(JSON.parse(JSON.stringify(items[i]))); setEditingIndex(i); };

  const submit = () => {
    if (!draft) return;
    const next = [...items];
    if (editingIndex === null) next.push(draft);
    else next[editingIndex] = draft;
    commit(next);
    setDraft(null);
  };

  const remove = (i: number) => {
    commit(items.filter((_, idx) => idx !== i));
    setPendingDelete(null);
  };

  const rows = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => (query ? JSON.stringify(item).toLowerCase().includes(query.toLowerCase()) : true));

  const primaryVal = (it: Record<string, unknown>) => String(getPath(it, config.primary) ?? '');
  const secondaryVal = (it: Record<string, unknown>) => (config.secondary ? String(getPath(it, config.secondary) ?? '') : '');

  return (
    <div>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>{config.label}</h2>
          <p className={styles.sectionIntro}>{config.intro}</p>
        </div>
        <div className={styles.headActions}>
          <input
            className={`${styles.input} ${styles.search}`}
            placeholder="Search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label={`Search ${config.label}`}
          />
          <button className={styles.btnPrimary} onClick={openCreate}>+ Add {config.singular.toLowerCase()}</button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '34%' }}>{config.fields.find(f => f.key === config.primary)?.label || 'Name'}</th>
              <th>{config.secondary ? config.fields.find(f => f.key === config.secondary)?.label ?? config.secondary : 'Details'}</th>
              <th style={{ width: 190 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.empty}>
                  {items.length === 0 ? `No ${config.label.toLowerCase()} yet — add the first one.` : 'Nothing matches your search.'}
                </td>
              </tr>
            )}
            {rows.map(({ item, i }) => (
              <tr key={i}>
                <td>
                  <div className={styles.cellPrimary}>
                    {typeof item.img === 'string' && item.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={String(item.img)} alt="" className={styles.thumb} />
                    ) : (
                      <span className={styles.thumbFallback}>{primaryVal(item).slice(0, 2)}</span>
                    )}
                    <span>
                      <strong>{primaryVal(item)}</strong>
                      {secondaryVal(item) && <em>{secondaryVal(item).slice(0, 90)}</em>}
                    </span>
                  </div>
                </td>
                <td className={styles.mutedCell}>
                  {Object.entries(item)
                    .filter(([k]) => !['img', config.primary, config.secondary].includes(k))
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${String(v)}`)
                    .join(' · ')}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <button className={styles.btnGhost} onClick={() => openEdit(i)}>Edit</button>
                    <button className={styles.btnDanger} onClick={() => setPendingDelete(i)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <Modal
          title={editingIndex === null ? `New ${config.singular.toLowerCase()}` : `Edit ${config.singular.toLowerCase()}`}
          subtitle={config.intro}
          onClose={() => setDraft(null)}
          footer={
            <>
              <button className={styles.btnGhost} onClick={() => setDraft(null)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={submit}>
                {editingIndex === null ? 'Add' : 'Save changes'}
              </button>
            </>
          }
        >
          <div className={styles.formGrid}>
            {config.fields.map(f => (
              <FieldInput
                key={f.key}
                field={f}
                value={getPath(draft, f.key)}
                onChange={v => setDraft(prev => (prev ? setPath(prev, f.key, v) : prev))}
              />
            ))}
          </div>
        </Modal>
      )}

      {pendingDelete !== null && (
        <Modal
          title="Delete this item?"
          subtitle="This removes it from the live site immediately."
          onClose={() => setPendingDelete(null)}
          footer={
            <>
              <button className={styles.btnGhost} onClick={() => setPendingDelete(null)}>Cancel</button>
              <button className={styles.btnDangerSolid} onClick={() => remove(pendingDelete)}>Delete</button>
            </>
          }
        >
          <p className={styles.confirmText}>
            <strong>{primaryVal(items[pendingDelete] || {})}</strong> will be permanently removed.
          </p>
        </Modal>
      )}
    </div>
  );
}

/* ── site settings ────────────────────────────────────── */

export function SettingsEditor() {
  const { content, save } = useContent();
  const [draft, setDraft] = useState(content.site);

  useEffect(() => { setDraft(content.site); }, [content.site]);

  return (
    <div>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Site Settings</h2>
          <p className={styles.sectionIntro}>
            Company details used by the navbar, contact section, footer, CTA banner, chatbot and WhatsApp button.
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={() => save({ ...content, site: draft })}>
          Save settings
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.formGrid}>
          {SITE_FIELDS.map(f => (
            <FieldInput
              key={f.key}
              field={f}
              value={getPath(draft, f.key)}
              onChange={v => setDraft(prev => setPath(prev, f.key, v))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── dashboard ────────────────────────────────────────── */

export function Dashboard({ onOpen }: { onOpen: (key: string) => void }) {
  const { content } = useContent();
  const counts: Record<string, number> = {
    hero: content.hero.length,
    stats: content.stats.length,
    services: content.services.length,
    projects: content.projects.length,
    testimonials: content.testimonials.length,
    team: content.team.length,
    faqs: content.faqs.length,
  };

  return (
    <div>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Dashboard</h2>
          <p className={styles.sectionIntro}>
            Edit everything on {content.site.name}&apos;s website. Changes save instantly and appear on the site.
          </p>
        </div>
        <a className={styles.btnGhost} href="/">View live site →</a>
      </div>

      <div className={styles.statGrid}>
        <button className={styles.statCard} onClick={() => onOpen('settings')}>
          <span className={styles.statNum}>✎</span>
          <span className={styles.statLbl}>Site settings</span>
          <span className={styles.statDesc}>Name, contact details, WhatsApp</span>
        </button>
        {COLLECTIONS.map(c => (
          <button key={c.key} className={styles.statCard} onClick={() => onOpen(c.key)}>
            <span className={styles.statNum}>{counts[c.key] ?? 0}</span>
            <span className={styles.statLbl}>{c.label}</span>
            <span className={styles.statDesc}>{c.intro}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
