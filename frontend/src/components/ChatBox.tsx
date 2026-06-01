import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import type { ChatMessage } from '../types.ts';

interface Props {
  code: string;
  language: string;
  summary: string;
}

export default function ChatBox({ code, language, summary }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(): Promise<void> {
    const question = input.trim();
    if (!question || loading) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: question };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '…' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, code, language, summary, history: messages }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { error: string }).error ?? `HTTP ${res.status}`);
      setMessages([...history, { role: 'assistant', content: (json as { data: string }).data }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setMessages([...history, { role: 'assistant', content: `**Error:** ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '14px 20px' }}>
      {messages.length > 0 && (
        <div style={{
          maxHeight: 200, overflowY: 'auto', marginBottom: 10,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'assistant' ? 'md-body' : undefined} style={{
              fontSize: 13, lineHeight: 1.55, padding: '8px 12px', borderRadius: 7,
              ...(m.role === 'user'
                ? { background: 'rgba(124,108,247,.15)', alignSelf: 'flex-end', maxWidth: '80%' }
                : { background: 'var(--surface2)', alignSelf: 'flex-start', maxWidth: '90%' }),
            }}>
              {m.role === 'assistant'
                ? <div dangerouslySetInnerHTML={{ __html: marked.parse(m.content, { breaks: true }) as string }} />
                : m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void send(); }}
          placeholder="Ask a follow-up: 'How do I fix the SQL injection?'"
          style={{ flex: 1 }}
        />
        <button
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            color: loading ? 'var(--muted)' : 'var(--text)',
            padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 13,
          }}
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('md-chat-styles')) {
  const s = document.createElement('style');
  s.id = 'md-chat-styles';
  s.textContent = `
    .md-body p { margin: 0 0 8px; }
    .md-body p:last-child { margin-bottom: 0; }
    .md-body ul, .md-body ol { padding-left: 18px; margin: 4px 0 8px; }
    .md-body li { margin-bottom: 3px; }
    .md-body code { background: var(--bg); padding: 1px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; color: var(--accent2); }
    .md-body pre { background: var(--bg); border-radius: 6px; padding: 10px 12px; margin: 8px 0; overflow-x: auto; }
    .md-body pre code { background: none; padding: 0; }
    .md-body strong { font-weight: 600; }
    .md-body h1, .md-body h2, .md-body h3 { font-size: 13px; font-weight: 700; margin: 8px 0 4px; }
  `;
  document.head.appendChild(s);
}
