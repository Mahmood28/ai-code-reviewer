import type { ReviewScores } from '../types.ts';

interface Props {
  scores: ReviewScores;
}

export default function ScoreBar({ scores }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
      {(Object.entries(scores) as [string, number][]).map(([key, val]) => (
        <div key={key} style={{
          flex: 1, minWidth: 90,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '10px 12px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
            {key}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor(val) }}>
            {val}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)' }}>/10</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function scoreColor(v: number): string {
  if (v >= 8) return 'var(--green)';
  if (v >= 5) return 'var(--yellow)';
  return 'var(--red)';
}
