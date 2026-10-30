import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { getIntents, type BotMsg } from '../data/content';
import type { SiteSettings } from '../data/types';
import { useContent } from './ContentProvider';
import styles from '../styles/Chatbot.module.css';

interface Msg { role: 'bot' | 'user'; text: string; followups?: string[]; ts: Date }

const QUICK_TOPICS = ['Services', 'Quote', 'Projects', 'Team', 'Safety'];

const WELCOME_CHIPS = [
  { icon: 'M3 5h18v11H7l-4 4V5z', label: 'What services do you offer?' },
  { icon: 'M4 5h7v7H4V5zm9 0h7v4h-7V5zM4 14h7v5H4v-5zm9-3h7v8h-7v-8z', label: 'Show me your projects' },
  { icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', label: 'How do I get a quote?' },
  { icon: 'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.7 0-8 1.3-8 4v3h9v-3c0-1.4.6-2.6 1.6-3.5A13 13 0 0 0 8 14zm8 0c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4z', label: 'Tell me about the team' },
];

function buildReply(msg: string, site: SiteSettings): BotMsg {
  const m = msg.trim();
  let best = -1;
  const intents = getIntents(site);
  let res = intents[intents.length - 1].response;
  for (const intent of intents) {
    let score = 0;
    for (const pat of intent.patterns) if (pat.test(m)) score++;
    if (score > best) { best = score; res = intent.response; }
  }
  return res;
}

/** Renders **bold** segments and line breaks from the intent text. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => {
        const segs = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {segs.map((s, j) => (j % 2 === 1 ? <strong key={j}>{s}</strong> : s))}
            {i < arr.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

function Bubble({ m, isLast, onChip }: { m: Msg; isLast: boolean; onChip: (t: string) => void }) {
  const isBot = m.role === 'bot';
  const time = m.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={isBot ? styles.rowBot : styles.rowUser}>
      {isBot && (
        <div className={styles.avatar} aria-hidden="true">AR</div>
      )}
      <div className={isBot ? styles.bubbleBot : styles.bubbleUser}>
        <div className={styles.text}><RichText text={m.text} /></div>
        <div className={styles.time} suppressHydrationWarning>{time}</div>
        {isBot && isLast && m.followups && m.followups.length > 0 && (
          <div className={styles.chips}>
            {m.followups.map((f, i) => (
              <button key={i} className={styles.chip} onClick={() => onChip(f)}>{f}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const { content } = useContent();
  const site = content.site;
  const wa = site.whatsapp.replace(/[^0-9]/g, '');

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, typing]);

  useEffect(() => {
    if (!open) return;
    setUnread(0);
    const t = setTimeout(() => (hasStarted ? inputRef.current : panelRef.current)?.focus(), 250);
    const onKey = (e: DocumentEventMap['keydown']) => {
      if (e.key === 'Escape') { setOpen(false); fabRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, hasStarted]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setInput('');
    setHasStarted(true);
    setMsgs(p => [...p, { role: 'user', text: t, ts: new Date() }]);
    setTyping(true);
    const resp = buildReply(t, site);
    const delay = Math.min(1800, Math.max(600, t.length * 8 + resp.text.length * 4));
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role: 'bot', text: resp.text, followups: resp.followups, ts: new Date() }]);
      if (!open) setUnread(c => c + 1);
    }, delay);
  };

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const clear = () => { setMsgs([]); setHasStarted(false); setInput(''); };

  return (
    <>
      {/* Launcher */}
      <button
        ref={fabRef}
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => { setOpen(o => !o); }}
        aria-label={open ? 'Close chat' : 'Chat with ARIA, our assistant'}
        aria-expanded={open}
        aria-controls="chat-window"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 1 0-1.4 1.4l4.9 5-4.9 4.9a1 1 0 1 0 1.4 1.4l4.9-4.9 4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.9 3 3 6.6 3 11c0 2.1.9 4 2.4 5.4L5 21l4.7-1.7c.7.2 1.5.3 2.3.3 5.1 0 9-3.6 9-8s-3.9-8-9-8z"/></svg>
        )}
        {!open && unread > 0 && <span className={styles.badge}>{unread > 9 ? '9+' : unread}</span>}
        {!open && <span className={styles.ring} aria-hidden="true" />}
      </button>

      {/* Window */}
      <div
        id="chat-window"
        ref={panelRef}
        tabIndex={-1}
        className={`${styles.win} ${open ? styles.winOpen : ''}`}
        role="dialog"
        aria-label="Chat with ARIA"
        aria-hidden={!open}
      >
        <header className={styles.header}>
          <div className={styles.hLeft}>
            <div className={styles.hAvatar} aria-hidden="true">
              AR<span className={styles.onlineDot} />
            </div>
            <div>
              <div className={styles.hTitle}>ARIA <span className={styles.hBadge}>Assistant</span></div>
              <div className={styles.hSub}>Online · replies in seconds</div>
            </div>
          </div>
          <div className={styles.hBtns}>
            <button className={styles.hBtn} onClick={clear} aria-label="Start a new chat" title="New chat">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M6 7h12l-1 13H7L6 7zm3-4h6l1 2h4v2H4V5h4l1-2z"/></svg>
            </button>
            <button className={styles.hBtn} onClick={() => setOpen(false)} aria-label="Close chat" title="Close">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>
            </button>
          </div>
        </header>

        {!hasStarted && (
          <div className={styles.welcome}>
            <div className={styles.wAvatar} aria-hidden="true">👋</div>
            <h3 className={styles.wTitle}>Hi, I&apos;m ARIA</h3>
            <p className={styles.wDesc}>
              Ask about {site.name} — services, projects, pricing, timelines or our team. I answer instantly.
            </p>
            <div className={styles.wChips}>
              {WELCOME_CHIPS.map((c, i) => (
                <button key={i} className={styles.wChip} onClick={() => send(c.label)}>
                  <span className={styles.wChipIcon}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d={c.icon}/></svg>
                  </span>
                  <span className={styles.wChipLabel}>{c.label}</span>
                  <span className={styles.wChipArrow} aria-hidden="true">›</span>
                </button>
              ))}
            </div>
            {wa && (
              <a className={styles.waLink} href={`https://wa.me/${wa}?text=${encodeURIComponent(site.whatsappMsg)}`} target="_blank" rel="noopener noreferrer">
                Prefer a human? Chat on WhatsApp →
              </a>
            )}
          </div>
        )}

        {hasStarted && (
          <div className={styles.msgs} role="log" aria-live="polite" aria-relevant="additions text">
            <div className={styles.divider}>Today</div>
            {msgs.map((m, i) => (
              <Bubble key={i} m={m} isLast={i === msgs.length - 1} onChip={send} />
            ))}
            {typing && (
              <div className={styles.rowBot}>
                <div className={styles.avatar} aria-hidden="true">AR</div>
                <div className={styles.typing} aria-label="ARIA is typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {hasStarted && (
          <div className={styles.quickBar}>
            {QUICK_TOPICS.map(t => (
              <button key={t} className={styles.quick} onClick={() => send(t)}>{t}</button>
            ))}
          </div>
        )}

        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about services, pricing, timelines…"
              className={styles.input}
              aria-label="Type your message"
              disabled={typing}
              autoComplete="off"
              maxLength={400}
            />
            <button
              className={styles.send}
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3.4 20.6 21 12 3.4 3.4 3.4 10l12 2-12 2z"/></svg>
            </button>
          </div>
          <p className={styles.note}>ARIA answers instantly · No external API required</p>
        </div>
      </div>
    </>
  );
}
