import { useStore } from '../store.jsx'
import { comicById, sellers, REACTIONS } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { GradePill, HotPill, Avatar, Sparkline, money } from '../components/atoms.jsx'
import { IconBack, IconBolt, IconStar, IconCheck, IconChat, IconTrend } from '../icons.jsx'

export default function Detail() {
  const { state, dispatch } = useStore()
  const comic = comicById[state.selectedId]
  if (!comic) return null
  const s = sellers[comic.seller]
  const saved = !!state.saved[comic.id]
  const watch = state.watchCounts[comic.id]
  const counts = state.reactions[comic.id] || {}
  const mine = state.myReaction[comic.id]

  const h = comic.history
  const change = h[h.length - 1] - h[0]
  const pct = ((change / h[0]) * 100).toFixed(1)
  const up = change >= 0

  return (
    <div style={{ padding: '24px 32px 48px' }}>
      <button className="btn btn-ghost" style={{ height: 34, padding: '0 12px', marginBottom: 16, fontSize: 14 }} onClick={() => dispatch({ type: 'SCREEN', screen: 'browse' })}>
        <IconBack size={18} /> Back to Discover
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 44, maxWidth: 1080 }}>
        <div style={{ position: 'sticky', top: 90, alignSelf: 'start' }}>
          <div className="lb-pop" style={{ width: 340 }}><ComicCover {...comic} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 13, color: 'var(--fg-muted)' }}>
            <IconCheck size={16} style={{ color: 'var(--success-500)' }} /> Verified grade · Ships insured
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><GradePill comic={comic} /><HotPill tag={comic.hot} /></div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--fg-strong)', margin: 0 }}>{comic.title} <span style={{ color: 'var(--fg-muted)' }}>#{comic.issue}</span></h1>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '6px 0 18px' }}>{comic.publisher} · {comic.year} · First appearance key issue</div>

          <div style={{ display: 'flex', gap: 28, padding: '14px 18px', border: '1px solid var(--border-subtle)', borderRadius: 12, marginBottom: 18 }}>
            <div><span className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{watch}</span> <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>collectors watching</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span className="live-dot" /><span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{comic.sold}</span></div>
          </div>

          {/* Price history (interactive feature #2) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid var(--border-subtle)', borderRadius: 12, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}><IconTrend size={15} /> Price history</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span className="num" style={{ fontSize: 16, fontWeight: 800, color: up ? 'var(--success-500)' : 'var(--danger-500)' }}>{up ? '▲' : '▼'} {up ? '+' : ''}{pct}%</span>
                <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>last 6 comps</span>
              </div>
            </div>
            <Sparkline data={h} w={150} h={40} />
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--fg-default)', margin: '0 0 20px' }}>{comic.blurb}</p>

          {/* reactions */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {REACTIONS.map(emoji => {
              const n = counts[emoji] || 0; const on = mine === emoji
              return (
                <button key={emoji} onClick={() => dispatch({ type: 'REACT', id: comic.id, emoji })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, fontSize: 14, fontWeight: 600,
                    background: on ? 'var(--primary-100)' : 'var(--neutral-50)', boxShadow: on ? 'inset 0 0 0 1.5px var(--primary-200)' : 'inset 0 0 0 1px var(--border-subtle)', color: 'var(--fg-default)' }}>
                  <span>{emoji}</span>{n > 0 && <span className="num">{n}</span>}
                </button>
              )
            })}
          </div>

          <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <Avatar seller={s} size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>★ {s.rating} · {s.location} · {s.distance}</div>
            </div>
            <button className="btn btn-outline" style={{ height: 40, padding: '0 18px' }} onClick={() => dispatch({ type: 'START_CHAT', id: comic.id })}><IconChat size={17} /> Message</button>
          </div>

          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>List price</div>
          <div className="num" style={{ fontSize: 34, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 16 }}>{money(comic.price)}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn-primary" style={{ height: 52, padding: '0 26px', fontSize: 15 }} onClick={() => dispatch({ type: 'BUY', id: comic.id })}><IconBolt size={19} filled /> Buy Now · 1-Tap</button>
            <button className="btn btn-outline" style={{ height: 52, padding: '0 26px', fontSize: 15 }} onClick={() => dispatch({ type: 'START_CHAT', id: comic.id })}>Make an Offer</button>
            <button onClick={() => dispatch({ type: 'TOGGLE_SAVE', id: comic.id })} title="Watch"
              style={{ width: 52, height: 52, borderRadius: 999, display: 'grid', placeItems: 'center', background: saved ? 'var(--warning-100)' : 'var(--neutral-50)', color: saved ? 'var(--warning-500)' : 'var(--fg-muted)', boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }}>
              <IconStar size={22} filled={saved} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
