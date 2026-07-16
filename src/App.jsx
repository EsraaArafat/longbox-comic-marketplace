import { useStore } from './store.jsx'
import { IconSearch, IconCompass, IconPin, IconChat, IconStar, IconBell, IconGavel } from './icons.jsx'
import Toasts from './components/Toasts.jsx'
import Discover from './screens/Discover.jsx'
import Detail from './screens/Detail.jsx'
import Chat from './screens/Chat.jsx'
import MapNear from './screens/MapNear.jsx'
import Watchlist from './screens/Watchlist.jsx'
import Checkout from './screens/Checkout.jsx'
import Auctions from './screens/Auctions.jsx'

const NAV = [
  { key: 'browse', label: 'Discover', Icon: IconCompass },
  { key: 'auctions', label: 'Auctions', Icon: IconGavel, live: true },
  { key: 'map', label: 'Near Me', Icon: IconPin },
  { key: 'chat', label: 'Messages', Icon: IconChat, badge: 'msg' },
  { key: 'watchlist', label: 'Watchlist', Icon: IconStar, badge: 'saved' },
]

function Sidebar() {
  const { state, dispatch } = useStore()
  const active = ['detail', 'checkout'].includes(state.screen) ? 'browse' : state.screen
  const savedCount = Object.keys(state.saved).length
  const msgCount = state.thread.length ? 1 : 0

  return (
    <aside style={{ width: 248, flexShrink: 0, background: '#fff', borderRight: '1px solid var(--border-subtle)', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '6px 6px 20px' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--primary-500)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 18 }}>L</div>
        <span style={{ fontWeight: 800, fontSize: 19, color: 'var(--fg-strong)' }}>Longbox</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ key, label, Icon, badge, live }) => {
          const on = active === key
          const count = badge === 'saved' ? savedCount : badge === 'msg' ? msgCount : 0
          return (
            <button key={key} onClick={() => dispatch({ type: 'SCREEN', screen: key })}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 12px', borderRadius: 12, textAlign: 'left',
                background: on ? 'var(--primary-500)' : 'transparent', color: on ? '#fff' : 'var(--fg-default)', fontWeight: on ? 600 : 500, fontSize: 14, transition: 'background .15s' }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--primary-100)' }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent' }}>
              <Icon size={20} />
              <span>{label}</span>
              {live && <span className="live-dot" style={{ marginLeft: 'auto', background: on ? '#fff' : 'var(--success-500)' }} />}
              {badge && count > 0 && (
                <span className="num" style={{ marginLeft: 'auto', minWidth: 20, height: 20, borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', padding: '0 6px',
                  background: on ? 'rgba(255,255,255,0.25)' : 'var(--primary-500)', color: '#fff' }}>{count}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ background: 'var(--primary-100)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-strong)' }}>Collector Pro</div>
          <div style={{ fontSize: 12, color: 'var(--fg-default)', margin: '4px 0 12px' }}>Price alerts, early auction access & 0% buyer fees.</div>
          <button className="btn btn-primary" style={{ width: '100%', height: 36 }}>Upgrade</button>
        </div>
      </div>
    </aside>
  )
}

function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, height: 66, background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--neutral-50)', borderRadius: 999, height: 42, padding: '0 16px', maxWidth: 440, flex: 1, color: 'var(--fg-placeholder)' }}>
        <IconSearch size={18} />
        <input placeholder="Search 40,000+ issues, titles, publishers…" style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 14, color: 'var(--fg-default)' }} />
      </div>
      <div style={{ flex: 1 }} />
      <button style={{ position: 'relative', width: 40, height: 40, borderRadius: 999, display: 'grid', placeItems: 'center', color: 'var(--fg-default)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--neutral-100)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <IconBell size={20} />
        <span style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 999, background: 'var(--warning-500)', border: '2px solid #fff' }} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: 'linear-gradient(135deg,#9DC3E0,#3C7CB0)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>AM</div>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>Alex Morgan</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Collector · NYC</div>
        </div>
      </div>
    </header>
  )
}

const SCREENS = { browse: Discover, detail: Detail, chat: Chat, map: MapNear, watchlist: Watchlist, checkout: Checkout, auctions: Auctions }

export default function App() {
  const { state } = useStore()
  const Screen = SCREENS[state.screen] || Discover
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, overflow: 'auto' }}><Screen /></main>
      </div>
      <Toasts />
    </div>
  )
}
