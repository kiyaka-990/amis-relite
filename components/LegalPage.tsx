import Layout from './Layout';
import PageHero from './PageHero';
import styles from '../styles/Legal.module.css';

export interface LegalSection {
  h: string;
  p?: string[];
  list?: string[];
}

/** Shared renderer for the policy pages (privacy, terms). */
export default function LegalPage({ title, crumb, subtitle, image, updated, sections, meta }: {
  title: string;
  crumb: string;
  subtitle: string;
  image: string;
  updated: string;
  sections: LegalSection[];
  meta: string;
}) {
  return (
    <Layout title={`${title} — Amis Relite Limited`} description={meta}>
      <PageHero
        crumb={crumb}
        title={title}
        subtitle={subtitle}
        image={image}
      />

      <section className={`section ${styles.wrap}`}>
        <article className={styles.doc}>
          <p className={styles.updated}>Last updated {updated}</p>

          {sections.map((s, i) => (
            <section key={s.h} className={styles.block} aria-labelledby={`s-${i}`}>
              <h2 id={`s-${i}`} className={styles.h2}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                {s.h}
              </h2>
              {s.p?.map((para, j) => <p key={j} className={styles.p}>{para}</p>)}
              {s.list && (
                <ul className={styles.list}>
                  {s.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}

          <aside className={styles.callout}>
            <strong>Questions about this page?</strong>
            <p>
              Email <a href="mailto:info@amisrelite.co.ke">info@amisrelite.co.ke</a> or call{' '}
              <a href="tel:+254725590275">+254 725 590275</a> — we reply within 24 hours.
            </p>
          </aside>
        </article>
      </section>
    </Layout>
  );
}
