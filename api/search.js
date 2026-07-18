// Vercel serverless function — keeps FINNHUB_API_KEY server-side only.
// See api/quote.js for why this reads process.env.FINNHUB_API_KEY (server-only)
// rather than a VITE_-prefixed variable (which Vite would ship to the browser).
export default async function handler(req, res) {
  const { q } = req.query;
  const key = process.env.FINNHUB_API_KEY;

  if (!q) return res.status(400).json({ error: 'q required' });
  if (!key) return res.status(503).json({ error: 'FINNHUB_API_KEY not configured' });

  const upstream = await fetch(
    `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${key}`
  );
  const data = await upstream.json();
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  res.status(upstream.status).json(data);
}
