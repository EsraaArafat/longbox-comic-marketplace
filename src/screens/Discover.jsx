import { useStore } from '../store.jsx'
import { comics, sellers, REACTIONS } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { GradePill, HotPill, money } from '../components/atoms.jsx'
import { IconEye, IconBolt, IconStar } from '../icons.jsx'

const FILTERS = ['All', 'CGC Graded', 'Under $100', 'Keys', 'Near me', 'Just listed']

function applyFilter(list, f) {
  switch (f) {
    case 'CGC Graded': return list.filter(c => c.grade.startsWith('CGC'))
    case 'Under $100': return list.filter(c => c.price < 100)
    case 'Keys': return list.filter(c => /key|grail/i.test(c.hot) || /key/i.test(c.blurb))
    case 'Near me': return list.filter(c => parseFloat(sellers[c.seller].distance) <= 3.5)
    case 'Just listed': return list.filter(c => c.sold === 'Just listed' || c.hot === 'New')
    default: return list
  }
}

function Reactions({ comic, compact }) {
  const { state, dispatch } = useStore()
  const counts = state.reactions[comic.id] || {}
  const mine = state.myReaction[comic.id]
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
      {REACTIONS.map(emoji => {
        const n = counts[emoji] || 0
        const on = mine === emoji
        return (
          <button key={emoji} onClick={() => dispatch({ type: 'REACT', id: comic.id, emoji })}
            title="React" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: compact ? '3px 7px' : '4px 9px', borderRadius: 999,
              fontSize: 12, fontWeight: 600, transition: 'all .15s',
              background: on ? 'var(--primary-100)' : 'var(--neutral-50)',
              boxShadow: on ? 'inset 0 0 0 1.5px var(--primary-200)' : 'inset 0 0 0 1px var(--border-subtle)',
              color: 'var(--fg-default)' }}>
            <span style={{ fontSize: 13, filter: n || on ? 'none' : 'grayscale(0.4)' }}>{emoji}</span>
            {n > 0 && <span className="num">{n}</span>}
          </button>
        )
      })}
    </div>
  )
}

function ListingCard({ comic }) {
  const { state, dispatch } = useStore()
  const saved = !!state.saved[comic.id]
  const watch = state.watchCounts[comic.id]
  return (
    <div className="card" onClick={() => dispatch({ type: 'OPEN_DETAIL', id: comic.id })}
      style={{ padding: '14px 14px 16px', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s', display: 'flex', flexDirection: 'column', gap: 10 }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
      <ComicCover {...comic} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{comic.title} <span style={{ color: 'var(--fg-muted)', fontWeight: 600 }}>#{comic.issue}</span></div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{comic.publisher} · {comic.year}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <GradePill comic={comic} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--fg-muted)' }}><IconEye size={15} />{watch}</span>
      </div>
      <Reactions comic={comic} compact />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="num" style={{ fontSize: 19, fontWeight: 800, color: 'var(--fg-strong)' }}>{money(comic.price)}</span>
        <button onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_SAVE', id: comic.id }) }}
          title="Watch" style={{ width: 38, height: 38, borderRadius: 999, display: 'grid', placeItems: 'center',
            background: saved ? 'var(--warning-100)' : 'var(--neutral-50)', color: saved ? 'var(--warning-500)' : 'var(--fg-muted)', transition: 'all .15s' }}>
          <IconStar size={19} filled={saved} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button className="btn btn-primary" style={{ height: 38 }} onClick={e => { e.stopPropagation(); dispatch({ type: 'BUY', id: comic.id }) }}>Buy Now</button>
        <button className="btn btn-outline" style={{ height: 38 }} onClick={e => { e.stopPropagation(); dispatch({ type: 'START_CHAT', id: comic.id }) }}>Make Offer</button>
      </div>
    </div>
  )
}

function FeedRail() {
  const { state } = useStore()
  return (
    <div className="card" style={{ position: 'sticky', top: 90, padding: 18, alignSelf: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span className="live-dot" /><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-strong)' }}>Live activity</span>
      </div>
      <div style={{ maxHeight: 560, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.feed.map(item => (
          <div key={item.id} className="lb-in" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: item.dot, marginTop: 6, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.35 }}>
              <span dangerouslySetInnerHTML={{ __html: item.html }} />
              <div style={{ fontSize: 11, color: 'var(--fg-placeholder)', marginTop: 2 }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WideCard({ comic }) {
  const { dispatch } = useStore()
  const s = sellers[comic.seller]
  return (
    <div className="card" style={{ display: 'flex', gap: 22, padding: 20 }}>
      <div style={{ width: 150, flexShrink: 0, cursor: 'pointer' }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: comic.id })}><ComicCover {...comic} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><HotPill tag={comic.hot} /><GradePill comic={comic} /></div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.01em', cursor: 'pointer' }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: comic.id })}>{comic.title} #{comic.issue}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '2px 0 10px' }}>{comic.publisher} · {comic.year} · {s.name}</div>
        <div style={{ display: 'flex', gap: 18, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><IconEye size={15} />{comic.watch} watching</span>
          <span>{s.distance}</span>
          <span>★ {s.rating}</span>
        </div>
        <div style={{ marginBottom: 14 }}><Reactions comic={comic} /></div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="num" style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', marginRight: 'auto' }}>{money(comic.price)}</span>
          <button className="btn btn-outline" style={{ height: 40, padding: '0 18px' }} onClick={() => dispatch({ type: 'START_CHAT', id: comic.id })}>Make Offer</button>
          <button className="btn btn-primary" style={{ height: 40, padding: '0 18px' }} onClick={() => dispatch({ type: 'BUY', id: comic.id })}><IconBolt size={17} filled />Buy Now · 1-Tap</button>
        </div>
      </div>
    </div>
  )
}

export default function Discover() {
  const { state, dispatch } = useStore()
  const list = applyFilter(comics, state.filter)
  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', marginBottom: 22 }}>
        <div>
          <div className="eyebrow">Marketplace</div>
          <h1 className="h1">Discover great comics</h1>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Buy from verified collectors near you. 214 new listings today.</div>
        </div>
        <div style={{ display: 'inline-flex', background: 'var(--neutral-100)', border: '1px solid var(--border-subtle)', borderRadius: 999, padding: 4, gap: 4 }}>
          {[['market', 'Marketplace'], ['feed', 'Discovery Feed']].map(([v, label]) => (
            <button key={v} onClick={() => dispatch({ type: 'VARIANT', variant: v })}
              style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                background: state.variant === v ? '#fff' : 'transparent', color: state.variant === v ? 'var(--primary-600)' : 'var(--fg-muted)',
                boxShadow: state.variant === v ? 'var(--shadow-xs)' : 'none' }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 24 }}>
        {FILTERS.map(f => {
          const on = state.filter === f
          return (
            <button key={f} onClick={() => dispatch({ type: 'FILTER', filter: f })}
              style={{ padding: '8px 15px', borderRadius: 999, fontSize: 13, fontWeight: 600, transition: 'all .15s',
                background: on ? 'var(--primary-500)' : '#fff', color: on ? '#fff' : 'var(--fg-default)',
                boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--border-subtle)' }}>{f}</button>
          )
        })}
      </div>

      {state.variant === 'market' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 316px', gap: 28, alignItems: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 20 }}>
            {list.map(c => <ListingCard key={c.id} comic={c} />)}
          </div>
          <FeedRail />
        </div>
      ) : (
        <div style={{ maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {list.map(c => <WideCard key={c.id} comic={c} />)}
        </div>
      )}
    </div>
  )
}
