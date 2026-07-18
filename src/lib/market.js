// Sample market data layer — deterministic fake series for ~40 well-known US stocks & ETFs.
// Swap this module for a real quote provider (e.g. an Alpha Vantage proxy) to go live.
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

const seriesCache = {};
export function getSeries(t, days = 90) {
  const key = t + ':' + days;
  if (seriesCache[key]) return seriesCache[key];
  const inf = info(t); if (!inf) return null;
  const r = rng(hash(t));
  const vals = [1];
  for (let i = 1; i < days; i++) { vals.push(vals[i - 1] * (1 + (r() - 0.478) * inf.v * 2)); }
  const scale = inf.p / vals[days - 1];
  const out = vals.map(x => +(x * scale).toFixed(2));
  seriesCache[key] = out;
  return out;
}

export function getQuote(t) {
  const inf = info(t); if (!inf) return null;
  const s = getSeries(t);
  const prev = s[s.length - 2];
  const change = +(inf.p - prev).toFixed(2);
  return { t: inf.t, n: inf.n, s: inf.s, price: inf.p, prevClose: prev, change, changePct: +(change / prev * 100).toFixed(2), vol: inf.v };
}

export function search(q) {
  q = (q || '').trim().toLowerCase();
  if (!q) return [];
  return UNIVERSE.filter(x => x.t.toLowerCase().includes(q) || x.n.toLowerCase().includes(q)).slice(0, 8).map(x => getQuote(x.t));
}

export const SPY_DAILY_VOL = 0.008;
