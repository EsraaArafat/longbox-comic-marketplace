import { createContext, useContext, useEffect, useReducer, useRef, useCallback } from 'react'
import { comics, comicById, sellers, auctionsSeed, REACTIONS } from './data.js'

const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

const LS = { screen: 'lb_screen', variant: 'lb_variant', saved: 'lb_saved' }
const load = (k, fb) => { try { const v = localStorage.getItem(k); return v == null ? fb : JSON.parse(v) } catch { return fb } }

const TABS = ['browse', 'auctions', 'map', 'chat', 'watchlist']

// transient screens always reset to browse on reload; a #hash deep-link wins
const bootScreen = () => {
  const hash = (typeof location !== 'undefined' ? location.hash.slice(1) : '')
  if (TABS.includes(hash)) return hash
  const s = load(LS.screen, 'browse')
  return ['detail', 'chat', 'checkout'].includes(s) ? 'browse' : s
}

const initialState = {
  screen: bootScreen(),
  variant: load(LS.variant, 'market'),
  selectedId: null,
  chatComicId: null,
  mapSelId: null,
  saved: load(LS.saved, {}),
  watchCounts: Object.fromEntries(comics.map(c => [c.id, c.watch])),
  reactions: {},        // { comicId: { '🔥': n, ... } }
  myReaction: {},       // { comicId: emoji }
  feed: [],
  thread: [],
  draft: '',
  sellerTyping: false,
  order: null,
  celebrate: false,
  auctions: auctionsSeed.map(a => ({ ...a, history: [...a.history] })),
  myBids: {},           // { auctionId: amount }
  toasts: [],
  filter: 'All',
}

let uid = 1
const nextId = () => `id${uid++}`

