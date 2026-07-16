// Inline SVG icons — Hugeicons style (stroke, rounded, 1.5px, 24x24 viewBox).
const S = ({ children, size = 20, fill = 'none', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>{children}</svg>
)

export const IconSearch = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></S>
export const IconCompass = (p) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></S>
export const IconPin = (p) => <S {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></S>
export const IconChat = (p) => <S {...p}><path d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1-3.2A7.9 7.9 0 0 1 4 12Z" /></S>
export const IconStar = ({ filled, ...p }) => <S {...p} fill={filled ? 'currentColor' : 'none'}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" /></S>
export const IconBell = (p) => <S {...p}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></S>
export const IconEye = (p) => <S {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></S>
export const IconBolt = ({ filled, ...p }) => <S {...p} fill={filled ? 'currentColor' : 'none'}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></S>
export const IconSend = (p) => <S {...p}><path d="M21 3 3 10.5 10 13l2.5 7L21 3Z" /><path d="M10 13 21 3" /></S>
export const IconBack = (p) => <S {...p}><path d="M15 6l-6 6 6 6" /></S>
export const IconCheck = (p) => <S {...p}><path d="m5 12.5 4.5 4.5L19 7" /></S>
export const IconShield = (p) => <S {...p}><path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" /></S>
export const IconGavel = (p) => <S {...p}><path d="m14 6 4 4M9 11l4 4M4 20h8M13.5 3.5l7 7-2 2-7-7 2-2ZM10.5 6.5 6 11l-2 2 4 4 2-2 4.5-4.5" /></S>
export const IconLayers = (p) => <S {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></S>
export const IconClock = (p) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>
export const IconTrend = (p) => <S {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></S>
export const IconTag = (p) => <S {...p}><path d="M3 12V4h8l9 9-8 8-9-9Z" /><circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" /></S>
