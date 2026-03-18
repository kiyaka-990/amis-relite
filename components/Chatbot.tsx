import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { INTENTS, BotMsg } from '../data/content';
import styles from '../styles/Chatbot.module.css';

interface Msg { role: 'bot' | 'user'; text: string; followups?: string[]; ts: Date; }

const WELCOME_TEXT = `👋 Hello! I'm **ARIA** — the Amis Relite Intelligent Assistant.\n\nI'm trained on everything about our construction services, projects, team, pricing, and more. Ask me anything! 😊`;
const WELCOME_FOLLOWUPS = ['What services do you offer?', 'Show me your projects', 'How do I get a quote?', 'Tell me about the team'];
const QUICK_TOPICS = ['Services', 'Quote', 'Projects', 'Team', 'Safety'];

function getBotResponse(msg: string): BotMsg {
  const m = msg.trim();
  let best = -1, res = INTENTS[INTENTS.length - 1].response;
  for (const intent of INTENTS) {
    let score = 0;
    for (const pat of intent.patterns) if (pat.test(m)) score++;
    if (score > best) { best = score; res = intent.response; }
  }
  return res;
}

// Client-only timestamp — avoids SSR/hydration mismatch
function MsgTime({ ts }: { ts: Date }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    setLabel(ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [ts]);
  return <div className={styles.bubbleTime} suppressHydrationWarning>{label}</div>;
}

function MsgBubble({ m, isLast, onChip }: { m: Msg; isLast: boolean; onChip: (t: string) => void }) {
  const isBot = m.role === 'bot';
  const parts = m.text.split('\n');
  return (
    <div className={`${styles.msgRow} ${isBot ? styles.msgRowBot : styles.msgRowUser}`}>
      {isBot && <div className={styles.botAv}><span>AR</span></div>}
      <div className={`${styles.bubble} ${isBot ? styles.bubbleBot : styles.bubbleUser}`}>
        <div className={styles.bubbleText}>
          {parts.map((line, i) => {
            const segs = line.split(/\*\*(.*?)\*\*/g);
            return (
              <span key={i}>
                {segs.map((s, j) => j % 2 === 1 ? <strong key={j}>{s}</strong> : s)}
                {i < parts.length - 1 && <br />}
              </span>
            );
          })}
        </div>
        <MsgTime ts={m.ts} />
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
  const [open,   setOpen]   = useState(false);
  const [msgs,   setMsgs]   = useState<Msg[]>([]); // empty on SSR — filled on mount
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [shake,  setShake]  = useState(false);
  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only set welcome message on client — prevents new Date() SSR mismatch
  useEffect(() => {
    setMsgs([{ role: 'bot', ts: new Date(), text: WELCOME_TEXT, followups: WELCOME_FOLLOWUPS }]);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 320); }
  }, [open]);
  useEffect(() => {
    const t = setTimeout(() => setShake(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const send = (text: string) => {
    const t = text.trim(); if (!t || typing) return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', text: t, ts: new Date() }]);
    setTyping(true);
    const resp = getBotResponse(t);
    const delay = Math.min(2200, Math.max(700, t.length * 12 + resp.text.length * 7));
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role: 'bot', text: resp.text, followups: resp.followups, ts: new Date() }]);
      if (!open) setUnread(c => c + 1);
    }, delay);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const clear = () => {
    setMsgs([{ role: 'bot', ts: new Date(), text: WELCOME_TEXT, followups: WELCOME_FOLLOWUPS }]);
    setInput('');
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        className={`${styles.fab} ${shake ? styles.fabShake : ''} ${open ? styles.fabOpen : ''}`}
        onClick={() => { setOpen(!open); setShake(false); }}
        aria-label="Chat with ARIA"
      >
        <span className={styles.fabEmoji}>{open ? '✕' : '💬'}</span>
        {!open && <span className={styles.fabRing} />}
        {unread > 0 && !open && <span className={styles.badge}>{unread}</span>}
      </button>

      {/* ── Chat Window ── */}
      <div className={`${styles.win} ${open ? styles.winOpen : ''}`}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.hLeft}>
            <div className={styles.hAv}>
              <span>🤖</span>
              <span className={styles.onlineDot} />
            </div>
            <div>
              <div className={styles.hTitle}>ARIA <span className={styles.hBadge}>AI</span></div>
              <div className={styles.hSub}>
                <span className={styles.onlineText}>● Online</span> · Amis Relite Assistant
              </div>
            </div>
          </div>
          <div className={styles.hActions}>
            <button className={styles.hBtn} onClick={clear} title="New chat">🗑</button>
            <button className={styles.hBtn} onClick={() => setOpen(false)} title="Close">✕</button>
          </div>
        </div>

        {/* Welcome banner — shown only when no user messages yet */}
        {msgs.length <= 1 && (
          <div className={styles.welcomeBanner}>
            <span className={styles.wIcon}>👋</span>
            <div className={styles.wText}>
              <div className={styles.wGreeting}>Hi there! How can I help?</div>
              <div className={styles.wSub}>Ask me anything about our construction services, projects, pricing, or team — I&apos;ll answer instantly.</div>
            </div>
          </div>
        )}

        {/* Messages — flex:1, min-height:0 so it scrolls correctly */}
        <div className={styles.msgs}>
          <div className={styles.dateDivider}>Today</div>
          {msgs.map((m, i) => (
            <MsgBubble key={i} m={m} isLast={i === msgs.length - 1} onChip={send} />
          ))}
          {typing && (
            <div className={styles.msgRow}>
              <div className={styles.botAv}><span>AR</span></div>
              <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
                <span className={styles.td1} /><span className={styles.td2} /><span className={styles.td3} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick topics — horizontal scroll, no wrap */}
        <div className={styles.quickBar}>
          <span className={styles.quickLabel}>Quick:</span>
          {QUICK_TOPICS.map(t => (
            <button key={t} className={styles.quick} onClick={() => send(t)}>{t}</button>
          ))}
        </div>

        {/* Input area */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrap}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask me anything about Amis Relite…"
              className={styles.input}
              disabled={typing}
              autoComplete="off"
            />
            <button
              className={styles.sendBtn}
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              aria-label="Send"
            >
              <span>➤</span>
            </button>
          </div>
          <div className={styles.inputFooter}>Powered by Amis Relite AI · No external API</div>
        </div>

      </div>
    </>
  );
}
