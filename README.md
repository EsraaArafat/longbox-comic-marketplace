# Longbox — Interactive Comic Marketplace

A desktop web marketplace for buying, selling, and bidding on collectible comics,
built on the **Talentino Design System**. React + Vite. Buyer-focused, and built to
feel *alive* — real-time activity, live auctions, negotiation, and push-style alerts.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Screens

Navigate via the left sidebar (screens are also deep-linkable by hash, e.g. `/#auctions`):

- **Discover** (`#browse`) — listing grid + live activity rail, plus a "Discovery Feed" layout toggle and filter chips.
- **Auctions** (`#auctions`) — live countdowns, streaming bid ladder, place bids.
- **Near Me** (`#map`) — stylized map with clickable price pins.
- **Messages** (`#chat`) — offer/counter-offer negotiation with the seller.
- **Watchlist / Collection** (`#watchlist`) — saved comics + "Complete the run" tracker.
- **Comic Detail** — full listing with price-history sparkline; entry to buy/offer/message.
- **Checkout** — one-tap purchase confirmation.

## Interactive features

Carried over from the design brief:
- ⚡ **Live activity feed** — new events stream in every ~4s.
- 💬 **Offer negotiation** — seller accepts / counters based on your offer vs. list price.
- 📍 **Map price pins** — click to preview and buy locally.
- ⚡ **1-tap checkout** — buy now or accept an offer straight to confirmation.

Added to deepen engagement:
1. **⚡ Live auctions** — real-time countdown, rival bids arriving live, place-a-bid ladder.
2. **📈 Price-history sparkline + smart offer chips** — negotiate with context.
3. **📚 "Complete the run" tracker** — owned / for-sale / missing issues per series, gamified.
4. **🔔 Real-time toast alerts** — price drops, wishlist matches, and outbid notifications.
5. **😍 Emoji reactions** on every listing.

## Architecture

- `src/store.jsx` — single source of truth (`useReducer` + context). Owns all state and
  the live simulations (activity feed, auction ticks, rival bids, ambient toasts). In
  production, swap the client-side simulation + heuristic seller replies for websocket/
  polling streams and real seller actions / a pricing service.
- `src/screens/*` — one component per screen.
- `src/components/*` — shared atoms (pills, avatar, sparkline) and the toast layer.
- `src/ComicCover.jsx` — procedural CSS cover art. **Production:** replace with real 2:3
  `<img>` cover scans, keeping the card/detail slot dimensions.
- `src/data.js` — seed comics, sellers, auctions, runs. Replace with API data.
- `src/styles.css` — Talentino design tokens (colors, type, radii, cool shadows).

> Icons are inline SVGs in Hugeicons style. Mapping: star = watchlist, chat = messages,
> lightning = 1-tap buy, gavel = auctions.
