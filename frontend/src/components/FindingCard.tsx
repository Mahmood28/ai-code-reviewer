import type { Finding, Severity } from '../types.ts';

interface Props {
  finding: Finding;
}

const CAT_ICONS: Record<string, string> = {
  security: '🔒', bug: '🐛', readability: '📖',
  structure: '🏗', maintainability: '🔧', performance: '⚡', convention: '📐',
};

const SEVERITY_COLORS: Record<Severity, { border: string; bg: string; text: string }> = {
  critical: { border: 'var(--red)',    bg: 'rgba(248,113,113,.15)', text: 'var(--red)' },
  warning:  { border: 'var(--yellow)', bg: 'rgba(251,191,36,.15)',  text: 'var(--yellow)' },
  info:     { border: 'var(--blue)',   bg: 'rgba(96,165,250,.15)',  text: 'var(--blue)' },
  good:     { border: 'var(--green)',  bg: 'rgba(52,211,153,.15)',  text: 'var(--green)' },
};

export default function FindingCard({ finding }: Props) {
  const { category, severity, title, description, snippet, fix } = finding;
  const colors = SEVERITY_COLORS[severity] ?? SEVERITY_COLORS.info;

  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderLeft: `3px solid ${colors.border}`, borderRadius: 8,
      padding: '12px 14px', marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
          textTransform: 'uppercase', background: colors.bg, color: colors.text,
        }}>
          {severity}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          {CAT_ICONS[category] ?? '•'} {category}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{description}</p>

      {snippet && (
        <pre style={{
          background: 'var(--bg)', borderRadius: 5, padding: '8px 10px',
          fontFamily: 'monospace', fontSize: 12, color: 'var(--accent2)',
          marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {snippet}
        </pre>
      )}

      {fix && (
        <p style={{ fontSize: 12, color: 'var(--accent2)', marginTop: 6 }}>💡 {fix}</p>
      )}
    </div>
  );
}
