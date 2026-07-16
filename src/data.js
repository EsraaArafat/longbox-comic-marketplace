// Seed data — faithful to the Longbox handoff, extended with interactive-feature data.

export const sellers = {
  marcus: { id: 'marcus', name: 'Marcus Reid', rating: '4.9', location: 'Brooklyn, NY', distance: '1.2 mi', hue: 200 },
  dana:   { id: 'dana',   name: 'Dana Cho',    rating: '4.8', location: 'Queens, NY',    distance: '3.4 mi', hue: 280 },
  priya:  { id: 'priya',  name: 'Priya Nair',  rating: '5.0', location: 'Jersey City, NJ', distance: '5.1 mi', hue: 20 },
  leo:    { id: 'leo',    name: 'Leo Alvarez', rating: '4.7', location: 'Manhattan, NY',  distance: '0.8 mi', hue: 150 },
  sam:    { id: 'sam',    name: 'Sam Okafor',  rating: '4.6', location: 'Hoboken, NJ',    distance: '6.0 mi', hue: 330 },
}

// price history = last 6 relative comps, used for the sparkline + smart offer hints
export const comics = [
  { id: 'solar',    title: 'Solar Sentinels',   issue: '1',  publisher: 'Astral',     year: 2019, grade: 'CGC 9.8', condition: 'CGC 9.8', price: 340, bg: '#0B1E3B', ink: '#FDE047', accent: '#E11D48', seller: 'marcus', watch: 62, hot: 'Trending',   sold: 'Sold 3× this week', mapX: 30, mapY: 34, series: 'Solar Sentinels', history: [292, 305, 300, 318, 330, 340], blurb: 'First full appearance of the Solar Sentinels team. Bright, high-grade slab with perfect corners and pristine white pages — a modern key that keeps climbing.' },
  { id: 'midnight', title: 'Midnight Vigil',     issue: '7',  publisher: 'Iron Crown', year: 1994, grade: '',        condition: 'VF/NM 9.0', price: 85,  bg: '#17122B', ink: '#22D3EE', accent: '#A855F7', seller: 'dana',   watch: 28, hot: 'Underrated', sold: 'Sold 1× this week', mapX: 68, mapY: 24, series: 'Midnight Vigil', history: [70, 72, 78, 80, 82, 85], blurb: 'A cult-favorite 90s run with striking foil-era energy. Raw copy, tight spine, ready to read or send off for grading.' },
  { id: 'crimson',  title: 'Crimson Fox',        issue: '12', publisher: 'Vanguard',   year: 2005, grade: 'CGC 9.6', condition: 'CGC 9.6', price: 120, bg: '#7F1020', ink: '#FCE7C8', accent: '#F59E0B', seller: 'priya',  watch: 41, hot: 'Hot',       sold: 'Sold 2× this week', mapX: 20, mapY: 68, series: 'Crimson Fox', history: [138, 132, 128, 125, 122, 120], blurb: 'The controversial villain debut issue. Bold cover art, sharp registration, and a census that stays thin at this grade.' },
  { id: 'neon',     title: 'Neon Drifter',       issue: '1',  publisher: 'Pulse',      year: 2021, grade: '',        condition: 'NM 9.4', price: 45,  bg: '#2A0A3D', ink: '#34E0C4', accent: '#EC4899', seller: 'leo',    watch: 19, hot: 'New',       sold: 'Just listed',      mapX: 52, mapY: 44, series: 'Neon Drifter', history: [40, 41, 42, 43, 44, 45], blurb: 'Indie breakout with gorgeous synthwave covers. First print, near mint, and impossible to find on the shelf anymore.' },
  { id: 'deep',     title: 'The Deep Ones',      issue: '3',  publisher: 'Hollow',     year: 1988, grade: '',        condition: 'GD 2.0', price: 28,  bg: '#06312E', ink: '#8EE6C8', accent: '#0EA5A0', seller: 'sam',    watch: 12, hot: 'Reader copy', sold: 'Sold 1× this week', mapX: 80, mapY: 58, series: 'The Deep Ones', history: [30, 29, 29, 28, 28, 28], blurb: 'A well-loved reader copy of the horror classic. Complete and flat, some spine wear — a great affordable entry into the run.' },
  { id: 'marshal',  title: 'Star Marshal',       issue: '22', publisher: 'Astral',     year: 1979, grade: '',        condition: 'FN 6.0', price: 210, bg: '#B5340C', ink: '#FEF3C7', accent: '#1F2937', seller: 'marcus', watch: 47, hot: 'Bronze key',  sold: 'Sold 2× this week', mapX: 34, mapY: 30, series: 'Star Marshal', history: [180, 188, 195, 200, 205, 210], blurb: 'Bronze-age key with the sought-after cosmic cover. Presents beautifully, supple pages, and a bargain against recent comps.' },
  { id: 'quantum',  title: 'Quantum Twins',      issue: '0',  publisher: 'Pulse',      year: 2023, grade: 'CGC 10', condition: 'CGC 10', price: 520, bg: '#06294D', ink: '#FFFFFF', accent: '#38BDF8', seller: 'priya',  watch: 88, hot: 'Grail',     sold: 'Sold 4× this week', mapX: 24, mapY: 64, series: 'Quantum Twins', history: [430, 455, 470, 490, 505, 520], blurb: 'The elusive gem-mint 10.0. Retailer incentive variant, top of the census, and the definitive copy of a red-hot modern.' },
  { id: 'grave',    title: 'Gravedigger Blues',  issue: '4',  publisher: 'Iron Crown', year: 2001, grade: '',        condition: 'VF 8.0', price: 60,  bg: '#2B241A', ink: '#E7D8B5', accent: '#9A3412', seller: 'dana',   watch: 23, hot: 'Undervalued', sold: 'Sold 1× this week', mapX: 64, mapY: 22, series: 'Gravedigger Blues', history: [66, 64, 63, 61, 60, 60], blurb: 'Moody noir one-shot arc with a killer painted cover. Very fine, unpressed, and quietly gaining collector attention.' },
]

