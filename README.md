# Gild

Fake money. Real lessons.

A paper-trading simulator that lets you practice investing in real stocks with pretend cash, tracks your performance against the S&P 500, and coaches you on the concepts behind your own trades — without ever recommending a specific buy or sell.

## Stack

Vite + React. State is a small external store (`src/lib/store.js`) persisted to `localStorage` and read via `useSyncExternalStore`.

- `src/lib/market.js` — sample quote/price-history data for ~44 US stocks & ETFs. Swap for a real quote provider to go live.
- `src/lib/coach.js` — the coaching rules and the six Learn lessons.
- `src/lib/store.js` — cash/holdings/transactions state and trade actions. Swap for a real backend (e.g. Supabase) to go live.
- `src/Shell.jsx` — app chrome (nav, view routing) plus the derived portfolio numbers shared across views.
- `src/views/*` — Dashboard, Trade, Portfolio, Coach, Learn, History, Settings.

The layout is responsive (desktop top nav vs. mobile bottom tab bar, breakpoint at 860px) rather than two fixed device sizes.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
