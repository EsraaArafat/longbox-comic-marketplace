import { useStore } from '../store.jsx'
import { comics, comicById, sellers } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { Avatar, money } from '../components/atoms.jsx'
import { IconBolt } from '../icons.jsx'

function Pin({ comic, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ position: 'absolute', left: `${comic.mapX}%`, top: `${comic.mapY}%`, transform: 'translate(-50%,-100%)', zIndex: selected ? 5 : 1, transition: 'transform .15s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%,-100%) scale(1.15)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%,-100%)'}>
      <div className="num" style={{ background: selected ? 'var(--primary-500)' : '#fff', color: selected ? '#fff' : 'var(--fg-strong)', fontWeight: 800, fontSize: 13, padding: '5px 11px', borderRadius: 999, boxShadow: 'var(--shadow-md)', border: '1px solid ' + (selected ? 'var(--primary-500)' : 'var(--border-subtle)'), whiteSpace: 'nowrap' }}>{money(comic.price)}</div>
      <div style={{ width: 8, height: 8, borderRadius: 999, background: selected ? 'var(--primary-500)' : 'var(--fg-strong)', margin: '2px auto 0' }} />
    </button>
  )
}

export default function MapNear() {
  const { state, dispatch } = useStore()
  const sel = state.mapSelId ? comicById[state.mapSelId] : null
  const s = sel ? sellers[sel.seller] : null

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 className="h1">Comics near you</h1>
      <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '0 0 22px' }}>Meet local sellers and skip the shipping wait. Showing sellers within 8 miles of NYC.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ position: 'relative', height: 560, borderRadius: 16, overflow: 'hidden', background: '#DCE7EE', border: '1px solid var(--border-subtle)',
          backgroundImage: 'linear-gradient(var(--baby-blue-200) 1px, transparent 1px), linear-gradient(90deg, var(--baby-blue-200) 1px, transparent 1px)', backgroundSize: '46px 46px' }}>
          {/* streets & blocks */}
          <div style={{ position: 'absolute', left: '-10%', right: '-10%', top: '30%', height: 26, background: '#EEF4F8', transform: 'rotate(-8deg)' }} />
          <div style={{ position: 'absolute', left: '-10%', right: '-10%', top: '62%', height: 22, background: '#EEF4F8', transform: 'rotate(6deg)' }} />
          <div style={{ position: 'absolute', left: '18%', width: 90, height: 70, top: '44%', background: 'var(--baby-blue-300)', opacity: .5, borderRadius: 6 }} />
          <div style={{ position: 'absolute', left: '58%', width: 120, height: 90, top: '20%', background: 'var(--baby-blue-300)', opacity: .5, borderRadius: 6 }} />
          {/* you are here */}
          <div style={{ position: 'absolute', left: '48%', top: '50%', transform: 'translate(-50%,-50%)' }}>
            <div style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--primary-500)', border: '4px solid #fff', boxShadow: '0 0 0 6px rgba(7,102,152,0.18)' }} />
          </div>
          {comics.map(c => <Pin key={c.id} comic={c} selected={state.mapSelId === c.id} onClick={() => dispatch({ type: 'OPEN_MAP_PIN', id: c.id })} />)}
        </div>

        <div style={{ position: 'sticky', top: 90 }}>
          {sel ? (
            <div className="card lb-in" style={{ padding: 18 }}>
              <div style={{ width: '55%', margin: '0 auto 14px', cursor: 'pointer' }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: sel.id })}><ComicCover {...sel} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }}>{sel.title} #{sel.issue}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 12 }}>{sel.publisher} · {sel.year}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 14 }}>
                <Avatar seller={s} size={34} />
                <div style={{ fontSize: 13 }}><div style={{ fontWeight: 600, color: 'var(--fg-strong)' }}>{s.name}</div><span style={{ color: 'var(--fg-muted)' }}>★ {s.rating} · {s.distance}</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>{money(sel.price)}</span>
                <button className="btn btn-primary" style={{ height: 42, padding: '0 18px' }} onClick={() => dispatch({ type: 'BUY', id: sel.id })}><IconBolt size={16} filled /> Buy Now</button>
              </div>
            </div>
          ) : (
            <div style={{ border: '2px dashed var(--border-default)', borderRadius: 16, padding: '48px 20px', textAlign: 'center', color: 'var(--fg-muted)' }}>
              <div style={{ fontWeight: 700, color: 'var(--fg-default)', marginBottom: 4 }}>Pick a pin</div>
              <div style={{ fontSize: 13 }}>Tap a price tag on the map to see the listing.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
