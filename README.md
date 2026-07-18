# Gild

Fake money. Real lessons.

A paper-trading simulator that lets you practice investing in real stocks with pretend cash, tracks your performance against the S&P 500, and coaches you on the concepts behind your own trades — without ever recommending a specific buy or sell.

## Stack

Vite + React. State is a small external store (`src/lib/store.js`) persisted to `localStorage` and read via `useSyncExternalStore`.

- `src/lib/market.js` — live quotes + search via Finnhub's free API when `VITE_FINNHUB_API_KEY` is set, falling back to deterministic sample data for ~44 US stocks & ETFs otherwise. Finnhub's free tier has no historical candles, so the 90-day price series is always simulated, just rescaled to end at the current (live or sample) price.
- `src/lib/useQuote.js` — `useLiveQuotes(tickers)`, a small hook that fetches/caches quotes and re-renders subscribers as they arrive.
- `src/lib/coach.js` — the coaching rules and the six Learn lessons.
- `src/lib/store.js` — cash/holdings/transactions state and trade actions. Swap for a real backend (e.g. Supabase) to go live.
- `src/Shell.jsx` — app chrome (nav, view routing) plus the derived portfolio numbers shared across views.
- `src/views/*` — Dashboard, Trade, Portfolio, Coach, Learn, History, Settings.

The layout is responsive (desktop top nav vs. mobile bottom tab bar, breakpoint at 860px) rather than two fixed device sizes.

## Live quotes (optional)

1. Sign up free at [finnhub.io](https://finnhub.io) and copy your API key from the dashboard.
2. Copy `.env.example` to `.env` and set `VITE_FINNHUB_API_KEY`.
3. Restart `npm run dev`.

Without a key, the app runs entirely on built-in sample data — no setup required. Finnhub's free tier is rate-limited (60 req/min) and read-only market data; quotes are cached for 20s per ticker to stay well under that.

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