function reducer(state, a) {
  switch (a.type) {
    case 'SCREEN': return { ...state, screen: a.screen }
    case 'VARIANT': return { ...state, variant: a.variant }
    case 'FILTER': return { ...state, filter: a.filter }
    case 'OPEN_DETAIL': return { ...state, screen: 'detail', selectedId: a.id }
    case 'OPEN_MAP_PIN': return { ...state, mapSelId: a.id }

    case 'TOGGLE_SAVE': {
      const saved = { ...state.saved }
      const wc = { ...state.watchCounts }
      if (saved[a.id]) { delete saved[a.id]; wc[a.id] = Math.max(0, wc[a.id] - 1) }
      else { saved[a.id] = true; wc[a.id] = wc[a.id] + 1 }
      return { ...state, saved, watchCounts: wc }
    }

    case 'REACT': {
      const cur = state.myReaction[a.id]
      const counts = { ...(state.reactions[a.id] || {}) }
      if (cur === a.emoji) { counts[a.emoji] = Math.max(0, (counts[a.emoji] || 1) - 1) }
      else {
        if (cur) counts[cur] = Math.max(0, (counts[cur] || 1) - 1)
        counts[a.emoji] = (counts[a.emoji] || 0) + 1
      }
      return {
        ...state,
        reactions: { ...state.reactions, [a.id]: counts },
        myReaction: { ...state.myReaction, [a.id]: cur === a.emoji ? null : a.emoji },
      }
    }

    // ----- chat / negotiation -----
    case 'START_CHAT': {
      const c = comicById[a.id]
      const s = sellers[c.seller]
      return {
        ...state, screen: 'chat', chatComicId: a.id, draft: '', sellerTyping: false,
        thread: [{ id: nextId(), from: 'seller', kind: 'text', text: `Hey! Thanks for the interest in ${c.title} #${c.issue}. It's listed at $${c.price} — happy to hear an offer.` }],
      }
    }
    case 'DRAFT': return { ...state, draft: a.value }
    case 'SEND_OFFER': {
      const amount = a.amount
      return {
        ...state, draft: '', sellerTyping: true,
        thread: [...state.thread, { id: nextId(), from: 'you', kind: 'offer', amount }],
      }
    }
    case 'SELLER_REPLY': {
      return { ...state, sellerTyping: false, thread: [...state.thread, a.msg] }
    }
    case 'SEND_TEXT':
      return { ...state, draft: '', thread: [...state.thread, { id: nextId(), from: 'you', kind: 'text', text: a.text }] }

    // ----- checkout -----
    case 'BUY': {
      const c = comicById[a.id]
      const s = sellers[c.seller]
      const price = a.price ?? c.price
      return {
        ...state, screen: 'checkout', celebrate: false,
        order: { id: nextId(), comicId: c.id, title: c.title, issue: c.issue, publisher: c.publisher, condition: c.condition, grade: c.grade, bg: c.bg, ink: c.ink, accent: c.accent, sellerName: s.name, price, ship: 5.99, fee: +(price * 0.03).toFixed(2) },
      }
    }
    case 'CONFIRM': return { ...state, celebrate: true }

    // ----- live feed -----
    case 'FEED_PUSH': return { ...state, feed: [a.item, ...state.feed].slice(0, 8) }

    // ----- auctions -----
    case 'AUC_TICK':
      return { ...state, auctions: state.auctions.map(x => x.endsInSec > 0 ? { ...x, endsInSec: x.endsInSec - 1 } : x) }
    case 'AUC_RIVAL_BID': {
      return {
        ...state,
        auctions: state.auctions.map(x => x.id === a.id
          ? { ...x, currentBid: a.amt, bidders: x.bidders + (a.newBidder ? 1 : 0), history: [{ who: a.who, amt: a.amt }, ...x.history].slice(0, 8) }
          : x),
      }
    }
    case 'AUC_MY_BID': {
      return {
        ...state,
        myBids: { ...state.myBids, [a.id]: a.amt },
        auctions: state.auctions.map(x => x.id === a.id
          ? { ...x, currentBid: a.amt, history: [{ who: 'you', amt: a.amt }, ...x.history].slice(0, 8) }
          : x),
      }
    }

    // ----- toasts -----
    case 'TOAST': return { ...state, toasts: [{ ...a.toast, id: nextId() }, ...state.toasts].slice(0, 4) }
    case 'TOAST_DISMISS': return { ...state, toasts: state.toasts.filter(t => t.id !== a.id) }
    default: return state
  }
}