export const comicById = Object.fromEntries(comics.map(c => [c.id, c]))

// ---- NEW: Live auctions (feature #1) ----
// endsInSec is seeded relative to a start captured at mount time.
export const auctionsSeed = [
  { id: 'a_quantum', comicId: 'quantum', startBid: 380, currentBid: 465, bidders: 14, endsInSec: 92,  history: [
      { who: 'nightowl', amt: 465 }, { who: 'you-rival', amt: 445 }, { who: 'panelpusher', amt: 420 }, { who: 'nightowl', amt: 400 } ] },
  { id: 'a_solar', comicId: 'solar', startBid: 250, currentBid: 312, bidders: 9, endsInSec: 220, history: [
      { who: 'keyhunter', amt: 312 }, { who: 'slabqueen', amt: 300 }, { who: 'keyhunter', amt: 280 } ] },
  { id: 'a_marshal', comicId: 'marshal', startBid: 150, currentBid: 188, bidders: 6, endsInSec: 410, history: [
      { who: 'bronzeage', amt: 188 }, { who: 'coverlover', amt: 175 } ] },
]

// ---- NEW: Series runs for the "Complete the run" tracker (feature #3) ----
// owned/forSale/missing issue numbers per series the collector is chasing.
export const runs = [
  { series: 'Solar Sentinels', publisher: 'Astral', total: 6, owned: [2, 3, 5], forSale: { 1: 'solar' }, accent: '#E11D48' },
  { series: 'Quantum Twins',   publisher: 'Pulse',  total: 5, owned: [1, 2, 3], forSale: { 0: 'quantum' }, accent: '#38BDF8' },
  { series: 'Crimson Fox',     publisher: 'Vanguard', total: 12, owned: [8, 9, 10, 11], forSale: { 12: 'crimson' }, accent: '#F59E0B' },
]

export const initials = (name) => name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
export const avatarStyle = (hue, size = 38) => ({
  width: size, height: size, flexShrink: 0, borderRadius: 999,
  background: `linear-gradient(135deg, hsl(${hue} 45% 78%), hsl(${hue - 20} 45% 52%))`,
  color: '#fff', fontWeight: 700, fontSize: size * 0.36,
  display: 'grid', placeItems: 'center', fontFamily: 'var(--font-primary)',
})

// hot-tag tone pairs
export const hotTones = {
  Grail: ['#F1E9FB', '#772ED3'], Hot: ['#FFE9E9', '#C42323'], Trending: ['#FEF3DC', '#C77906'],
  New: ['#E6F7EE', '#2A8F4D'], default: ['#E6F0F5', '#076698'],
}
export const toneFor = (tag) => hotTones[tag] || hotTones.default

export const REACTIONS = ['🔥', '😍', '🤯', '💰']
