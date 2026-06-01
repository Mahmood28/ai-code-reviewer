import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function ConfigModal({ onClose }: Props) {
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('cr_api_url') ?? 'http://localhost:3001'
  );

  function save(): void {
    localStorage.setItem('cr_api_url', apiUrl);
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, width: 440 }}
      >
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Configuration</h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            Backend API URL
          </label>
          <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} style={{ width: '100%' }} />
        </div>

        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          Your <code style={{ background: 'var(--surface2)', padding: '1px 4px', borderRadius: 3 }}>OPENAI_API_KEY</code> lives in{' '}
          <code style={{ background: 'var(--surface2)', padding: '1px 4px', borderRadius: 3 }}>backend/.env</code> — it never leaves the server.
          The Vite dev proxy forwards <code style={{ background: 'var(--surface2)', padding: '1px 4px', borderRadius: 3 }}>/api/*</code> automatically.
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
          <button onClick={save} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
