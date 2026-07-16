import { useStore } from '../store.jsx'
import ComicCover from '../ComicCover.jsx'
import { money } from '../components/atoms.jsx'
import { IconBack, IconBolt, IconCheck, IconShield } from '../icons.jsx'

export default function Checkout() {
  const { state, dispatch } = useStore()
  const o = state.order
  if (!o) return null
  const total = +(o.price + o.ship + o.fee).toFixed(2)

  if (state.celebrate) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '80vh', padding: 24 }}>
        <div className="card lb-pop" style={{ maxWidth: 520, width: '100%', padding: 36, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--success-100)', color: 'var(--success-500)', display: 'grid', placeItems: 'center', margin: '0 auto 18px', animation: 'lbSpinPop .5s ease both' }}><IconCheck size={34} /></div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)' }}>Order confirmed</div>
          <div style={{ fontSize: 15, color: 'var(--fg-default)', margin: '8px 0 4px' }}>Your copy of <b>{o.title} #{o.issue}</b> is on the way.</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24 }}>{o.sellerName} has been notified · Est. delivery in 3–5 days</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline" style={{ height: 46, padding: '0 22px' }} onClick={() => dispatch({ type: 'SCREEN', screen: 'browse' })}>Keep Browsing</button>
            <button className="btn btn-primary" style={{ height: 46, padding: '0 22px' }} onClick={() => dispatch({ type: 'SCREEN', screen: 'watchlist' })}>View Collection</button>
          </div>
        </div>
      </div>
    )
  }

  const Row = ({ label, value, strong }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: strong ? 16 : 14, fontWeight: strong ? 800 : 500, color: strong ? 'var(--fg-strong)' : 'var(--fg-default)' }}>
      <span>{label}</span><span className="num">{value}</span>
    </div>
  )

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '80vh', padding: 24 }}>
      <div className="card" style={{ maxWidth: 520, width: '100%', padding: 28 }}>
        <button className="btn btn-ghost" style={{ height: 32, padding: '0 10px', marginBottom: 8, fontSize: 13 }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: o.comicId })}><IconBack size={16} /> Back</button>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 18 }}>Confirm your order</div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 14, background: 'var(--neutral-50)', borderRadius: 12, marginBottom: 18 }}>
          <div style={{ width: 54 }}><ComicCover title={o.title} issue={o.issue} publisher={o.publisher} grade={o.grade} bg={o.bg} ink={o.ink} accent={o.accent} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{o.title} #{o.issue}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{o.publisher} · {o.condition}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Sold by {o.sellerName}</div>
          </div>
          <span className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{money(o.price)}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 14 }}>
          <Row label="Item" value={money(o.price)} />
          <Row label="Insured shipping" value={money(o.ship)} />
          <Row label="Buyer protection (3%)" value={money(o.fee)} />
          <div style={{ borderTop: '1px dashed var(--border-default)', margin: '4px 0' }} />
          <Row label="Total" value={money(total)} strong />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--primary-100)', border: '1px solid var(--primary-200)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
          <IconBolt size={18} filled style={{ color: 'var(--primary-600)' }} />
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>1-Tap Pay · Visa ···· 4218</div>
          <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--success-500)', color: '#fff', display: 'grid', placeItems: 'center' }}><IconCheck size={14} /></span>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', height: 52, fontSize: 15 }} onClick={() => dispatch({ type: 'CONFIRM' })}><IconBolt size={19} filled /> Place Order · {money(total)}</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--fg-muted)', marginTop: 12 }}><IconShield size={15} /> Protected by Longbox Buyer Guarantee</div>
      </div>
    </div>
  )
}
