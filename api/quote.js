// Vercel serverless function — keeps FINNHUB_API_KEY server-side only.
// Deliberately reads process.env.FINNHUB_API_KEY, not VITE_FINNHUB_API_KEY:
// anything VITE_-prefixed gets inlined into the client bundle by Vite, which
// would defeat the point of proxying.
export default async function handler(req, res) {
  const { symbol } = req.query;
  const key = process.env.FINNHUB_API_KEY;

  if (!symbol) return res.status(400).json({ error: 'symbol required' });
  if (!key) return res.status(503).json({ error: 'FINNHUB_API_KEY not configured' });

  const upstream = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`
  );
  const data = await upstream.json();
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=45');
  res.status(upstream.status).json(data);
}
