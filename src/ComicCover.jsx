// Procedural CSS comic-cover art — faithful port of ComicCover.dc.html.
// Production note: swap this for a real 2:3 <img> cover scan.
export default function ComicCover({ title, issue, publisher, grade, bg, ink, accent, className = '', style }) {
  const pub = String(publisher || '').toUpperCase()
  const hasGrade = Boolean(grade)
  return (
    <div className={className} style={{
      position: 'relative', aspectRatio: '2 / 3', borderRadius: 8, overflow: 'hidden',
      background: bg, color: ink, display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: 12, fontFamily: 'var(--font-primary)',
      boxShadow: 'var(--shadow-md)', border: '1px solid rgba(0,0,0,0.18)',
      containerType: 'inline-size', userSelect: 'none', ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1.1px, transparent 1.3px)', backgroundSize: '7px 7px', opacity: 0.55, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: '-12%', right: '-12%', top: '43%', height: '15%', background: accent, transform: 'skewY(-7deg)', opacity: 0.92, boxShadow: '0 6px 14px rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(130% 90% at 50% 0%, transparent 52%, rgba(0,0,0,0.42))', pointerEvents: 'none' }} />
      {hasGrade && (
        <span style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: 'rgba(255,255,255,0.94)', color: '#172038', fontFamily: 'var(--font-numeric)', fontWeight: 700, fontSize: 10, padding: '3px 6px', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{grade}</span>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ display: 'inline-block', background: accent, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{pub}</span>
      </div>
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '13cqw', lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '-0.01em', textShadow: '0 2px 0 rgba(0,0,0,0.28)' }}>{title}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, fontSize: '8cqw', fontFamily: 'var(--font-numeric)', lineHeight: 1 }}>#{issue}</span>
        <span style={{ width: '11cqw', height: '11cqw', borderRadius: 999, border: `2.5px solid ${ink}`, opacity: 0.85 }} />
      </div>
    </div>
  )
}
