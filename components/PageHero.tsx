import Link from 'next/link';
import styles from '../styles/PageHero.module.css';

/** Compact header used by every inner page (the home page uses the full hero instead). */
export default function PageHero({ title, em, subtitle, image, crumb }: {
  title: string;
  em?: string;
  subtitle: string;
  image: string;
  crumb: string;
}) {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className={styles.bg} style={{ backgroundImage: `url(${image})` }} aria-hidden="true"/>
      <div className={styles.veil} aria-hidden="true"/>
      <div className={styles.grid} aria-hidden="true"/>

      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>

        <h1 id="page-title" className={styles.title}>
          {title}
          {em && <><br/><em>{em}</em></>}
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.accent} aria-hidden="true"/>
    </section>
  );
}
