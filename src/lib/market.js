// Market data layer: live quotes + search from Finnhub's free tier when
// VITE_FINNHUB_API_KEY is set, falling back to deterministic sample data
// otherwise. Finnhub's free plan doesn't include historical candles, so
// the 90-day price series stays simulated even in live mode — it's
// rescaled to end at whatever the current real (or sample) price is.
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const QUOTE_TTL_MS = 20000;

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export const UNIVERSE = [
  { t: 'AAPL', n: 'Apple', p: 236.2, v: 0.014, s: 'Technology' },
  { t: 'MSFT', n: 'Microsoft', p: 452.7, v: 0.013, s: 'Technology' },
  { t: 'GOOGL', n: 'Alphabet', p: 189.4, v: 0.016, s: 'Technology' },
  { t: 'AMZN', n: 'Amazon', p: 214.8, v: 0.017, s: 'Consumer' },
  { t: 'NVDA', n: 'NVIDIA', p: 138.6, v: 0.028, s: 'Technology' },
  { t: 'META', n: 'Meta Platforms', p: 598.3, v: 0.019, s: 'Technology' },
  { t: 'TSLA', n: 'Tesla', p: 262.5, v: 0.034, s: 'Consumer' },
  { t: 'BRK.B', n: 'Berkshire Hathaway B', p: 472.1, v: 0.009, s: 'Financials' },
  { t: 'JPM', n: 'JPMorgan Chase', p: 246.9, v: 0.012, s: 'Financials' },
  { t: 'V', n: 'Visa', p: 312.4, v: 0.010, s: 'Financials' },
  { t: 'MA', n: 'Mastercard', p: 528.6, v: 0.011, s: 'Financials' },
  { t: 'JNJ', n: 'Johnson & Johnson', p: 158.2, v: 0.008, s: 'Healthcare' },
  { t: 'PFE', n: 'Pfizer', p: 27.9, v: 0.013, s: 'Healthcare' },
  { t: 'UNH', n: 'UnitedHealth', p: 512.3, v: 0.014, s: 'Healthcare' },
  { t: 'WMT', n: 'Walmart', p: 94.6, v: 0.009, s: 'Consumer' },
  { t: 'PG', n: 'Procter & Gamble', p: 171.8, v: 0.007, s: 'Consumer' },
  { t: 'KO', n: 'Coca-Cola', p: 69.4, v: 0.007, s: 'Consumer' },
  { t: 'PEP', n: 'PepsiCo', p: 162.7, v: 0.008, s: 'Consumer' },
  { t: 'MCD', n: 'McDonald’s', p: 301.5, v: 0.009, s: 'Consumer' },
  { t: 'COST', n: 'Costco', p: 948.2, v: 0.011, s: 'Consumer' },
  { t: 'HD', n: 'Home Depot', p: 387.4, v: 0.011, s: 'Consumer' },
  { t: 'NKE', n: 'Nike', p: 78.3, v: 0.016, s: 'Consumer' },
  { t: 'SBUX', n: 'Starbucks', p: 92.1, v: 0.015, s: 'Consumer' },
  { t: 'DIS', n: 'Walt Disney', p: 104.7, v: 0.014, s: 'Media' },
  { t: 'NFLX', n: 'Netflix', p: 1021.4, v: 0.019, s: 'Media' },
  { t: 'AMD', n: 'AMD', p: 156.8, v: 0.029, s: 'Technology' },
  { t: 'INTC', n: 'Intel', p: 23.6, v: 0.024, s: 'Technology' },
  { t: 'CRM', n: 'Salesforce', p: 284.3, v: 0.016, s: 'Technology' },
  { t: 'ADBE', n: 'Adobe', p: 412.6, v: 0.017, s: 'Technology' },
  { t: 'UBER', n: 'Uber', p: 84.2, v: 0.021, s: 'Technology' },
  { t: 'ABNB', n: 'Airbnb', p: 141.6, v: 0.020, s: 'Consumer' },
  { t: 'PLTR', n: 'Palantir', p: 118.9, v: 0.038, s: 'Technology' },
  { t: 'SHOP', n: 'Shopify', p: 112.4, v: 0.027, s: 'Technology' },
  { t: 'PYPL', n: 'PayPal', p: 78.6, v: 0.019, s: 'Financials' },
  { t: 'XOM', n: 'Exxon Mobil', p: 112.3, v: 0.013, s: 'Energy' },
  { t: 'CVX', n: 'Chevron', p: 152.8, v: 0.012, s: 'Energy' },
  { t: 'BA', n: 'Boeing', p: 184.5, v: 0.020, s: 'Industrials' },
  { t: 'T', n: 'AT&T', p: 23.1, v: 0.010, s: 'Telecom' },
  { t: 'VZ', n: 'Verizon', p: 41.7, v: 0.009, s: 'Telecom' },
  { t: 'SPY', n: 'SPDR S&P 500 ETF', p: 628.4, v: 0.008, s: 'ETF' },
  { t: 'VOO', n: 'Vanguard S&P 500 ETF', p: 577.6, v: 0.008, s: 'ETF' },
  { t: 'QQQ', n: 'Invesco Nasdaq 100 ETF', p: 556.2, v: 0.011, s: 'ETF' },
  { t: 'VTI', n: 'Vanguard Total Market ETF', p: 309.8, v: 0.008, s: 'ETF' },
  { t: 'SCHD', n: 'Schwab US Dividend ETF', p: 28.9, v: 0.007, s: 'ETF' }
];

