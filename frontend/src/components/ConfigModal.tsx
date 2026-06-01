interface Props {
  onClose: () => void;
}

export default function ConfigModal({ onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, width: 440 }}
      >
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>About</h2>

        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 12 }}>
          <strong style={{ color: 'var(--text)' }}>Smart Code Reviewer</strong> uses OpenAI GPT-4o-mini via a Node.js/Express backend.
          Your code is sent to the server for analysis — it is never stored.
        </p>

        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          Reviews are grounded in a RAG knowledge base of coding conventions using LangChain + OpenAI embeddings.
          Follow-up questions maintain full conversation context across turns.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={onClose} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
