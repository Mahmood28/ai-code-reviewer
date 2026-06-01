import { useState } from 'react';
import CodeEditor from './components/CodeEditor.tsx';
import ReviewPanel from './components/ReviewPanel.tsx';
import ConfigModal from './components/ConfigModal.tsx';
import type { ReviewResult } from './types.ts';

type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'go' | 'rust' | 'cpp' | 'sql';

const SAMPLES: Partial<Record<Language, string>> = {
  python: `import sqlite3

def get_user(username, password):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"
    cursor.execute(query)
    return cursor.fetchone()

def process_data(items):
    result = []
    for i in range(len(items)):
        x = items[i]
        if x != None:
            if x > 0:
                result.append(x * 2)
    return result

GLOBAL_CONFIG = {"debug": True, "secret_key": "abc123hardcoded"}`,

  javascript: `const express = require('express');
const app = express();
var db = require('./database');

app.get('/user', function(req, res) {
  var userId = req.query.id;
  db.query("SELECT * FROM users WHERE id = " + userId, function(err, results) {
    if (err) { console.log(err); res.send(err); }
    res.json(results);
  });
});

function checkAuth(user, pass) {
  if (user == 'admin' && pass == 'password123') return true;
  return false;
}

app.listen(3000);`,
};

export default function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  async function handleReview(): Promise<void> {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error((json as { error: string }).error ?? `HTTP ${res.status}`);
      setReview((json as { data: ReviewResult }).data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: '56px 1fr', height: '100vh' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 24px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
          Smart Code Reviewer
        </div>
        <span style={{
          fontSize: 11, background: 'var(--accent)', color: 'white',
          padding: '2px 8px', borderRadius: 20, fontWeight: 600,
        }}>AI-Powered</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setConfigOpen(true)}
          style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            color: 'var(--muted)', padding: '6px 14px', borderRadius: 6,
            cursor: 'pointer', fontSize: 13,
          }}
        >
          ⚙ Configure
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        <CodeEditor
          code={code}
          language={language}
          loading={loading}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          onReview={handleReview}
          onLoadSample={() => setCode(SAMPLES[language] ?? SAMPLES.python ?? '')}
        />
        <ReviewPanel review={review} loading={loading} error={error} code={code} language={language} />
      </div>

      {configOpen && <ConfigModal onClose={() => setConfigOpen(false)} />}
    </div>
  );
}
