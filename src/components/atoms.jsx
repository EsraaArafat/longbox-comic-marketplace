import { toneFor, avatarStyle, initials } from '../data.js'

export function GradePill({ comic }) {
  if (comic.grade) {
    return <span className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-600)', background: 'var(--primary-100)', padding: '3px 9px', borderRadius: 999 }}>{comic.grade}</span>
  }
  return <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', background: 'var(--neutral-100)', padding: '3px 9px', borderRadius: 999 }}>Raw · {comic.condition}</span>
}

export function HotPill({ tag }) {
  const [bg, fg] = toneFor(tag)
  return <span style={{ fontSize: 11, fontWeight: 700, color: fg, background: bg, padding: '3px 9px', borderRadius: 999, letterSpacing: '.02em' }}>{tag}</span>
}

export function Avatar({ seller, size = 38 }) {
  return <div style={avatarStyle(seller.hue, size)}>{initials(seller.name)}</div>
}

// Tiny price-history sparkline (feature #2 signal, reused in detail + auctions)
export function Sparkline({ data, w = 120, h = 34, color = 'var(--primary-500)' }) {
  const min = Math.min(...data), max = Math.max(...data)
  const span = max - min || 1
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => [i * step, h - ((v - min) / span) * (h - 6) - 3])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${d} L${w} ${h} L0 ${h} Z`
  const up = data[data.length - 1] >= data[0]
  const c = up ? 'var(--success-500)' : 'var(--danger-500)'
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <path d={area} fill={c} opacity="0.10" />
      <path d={d} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={c} />
    </svg>
  )
}

export function money(n) { return '$' + Number(n).toLocaleString('en-US') }
