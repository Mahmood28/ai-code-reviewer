import type { ReviewResult } from '../types.ts';
import ScoreBar from './ScoreBar.tsx';
import FindingCard from './FindingCard.tsx';
import ChatBox from './ChatBox.tsx';

interface Props {
  review: ReviewResult | null;
  loading: boolean;
  error: string | null;
  code: string;
  language: string;
}

export default function ReviewPanel({ review, loading, error, code, language }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Review Results
        </h3>
        {loading && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Running AI analysis…</span>}
        {review && !loading && <span style={{ fontSize: 12, color: 'var(--green)' }}>✓ Review complete</span>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {!review && !loading && !error && <EmptyState />}
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}

        {review && (
          <>
            <ScoreBar scores={review.scores} />

            <Section title="📋 Summary">
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderLeft: '3px solid var(--blue)', borderRadius: 8, padding: '12px 14px',
              }}>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{review.summary}</p>
              </div>
            </Section>

            <Section title="🎯 Top Priorities">
              {review.topPriorities.map((p, i) => (
                <div key={i} style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--yellow)', borderRadius: 8,
                  padding: '10px 14px', marginBottom: 8,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ color: 'var(--yellow)', fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{p}</p>
                </div>
              ))}
            </Section>

            <Section title={`🔍 Findings (${review.findings.length})`}>
              {review.findings.map((f) => <FindingCard key={f.id} finding={f} />)}
            </Section>
          </>
        )}
      </div>

      {review && <ChatBox code={code} language={language} summary={review.summary} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--muted)' }}>
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ opacity: .3 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p style={{ fontSize: 14 }}>Paste code and click <strong>Review Code</strong></p>
      <p style={{ fontSize: 12 }}>Checks bugs · security · readability · structure · maintainability</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 16, color: 'var(--muted)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <p style={{ fontSize: 14 }}>Analyzing code with LangChain + RAG…</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 8, padding: '14px 16px', color: 'var(--red)', fontSize: 13 }}>
      ⚠ {message}
    </div>
  );
}
