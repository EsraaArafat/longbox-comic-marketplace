import { useEffect } from 'react'
import { useStore } from '../store.jsx'
import { comicById } from '../data.js'
import ComicCover from '../ComicCover.jsx'
import { IconBell, IconTrend, IconGavel, IconStar } from '../icons.jsx'

const ICONS = { drop: IconTrend, match: IconStar, outbid: IconGavel, default: IconBell }
const ACCENT = { drop: 'var(--success-500)', match: 'var(--primary-500)', outbid: 'var(--danger-500)', default: 'var(--warning-500)' }

function Toast({ t }) {
  const { dispatch } = useStore()
  const Icon = ICONS[t.kind] || ICONS.default
  const accent = ACCENT[t.kind] || ACCENT.default
  const comic = t.comicId ? comicById[t.comicId] : null

  useEffect(() => {
    const to = setTimeout(() => dispatch({ type: 'TOAST_DISMISS', id: t.id }), 6500)
    return () => clearTimeout(to)
  }, [])

  return (
    <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', boxShadow: 'var(--shadow-lg)', animation: 'lbToastIn .3s ease both', cursor: 'pointer', minWidth: 300 }}
      onClick={() => { if (comic) dispatch({ type: 'OPEN_DETAIL', id: comic.id }); dispatch({ type: 'TOAST_DISMISS', id: t.id }) }}>
      <div style={{ width: 34, height: 34, borderRadius: 999, background: accent + '1A', color: accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{t.title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.body}</div>
      </div>
      {comic && <div style={{ width: 26, flexShrink: 0 }}><ComicCover {...comic} /></div>}
    </div>
  )
}

export default function Toasts() {
  const { state } = useStore()
  return (
    <div style={{ position: 'fixed', top: 78, right: 22, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {state.toasts.map(t => <Toast key={t.id} t={t} />)}
    </div>
  )
}
