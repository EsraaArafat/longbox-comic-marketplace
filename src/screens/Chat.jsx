import { useEffect, useRef } from 'react'
import { useStore } from '../store.jsx'
import { comicById, sellers } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { Avatar, money } from '../components/atoms.jsx'
import { IconBack, IconSend, IconChat } from '../icons.jsx'

function OfferBubble({ m, isLatestSellerAction }) {
  const { state, dispatch } = useStore()
  const mine = m.from === 'you'
  const comic = comicById[state.chatComicId]
  const tag = m.kind === 'counter' ? 'Counter offer' : mine ? 'Your offer' : 'Offer'
  return (
    <div style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
      <div style={{ background: mine ? 'var(--primary-500)' : '#fff', color: mine ? '#fff' : 'var(--fg-strong)',
        border: mine ? 'none' : '1px solid var(--border-subtle)', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '12px 16px', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>{tag}</div>
        <div className="num" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>{money(m.amount)}</div>
        {m.text && <div style={{ fontSize: 13, marginTop: 2, opacity: mine ? .95 : 1, color: mine ? '#fff' : 'var(--fg-default)' }}>{m.text}</div>}
      </div>
      {!mine && isLatestSellerAction && (m.kind === 'accept' || m.kind === 'counter') && (
        <button className="btn btn-success" style={{ width: '100%', height: 42, marginTop: 8 }} onClick={() => dispatch({ type: 'BUY', id: comic.id, price: m.amount })}>
          Accept {money(m.amount)} & Checkout
        </button>
      )}
    </div>
  )
}

function TextBubble({ m }) {
  const mine = m.from === 'you'
  return (
    <div style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%',
      background: mine ? 'var(--primary-500)' : '#fff', color: mine ? '#fff' : 'var(--fg-default)',
      border: mine ? 'none' : '1px solid var(--border-subtle)', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14, boxShadow: 'var(--shadow-xs)' }}>
      {m.text}
    </div>
  )
}

function EmptyState() {
  const { dispatch } = useStore()
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center', padding: 40 }}>
      <div>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--primary-100)', color: 'var(--primary-500)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}><IconChat size={30} /></div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>No conversations yet</div>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '6px 0 18px' }}>Start negotiating by making an offer on any listing.</div>
        <button className="btn btn-primary" style={{ height: 44, padding: '0 22px' }} onClick={() => dispatch({ type: 'SCREEN', screen: 'browse' })}>Browse marketplace</button>
      </div>
    </div>
  )
}

export default function Chat() {
  const { state, dispatch, scheduleSellerReply } = useStore()
  const scrollRef = useRef(null)
  const comic = comicById[state.chatComicId]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [state.thread, state.sellerTyping])

  if (!comic) return <EmptyState />
  const s = sellers[comic.seller]

  const lastSellerActionId = [...state.thread].reverse().find(m => m.from === 'seller' && (m.kind === 'accept' || m.kind === 'counter'))?.id

  const send = () => {
    const amt = parseInt(String(state.draft).replace(/[^0-9]/g, ''), 10)
    if (!amt) return
    dispatch({ type: 'SEND_OFFER', amount: amt })
    scheduleSellerReply(amt)
  }

  const chips = [['List', comic.price], ['−10%', Math.round(comic.price * 0.9)], ['−20%', Math.round(comic.price * 0.8)]]

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', margin: 24, flex: 1, overflow: 'hidden' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <button className="btn btn-ghost" style={{ width: 34, height: 34, padding: 0 }} onClick={() => dispatch({ type: 'OPEN_DETAIL', id: comic.id })}><IconBack size={18} /></button>
          <Avatar seller={s} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
            <div style={{ fontSize: 12, color: 'var(--success-500)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><span className="live-dot" /> Usually replies in minutes</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--neutral-50)', border: '1px solid var(--border-subtle)', borderRadius: 999, padding: '5px 12px 5px 6px' }}>
            <div style={{ width: 22 }}><ComicCover {...comic} /></div>
            <div style={{ fontSize: 12 }}><div style={{ fontWeight: 600, color: 'var(--fg-strong)' }}>{comic.title} #{comic.issue}</div><span className="num" style={{ color: 'var(--fg-muted)' }}>{money(comic.price)}</span></div>
          </div>
        </div>

        {/* thread */}
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', background: 'var(--neutral-50)', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ alignSelf: 'center', fontSize: 11, fontWeight: 600, color: 'var(--fg-placeholder)', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 999, padding: '3px 12px' }}>Today</div>
          {state.thread.map(m => m.kind === 'text'
            ? <TextBubble key={m.id} m={m} />
            : <OfferBubble key={m.id} m={m} isLatestSellerAction={m.id === lastSellerActionId} />)}
          {state.sellerTyping && (
            <div style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', fontSize: 13, color: 'var(--fg-muted)' }}>
              {s.name.split(' ')[0]} is typing…
            </div>
          )}
        </div>

        {/* composer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {chips.map(([label, val]) => (
              <button key={label} onClick={() => dispatch({ type: 'DRAFT', value: String(val) })}
                style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'var(--neutral-50)', color: 'var(--fg-default)', boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }}>
                {label} {money(val)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: 'var(--neutral-50)', borderRadius: 999, height: 46, padding: '0 18px', boxShadow: 'inset 0 0 0 1px var(--border-subtle)' }}>
              <span className="num" style={{ fontWeight: 700, color: 'var(--fg-muted)' }}>$</span>
              <input className="num" value={state.draft} onChange={e => dispatch({ type: 'DRAFT', value: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder="Enter your offer"
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }} />
            </div>
            <button className="btn btn-primary" style={{ height: 46, padding: '0 22px' }} onClick={send}><IconSend size={18} /> Send Offer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
