import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { INTENTS, BotMsg } from '../data/content';
import styles from '../styles/Chatbot.module.css';

interface Msg { role: 'bot' | 'user'; text: string; followups?: string[]; ts: Date; }

const QUICK_TOPICS = ['Services', 'Quote', 'Projects', 'Team', 'Safety'];
const WELCOME_CHIPS = [
  { icon: '🏢', label: 'What services do you offer?' },
  { icon: '📁', label: 'Show me your projects' },
  { icon: '💰', label: 'How do I get a quote?' },
  { icon: '👥', label: 'Tell me about the team' },
];

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

function MsgTime({ ts }: { ts: Date }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    setLabel(ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [ts]);
  return <div className={styles.bubbleTime} suppressHydrationWarning>{label}</div>;
}

function MsgBubble({ m, isLast, onChip }: { m: Msg; isLast: boolean; onChip: (t: string) => void }) {
  const isBot = m.role === 'bot';
  return (
    <div className={isBot ? styles.rowBot : styles.rowUser}>
      {isBot && <div className={styles.botAv}>AR</div>}
      <div className={isBot ? styles.bubbleBot : styles.bubbleUser}>
        <div className={styles.bubbleText}>
          {m.text.split('\n').map((line, i, arr) => {
            const segs = line.split(/\*\*(.*?)\*\*/g);
            return (
              <span key={i}>
                {segs.map((s, j) => j % 2 === 1 ? <strong key={j}>{s}</strong> : s)}
                {i < arr.length - 1 && <br />}
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
  const [open,       setOpen]       = useState(false);
  const [msgs,       setMsgs]       = useState<Msg[]>([]);
  const [input,      setInput]      = useState('');
  const [typing,     setTyping]     = useState(false);
  const [unread,     setUnread]     = useState(0);
  const [shake,      setShake]      = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); } }, [open]);
  useEffect(() => { const t = setTimeout(() => setShake(true), 5000); return () => clearTimeout(t); }, []);

  const send = (text: string) => {
    const t = text.trim(); if (!t || typing) return;
    setInput(''); setHasStarted(true);
    setMsgs(p => [...p, { role: 'user', text: t, ts: new Date() }]);
    setTyping(true);
    const resp = getBotResponse(t);
    const delay = Math.min(2000, Math.max(700, t.length * 10 + resp.text.length * 6));
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role: 'bot', text: resp.text, followups: resp.followups, ts: new Date() }]);
      if (!open) setUnread(c => c + 1);
    }, delay);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const clear = () => { setMsgs([]); setHasStarted(false); setInput(''); };

  return (
    <>
      {/* FAB */}
      <button
        className={[styles.fab, shake && styles.fabShake, open && styles.fabOpen].filter(Boolean).join(' ')}
        onClick={() => { setOpen(o => !o); setShake(false); }}
        aria-label="Chat with ARIA"
      >
        <span className={styles.fabIcon}>{open ? '✕' : '💬'}</span>
        {!open && <span className={styles.fabRing} />}
        {unread > 0 && !open && <span className={styles.badge}>{unread}</span>}
      </button>

      {/* Window */}
      <div className={[styles.win, open && styles.winOpen].filter(Boolean).join(' ')}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.hLeft}>
            <div className={styles.hAv}>
              🤖
              <span className={styles.onlineDot} />
            </div>
            <div>
              <div className={styles.hTitle}>
                ARIA&nbsp;<span className={styles.hBadge}>AI</span>
              </div>
              <div className={styles.hSub}>
                <span className={styles.online}>● Online</span>&nbsp;· Amis Relite
              </div>
            </div>
          </div>
          <div className={styles.hBtns}>
            <button className={styles.hBtn} onClick={clear} title="New chat">🗑</button>
            <button className={styles.hBtn} onClick={() => setOpen(false)} title="Close">✕</button>
          </div>
        </div>

        {/* WELCOME STATE */}
        {!hasStarted && (
          <div className={styles.welcome}>
            <span className={styles.wEmoji}>👋</span>
            <h3 className={styles.wTitle}>Hi! How can I help?</h3>
            <p className={styles.wDesc}>
              Ask me anything about Amis Relite — services, projects, pricing, or team.
            </p>
            <div className={styles.wDivider} />
            <div className={styles.wChips}>
              {WELCOME_CHIPS.map((c, i) => (
                <button key={i} className={styles.wChip} onClick={() => send(c.label)}>
                  <span className={styles.wChipIcon}>{c.icon}</span>
                  <span className={styles.wChipLabel}>{c.label}</span>
                  <span className={styles.wChipArrow}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT STATE */}
        {hasStarted && (
          <div className={styles.msgs}>
            <div className={styles.dateDivider}>Today</div>
            {msgs.map((m, i) => (
              <MsgBubble key={i} m={m} isLast={i === msgs.length - 1} onChip={send} />
            ))}
            {typing && (
              <div className={styles.rowBot}>
                <div className={styles.botAv}>AR</div>
                <div className={styles.bubbleBot}>
                  <span className={styles.dot} /><span className={styles.dot2} /><span className={styles.dot3} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {/* Quick bar — only during chat */}
        {hasStarted && (
          <div className={styles.quickBar}>
            <span className={styles.quickLbl}>Quick:</span>
            {QUICK_TOPICS.map(t => (
              <button key={t} className={styles.quick} onClick={() => send(t)}>{t}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={hasStarted ? 'Ask a follow-up…' : 'Type your question…'}
              className={styles.input}
              disabled={typing}
              autoComplete="off"
            />
            <button
              className={styles.sendBtn}
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              aria-label="Send"
            >➤</button>
          </div>
          <p className={styles.inputNote}>Amis Relite AI · No external API</p>
        </div>

      </div>
    </>
  );
}
