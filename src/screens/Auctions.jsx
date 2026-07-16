import { useState } from 'react'
import { useStore } from '../store.jsx'
import { comicById, sellers } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { GradePill, Avatar, money } from '../components/atoms.jsx'
import { IconGavel, IconClock, IconBolt } from '../icons.jsx'

function fmtTime(s) {
  if (s <= 0) return 'Ended'
  const m = Math.floor(s / 60), sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function AuctionCard({ auction }) {
  const { state, dispatch } = useStore()
  const c = comicById[auction.comicId]
  const s = sellers[c.seller]
  const [amt, setAmt] = useState('')
  const min = auction.currentBid + 5
  const ended = auction.endsInSec <= 0
  const iAmTop = auction.history[0]?.who === 'you'
  const urgent = auction.endsInSec > 0 && auction.endsInSec <= 60

  const placeBid = () => {
    const v = parseInt(String(amt).replace(/[^0-9]/g, ''), 10)
    if (!v || v < min) return
    dispatch({ type: 'AUC_MY_BID', id: auction.id, amt: v })
    dispatch({ type: 'TOAST', toast: { kind: 'match', title: "You're the top bidder", body: `${money(v)} on ${c.title} #${c.issue}`, comicId: c.id } })
    setAmt('')
  }

  return (
    <div className="card" style={{ padding: 18, display: 'flex', gap: 18 }}>
      <div style={{ width: 130, flexShrink: 0, cursor: 'pointer' }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: c.id })}><ComicCover {...c} /></div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{c.title} #{c.issue}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{c.publisher} · {c.year}</div>
          </div>
          <GradePill comic={c} />
        </div>

        {/* countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0',
          background: urgent ? 'var(--danger-100)' : 'var(--neutral-50)', color: urgent ? 'var(--danger-500)' : 'var(--fg-default)',
          border: '1px solid ' + (urgent ? 'transparent' : 'var(--border-subtle)'), borderRadius: 10, padding: '8px 12px', width: 'fit-content' }}>
          <IconClock size={16} />
          <span className="num" style={{ fontWeight: 800, fontSize: 15 }}>{fmtTime(auction.endsInSec)}</span>
          <span style={{ fontSize: 12 }}>{ended ? '' : urgent ? 'ending soon!' : 'left'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Current bid</span>
          <span className="num" style={{ fontSize: 26, fontWeight: 800, color: 'var(--fg-strong)' }}>{money(auction.currentBid)}</span>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 'auto' }}>{auction.bidders} bidders</span>
        </div>
        {iAmTop && !ended && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success-500)', marginBottom: 6 }}>✓ You're the top bidder</div>}

        {/* bid ladder */}
        <div style={{ background: 'var(--neutral-50)', borderRadius: 10, padding: '8px 12px', margin: '6px 0 12px', maxHeight: 96, overflow: 'auto' }}>
          {auction.history.map((b, i) => (
            <div key={i} className={i === 0 ? 'lb-in' : ''} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', color: b.who === 'you' ? 'var(--primary-600)' : 'var(--fg-default)', fontWeight: b.who === 'you' ? 700 : 500 }}>
              <span>{b.who === 'you' ? 'You' : '@' + b.who}</span>
              <span className="num">{money(b.amt)}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
          <Avatar seller={s} size={30} />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginRight: 'auto' }}>{s.name} · ★ {s.rating}</span>
          {!ended ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--neutral-50)', borderRadius: 999, height: 40, padding: '0 14px', boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }}>
                <span className="num" style={{ fontWeight: 700, color: 'var(--fg-muted)' }}>$</span>
                <input className="num" value={amt} onChange={e => setAmt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') placeBid() }}
                  placeholder={`${min}+`} style={{ border: 'none', background: 'transparent', outline: 'none', width: 68, fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} />
              </div>
              <button className="btn btn-primary" style={{ height: 40, padding: '0 18px' }} onClick={placeBid}><IconGavel size={16} /> Bid</button>
            </>
          ) : (
            <button className="btn btn-outline" style={{ height: 40, padding: '0 18px' }} disabled>Auction ended</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Auctions() {
  const { state } = useStore()
  const live = state.auctions.filter(a => a.endsInSec > 0).length
  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <div className="eyebrow">Live now</div>
      <h1 className="h1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>Auctions <span className="live-dot" style={{ width: 12, height: 12 }} /></h1>
      <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '0 0 24px' }}>{live} live auction{live !== 1 ? 's' : ''} · bids update in real time. Outbid alerts land in your notifications.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 20, maxWidth: 1000 }}>
        {state.auctions.map(a => <AuctionCard key={a.id} auction={a} />)}
      </div>
    </div>
  )
}
