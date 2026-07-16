import { useStore } from '../store.jsx'
import { comics, comicById, runs } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { money } from '../components/atoms.jsx'
import { IconStar, IconLayers } from '../icons.jsx'

function RunTracker({ run }) {
  const { dispatch } = useStore()
  const nums = Array.from({ length: run.total }, (_, i) => run.series === 'Quantum Twins' ? i : i + 1)
  const ownedCount = run.owned.length
  const forSaleCount = Object.keys(run.forSale).length
  const pct = Math.round((ownedCount / run.total) * 100)

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: run.accent + '22', color: run.accent, display: 'grid', placeItems: 'center' }}><IconLayers size={17} /></div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{run.series}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{run.publisher} · {ownedCount}/{run.total} owned</div>
        </div>
        <span className="num" style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 800, color: run.accent }}>{pct}%</span>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: 'var(--neutral-100)', overflow: 'hidden', margin: '10px 0 14px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: run.accent, borderRadius: 999, transition: 'width .4s' }} />
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {nums.map(n => {
          const owned = run.owned.includes(n)
          const forSaleId = run.forSale[n]
          const state = owned ? 'owned' : forSaleId ? 'forsale' : 'missing'
          const styles = {
            owned: { background: run.accent, color: '#fff', boxShadow: 'none', cursor: 'default' },
            forsale: { background: '#fff', color: run.accent, boxShadow: `inset 0 0 0 2px ${run.accent}`, cursor: 'pointer' },
            missing: { background: 'var(--neutral-100)', color: 'var(--fg-placeholder)', boxShadow: 'none', cursor: 'default' },
          }[state]
          return (
            <button key={n} title={state === 'forsale' ? 'Available now — tap to view' : state === 'owned' ? 'In your collection' : 'Still needed'}
              onClick={() => forSaleId && dispatch({ type: 'OPEN_DETAIL', id: forSaleId })}
              className="num" style={{ width: 40, height: 40, borderRadius: 10, fontWeight: 700, fontSize: 14, display: 'grid', placeItems: 'center', position: 'relative', ...styles }}>
              #{n}
              {state === 'forsale' && <span style={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: 999, background: 'var(--success-500)', border: '2px solid #fff' }} />}
            </button>
          )
        })}
      </div>
      {forSaleCount > 0 && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 12 }}><span className="live-dot" style={{ background: 'var(--success-500)', marginRight: 6 }} />{forSaleCount} needed issue{forSaleCount > 1 ? 's' : ''} available now — tap to grab</div>}
    </div>
  )
}

export default function Watchlist() {
  const { state, dispatch } = useStore()
  const saved = comics.filter(c => state.saved[c.id])

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 className="h1">Your collection</h1>
      <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '0 0 24px' }}>Track saved comics for price alerts and complete the runs you're chasing.</p>

      {/* Complete the run (feature #3) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <IconLayers size={18} style={{ color: 'var(--primary-500)' }} />
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg-strong)' }}>Complete the run</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18, marginBottom: 34 }}>
        {runs.map(r => <RunTracker key={r.series} run={r} />)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <IconStar size={18} filled style={{ color: 'var(--warning-500)' }} />
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg-strong)' }}>Watchlist</span>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>· We'll alert you the moment a price drops.</span>
      </div>

      {saved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--primary-100)', color: 'var(--primary-500)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><IconStar size={30} /></div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>No watched issues yet</div>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '6px 0 18px' }}>Tap the star on any listing to track its price.</div>
          <button className="btn btn-primary" style={{ height: 44, padding: '0 22px' }} onClick={() => dispatch({ type: 'SCREEN', screen: 'browse' })}>Browse marketplace</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, maxWidth: 1000 }}>
          {saved.map(c => (
            <div key={c.id} className="card" style={{ padding: 14, cursor: 'pointer' }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: c.id })}>
              <ComicCover {...c} />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 10 }}>{c.title} #{c.issue}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span className="num" style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>{money(c.price)}</span>
                <button onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_SAVE', id: c.id }) }}
                  style={{ width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--warning-100)', color: 'var(--warning-500)' }}><IconStar size={17} filled /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