export function info(t) { return UNIVERSE.find(x => x.t === t) || null; }

export function hasLiveData() { return Boolean(FINNHUB_KEY); }

// ---- live quote cache + subscriptions ----
const liveCache = new Map(); // ticker -> { price, prevClose, change, changePct, fetchedAt }
const inflight = new Map();
const subs = new Set();
let version = 0;

function notify() { version++; subs.forEach(fn => fn()); }
export function subscribeQuotes(fn) { subs.add(fn); return () => subs.delete(fn); }
export function getQuotesVersion() { return version; }

async function finnhubGet(path, params) {
  const url = new URL(FINNHUB_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('token', FINNHUB_KEY);
  const res = await fetch(url);
  if (!res.ok) throw new Error('finnhub ' + path + ' ' + res.status);
  return res.json();
}

export function fetchQuote(t, { force = false } = {}) {
  if (!FINNHUB_KEY || !t) return Promise.resolve(null);
  const cached = liveCache.get(t);
  if (!force && cached && Date.now() - cached.fetchedAt < QUOTE_TTL_MS) return Promise.resolve(cached);
  if (inflight.has(t)) return inflight.get(t);
  const p = finnhubGet('/quote', { symbol: t })
    .then(d => {
      if (!d || !d.c) return cached ?? null;
      const entry = { price: d.c, prevClose: d.pc || d.c, change: d.d ?? (d.c - (d.pc || d.c)), changePct: d.dp ?? 0, fetchedAt: Date.now() };
      liveCache.set(t, entry);
      notify();
      return entry;
    })
    .catch(() => cached ?? null)
    .finally(() => inflight.delete(t));
  inflight.set(t, p);
  return p;
}

// ---- sample-anchored 90-day series (Finnhub free tier has no candle history) ----
const seriesCache = {};
export function getSeries(t, days = 90) {
  const inf = info(t);
  const live = liveCache.get(t);
  const anchor = live?.price ?? inf?.p;
  if (anchor == null) return null;
  const vol = inf?.v ?? 0.015;
  const key = t + ':' + days + ':' + anchor;
  if (seriesCache[key]) return seriesCache[key];
  const r = rng(hash(t));
  const vals = [1];
  for (let i = 1; i < days; i++) { vals.push(vals[i - 1] * (1 + (r() - 0.478) * vol * 2)); }
  const scale = anchor / vals[days - 1];
  const out = vals.map(x => +(x * scale).toFixed(2));
  seriesCache[key] = out;
  return out;
}

export function getQuote(t) {
  const inf = info(t);
  const live = liveCache.get(t);
  if (live) {
    return {
      t, n: inf?.n ?? t, s: inf?.s ?? 'Other', vol: inf?.v ?? 0.015,
      price: live.price, prevClose: live.prevClose, change: live.change, changePct: live.changePct, live: true
    };
  }
  if (inf) {
    const s = getSeries(t);
    const prev = s[s.length - 2];
    const change = +(inf.p - prev).toFixed(2);
    return { t: inf.t, n: inf.n, s: inf.s, price: inf.p, prevClose: prev, change, changePct: +(change / prev * 100).toFixed(2), vol: inf.v, live: false };
  }
  return null;
}

function localSearch(q) {
  const needle = q.toLowerCase();
  return UNIVERSE.filter(x => x.t.toLowerCase().includes(needle) || x.n.toLowerCase().includes(needle)).slice(0, 8).map(x => getQuote(x.t));
}

export async function search(q) {
  q = (q || '').trim();
  if (!q) return [];
  if (!FINNHUB_KEY) return localSearch(q);
  try {
    const data = await finnhubGet('/search', { q });
    const candidates = (data.result || [])
      .filter(r => (r.type === 'Common Stock' || r.type === 'ETP' || r.type === 'ETF') && !r.symbol.includes('.') && !r.symbol.includes(':'))
      .slice(0, 6);
    if (candidates.length === 0) return localSearch(q);
    await Promise.all(candidates.map(r => fetchQuote(r.symbol)));
    return candidates
      .map(r => getQuote(r.symbol) ?? { t: r.symbol, n: r.description, s: 'Other', price: 0, change: 0, changePct: 0, vol: 0.015, live: false })
      .filter(row => row.price > 0);
  } catch {
    return localSearch(q);
  }
}