const catDot = { buy: 'var(--success-500)', watch: 'var(--warning-500)', list: 'var(--primary-500)', offer: 'var(--purple)', review: 'var(--baby-blue-300)' }

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const ref = useRef(state); ref.current = state

  // persist + reflect top-level screen in the URL hash for deep-linking
  useEffect(() => {
    try { localStorage.setItem(LS.screen, JSON.stringify(state.screen)) } catch {}
    if (TABS.includes(state.screen) && location.hash.slice(1) !== state.screen) {
      history.replaceState(null, '', state.screen === 'browse' ? '#' : '#' + state.screen)
    }
  }, [state.screen])
  useEffect(() => {
    const onHash = () => { const h = location.hash.slice(1); if (TABS.includes(h) && h !== ref.current.screen) dispatch({ type: 'SCREEN', screen: h }) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => { try { localStorage.setItem(LS.variant, JSON.stringify(state.variant)) } catch {} }, [state.variant])
  useEffect(() => { try { localStorage.setItem(LS.saved, JSON.stringify(state.saved)) } catch {} }, [state.saved])

  // ---- live activity feed (every 4200ms) ----
  useEffect(() => {
    const names = ['Marcus', 'Dana', 'Priya', 'Leo', 'Sam', 'Ava', 'Chris', 'Noah', 'Mia']
    const pick = (arr) => arr[Math.floor((Date.now() / 137) % arr.length)]
    let i = 0
    const gen = () => {
      i++
      const c = comics[(i * 3 + 1) % comics.length]
      const who = names[(i * 5) % names.length]
      const kinds = [
        { t: 'buy', html: `<b>${who}</b> bought <b>${c.title} #${c.issue}</b>` },
        { t: 'watch', html: `<b>${who}</b> is now watching <b>${c.title}</b>` },
        { t: 'list', html: `New listing · <b>${c.title} #${c.issue}</b> for $${c.price}` },
        { t: 'offer', html: `<b>${who}</b>'s offer on <b>${c.title}</b> was accepted` },
        { t: 'review', html: `<b>${who}</b> left a 5★ review for <b>${sellers[c.seller].name}</b>` },
      ]
      const k = kinds[i % kinds.length]
      dispatch({ type: 'FEED_PUSH', item: { id: nextId(), html: k.html, dot: catDot[k.t], time: 'just now' } })
    }
    gen()
    const iv = setInterval(gen, 4200)
    return () => clearInterval(iv)
  }, [])

  // ---- auction countdown (1s) ----
  useEffect(() => {
    const iv = setInterval(() => dispatch({ type: 'AUC_TICK' }), 1000)
    return () => clearInterval(iv)
  }, [])

  // ---- rival bids + outbid toasts (every ~6s) ----
  useEffect(() => {
    const rivals = ['nightowl', 'slabqueen', 'keyhunter', 'panelpusher', 'bronzeage', 'coverlover']
    let n = 0
    const iv = setInterval(() => {
      n++
      const live = ref.current.auctions.filter(x => x.endsInSec > 0)
      if (!live.length) return
      const a = live[n % live.length]
      const who = rivals[n % rivals.length]
      const amt = a.currentBid + (5 + (n % 4) * 5)
      dispatch({ type: 'AUC_RIVAL_BID', id: a.id, who, amt, newBidder: n % 2 === 0 })
      // if the user was top bidder, notify they're outbid
      if (ref.current.myBids[a.id] && ref.current.myBids[a.id] < amt) {
        const c = comicById[a.comicId]
        dispatch({ type: 'TOAST', toast: { kind: 'outbid', title: 'You were outbid', body: `${who} bid $${amt} on ${c.title} #${c.issue}`, comicId: c.id } })
      }
    }, 6000)
    return () => clearInterval(iv)
  }, [])

  // ---- ambient toasts: price drop + wishlist match (every ~11s) ----
  useEffect(() => {
    const msgs = [
      { kind: 'drop', title: 'Price drop', body: 'Crimson Fox #12 dropped $8 — now $120', comicId: 'crimson' },
      { kind: 'match', title: 'Wishlist match', body: 'A CGC 9.8 Solar Sentinels #1 just listed near you', comicId: 'solar' },
      { kind: 'match', title: 'Run completion', body: 'Quantum Twins #0 is the last issue you need', comicId: 'quantum' },
    ]
    let n = 0
    const iv = setInterval(() => { dispatch({ type: 'TOAST', toast: msgs[n % msgs.length] }); n++ }, 11000)
    return () => clearInterval(iv)
  }, [])

  // seller negotiation reply, scheduled by the chat screen through this helper
  const scheduleSellerReply = useCallback((offer) => {
    const c = comicById[ref.current.chatComicId]
    if (!c) return
    setTimeout(() => {
      const list = c.price
      let msg
      if (offer >= list * 0.9) {
        msg = { id: nextId(), from: 'seller', kind: 'accept', amount: offer, text: `Deal! $${offer} works for me. Tap below to check out.` }
      } else if (offer >= list * 0.65) {
        const mid = Math.round((offer + list) / 2)
        msg = { id: nextId(), from: 'seller', kind: 'counter', amount: mid, text: `Appreciate the offer — I'll meet you at $${mid}.` }
      } else {
        const best = Math.round(list * 0.85)
        msg = { id: nextId(), from: 'seller', kind: 'counter', amount: best, text: `That's a bit low for this one. Best I can do is $${best}.` }
      }
      dispatch({ type: 'SELLER_REPLY', msg })
    }, 1600)
  }, [])

  const value = { state, dispatch, scheduleSellerReply }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
