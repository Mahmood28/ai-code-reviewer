interface Props {
  code: string;
  language: string;
  loading: boolean;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: string) => void; // string keeps this component decoupled from the Language union
  onReview: () => void;
  onLoadSample: () => void;
}

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'go', 'rust', 'cpp', 'sql'];

export default function CodeEditor({
  code, language, loading,
  onCodeChange, onLanguageChange, onReview, onLoadSample,
}: Props) {
  const lines = code ? code.split('\n').length : 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      borderRight: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Code Input
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button
            onClick={onLoadSample}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              color: 'var(--muted)', padding: '5px 10px', borderRadius: 6,
              cursor: 'pointer', fontSize: 13,
            }}
          >
            Load Sample
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 16px' }}>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Paste your code here or click 'Load Sample'..."
          spellCheck={false}
          style={{
            width: '100%', height: '100%',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13, lineHeight: 1.6, padding: 14,
            resize: 'none', outline: 'none', tabSize: 2,
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={(e)  => { e.target.style.borderColor = 'var(--border)'; }}
        />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px', borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <button
          onClick={onReview}
          disabled={loading || !code.trim()}
          style={{
            background: 'var(--accent)', color: 'white', border: 'none',
            padding: '8px 20px', borderRadius: 7, fontSize: 14, fontWeight: 600,
            cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !code.trim() ? 0.5 : 1,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {loading ? <Spinner /> : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          )}
          {loading ? 'Analyzing…' : 'Review Code'}
        </button>
        <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
          {lines} {lines === 1 ? 'line' : 'lines'}
        </span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 15, height: 15,
      border: '2px solid rgba(255,255,255,.3)',
      borderTopColor: 'white', borderRadius: '50%',
      animation: 'spin .7s linear infinite',
    }} />
  );
}

if (typeof document !== 'undefined' && !document.getElementById('spin-style')) {
  const s = document.createElement('style');
  s.id = 'spin-style';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}
