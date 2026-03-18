import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { PROJECTS } from '../data/content';
import styles from '../styles/Projects.module.css';

const FILTERS = [{l:'All',v:'all'},{l:'Commercial',v:'Commercial'},{l:'Residential',v:'Residential'},{l:'Civil',v:'Civil'}];

function TiltCard({ p, featured }: { p: typeof PROJECTS[0]; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x:0, y:0, shine:0 });
  const [hov, setHov] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    const shine = (e.clientX - r.left) / r.width;
    setTilt({ x, y, shine });
  };
  const onLeave = () => { setTilt({ x:0, y:0, shine:0 }); setHov(false); };

  return (
    <div
      ref={ref}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      onMouseMove={onMove} onMouseEnter={() => setHov(true)} onMouseLeave={onLeave}
      style={{ transform: hov ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.03)` : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)' }}
    >
      <div className={styles.cardImg}>
        <Image src={p.img} alt={p.name} fill style={{objectFit:'cover'}} sizes="50vw"/>
      </div>
      {/* Shine overlay */}
      {hov && <div className={styles.shine} style={{background:`radial-gradient(circle at ${tilt.shine*100}% 50%, rgba(255,255,255,0.08), transparent 70%)`}}/>}
      <div className={styles.cardOv}/>
      <div className={styles.statusPill} data-done={p.status==='Completed'?'true':'false'}>{p.status==='Completed'?'✓':''} {p.status}</div>
      <div className={styles.catDot} style={{background:p.color}}/>
      <div className={styles.info}>
        <span className={styles.cat} style={{color:p.color}}>{p.cat}</span>
        <h3 className={styles.name}>{p.name}</h3>
        <p className={styles.desc}>{p.desc}</p>
        <div className={styles.meta}>
          <span>📍 {p.loc}</span><span>⏱ {p.dur}</span>
        </div>
        <a href="#contact" className={styles.viewBtn}>View Details →</a>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState('all');
  const visible = active==='all' ? PROJECTS : PROJECTS.filter(p => p.cat===active);
  return (
    <section id="projects" className={`section section-alt2 ${styles.wrap}`}>
      <div className={styles.hdr}>
        <div><span className="section-tag">Our Portfolio</span><h2 className="section-title">Work That <em>Speaks for Itself</em></h2></div>
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button key={f.v} onClick={() => setActive(f.v)} className={`${styles.fb} ${active===f.v?styles.fbA:''}`}>{f.l}</button>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        {visible.map((p, i) => <TiltCard key={p.id} p={p} featured={i===0 && active==='all'} />)}
      </div>
    </section>
  );
}
