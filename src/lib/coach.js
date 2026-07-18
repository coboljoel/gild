// Coaching rules + lessons. Educational only — never buy/sell advice on specific securities.
export const LESSONS = [
  { id: 'diversify', tag: 'Foundations', min: 3, title: 'Diversification', body: 'Spreading your money across different companies and industries means no single bad day can sink you. If one stock drops 50% but it’s only 5% of your portfolio, you lose 2.5% — not half. Most beginners hold too few stocks, not too many. A common rule of thumb: no single position should dominate your portfolio.' },
  { id: 'risk', tag: 'Foundations', min: 3, title: 'Risk vs. reward', body: 'Higher potential returns always come with higher potential losses — there’s no free lunch. A stock that can double in a year can also halve. The question isn’t “how much can I make?” but “how much can I afford to lose, and for how long?” Your time horizon is your best risk tool: the longer you can wait, the more risk you can absorb.' },
  { id: 'volatility', tag: 'Concepts', min: 2, title: 'Volatility', body: 'Volatility is how much a price bounces around day to day. It isn’t the same as risk — a volatile stock can still grow over years — but it tests your nerves. Big daily swings tempt people to sell at the worst moment. If watching a holding drop 8% in a day would make you panic-sell, it may be more volatility than you’re ready for.' },
  { id: 'dca', tag: 'Habits', min: 2, title: 'Dollar-cost averaging', body: 'Instead of investing everything at once, invest a fixed amount on a schedule — say, monthly. You automatically buy more shares when prices are low and fewer when they’re high, and you stop trying to guess the perfect moment. Nobody times the market consistently; DCA makes timing irrelevant.' },
  { id: 'index', tag: 'Foundations', min: 3, title: 'Index funds', body: 'An index fund (like an S&P 500 ETF) buys a tiny slice of hundreds of companies in one purchase — instant diversification for the price of one share. Most professional stock-pickers fail to beat the S&P 500 over 10+ years. That’s why the benchmark on your dashboard matters: it’s what you could have earned by simply buying the whole market.' },
  { id: 'longterm', tag: 'Habits', min: 2, title: 'Long-term investing', body: 'Time in the market beats timing the market. Historically, the S&P 500 has been positive in most 10-year windows, despite crashes along the way. Checking prices daily is entertainment; wealth is built by holding good, diversified investments for years and letting compounding work. The best investors are often the most patient — not the most active.' }
];

// Returns array of tips: {tone:'warn'|'info'|'good', tag, title, body, lesson}
export function coachTips({ holdings, cash, startingAmount, transactions, quoteOf }) {
  const tips = [];
  const rows = Object.entries(holdings).map(([t, h]) => ({ t, ...h, q: quoteOf(t) })).filter(r => r.q && r.shares > 0);
  const invested = rows.reduce((a, r) => a + r.shares * r.q.price, 0);
  const total = invested + cash;
  if (rows.length === 0) {
    tips.push({ tone: 'info', tag: 'Getting started', title: 'Your first trade is a learning trade', body: 'You’re holding 100% cash. Head to Trade and buy something — anything — with a small slice of your balance. The goal of your first purchase isn’t profit; it’s to feel how price, shares, and portfolio value connect. Many beginners start with a broad index ETF to learn how the whole market moves.', lesson: 'index' });
    tips.push({ tone: 'info', tag: 'Concept', title: 'Why the S&P 500 line matters', body: 'Your dashboard compares you to the S&P 500 — the 500 largest US companies. It’s the standard yardstick: if a strategy can’t beat simply buying the whole market, the market is the better strategy. Watching that comparison teaches you more than any single stock pick.', lesson: 'index' });
    return tips;
  }
  // Concentration
  const biggest = rows.reduce((a, b) => (a.shares * a.q.price > b.shares * b.q.price ? a : b));
  const bigPct = biggest.shares * biggest.q.price / total * 100;
  if (bigPct > 40) {
    tips.push({ tone: 'warn', tag: 'Concentration risk', title: `${biggest.t} is ${bigPct.toFixed(0)}% of your portfolio`, body: `When one position is this large, your results are mostly one company’s story. Concept to learn: concentration cuts both ways — it amplifies wins and losses equally. Professionals often cap single positions at 5–10%. Notice how your daily portfolio swing tracks ${biggest.t}’s swing almost one-to-one.`, lesson: 'diversify' });
  }
  // Sector concentration
  const bySector = {};
  rows.forEach(r => { bySector[r.q.s] = (bySector[r.q.s] || 0) + r.shares * r.q.price; });
  const topSector = Object.entries(bySector).sort((a, b) => b[1] - a[1])[0];
  if (rows.length >= 2 && topSector[1] / invested > 0.65 && topSector[0] !== 'ETF') {
    tips.push({ tone: 'warn', tag: 'Diversification', title: `${(topSector[1] / invested * 100).toFixed(0)}% of your stocks are in ${topSector[0]}`, body: 'Owning several stocks isn’t diversification if they all live in the same industry — they tend to rise and fall together. Concept to learn: correlation. True diversification mixes industries (and asset types) that don’t move in lockstep.', lesson: 'diversify' });
  }
  // Few holdings
  if (rows.length < 3 && invested / total > 0.5) {
    tips.push({ tone: 'info', tag: 'Diversification', title: `You hold ${rows.length === 1 ? 'a single position' : 'just two positions'}`, body: 'With most of your money in so few names, one earnings surprise sets your whole result. Concept to learn: as you add holdings across different industries, your portfolio’s swings smooth out without necessarily lowering long-run returns — the closest thing to a free lunch in investing.', lesson: 'diversify' });
  }
  // Volatility vs market
  const wVol = rows.reduce((a, r) => a + (r.shares * r.q.price / invested) * r.q.vol, 0);
  if (wVol > 0.018) {
    tips.push({ tone: 'warn', tag: 'Volatility', title: 'Your holdings swing harder than the market', body: `Weighted by size, your stocks move about ${(wVol / 0.008).toFixed(1)}× as much per day as the S&P 500. That’s not automatically bad — but expect bigger red days. Concept to learn: volatility tests behavior. The most common beginner loss isn’t a bad stock; it’s panic-selling a volatile one at the bottom.`, lesson: 'volatility' });
  }
  // Cash drag after activity
  if (cash / total > 0.8 && transactions.length >= 2) {
    tips.push({ tone: 'info', tag: 'Habits', title: 'Most of your money is sitting in cash', body: 'Holding cash while you learn is sensible — but long-term, uninvested cash loses to inflation. Concept to learn: dollar-cost averaging. Instead of hunting the perfect entry, many investors move cash in on a fixed schedule and stop worrying about timing.', lesson: 'dca' });
  }
  // No ETF
  if (!rows.some(r => r.q.s === 'ETF')) {
    tips.push({ tone: 'info', tag: 'Concept', title: 'You haven’t tried an index fund yet', body: 'Every holding you own is a single company. Index ETFs are how most long-term investors get instant diversification in one purchase — and they’re the benchmark you’re being measured against. Worth understanding how one behaves next to your picks. (Educational — which fund, if any, is your call.)', lesson: 'index' });
  }
  // Praise
  const sectors = Object.keys(bySector).length;
  if (rows.length >= 4 && sectors >= 3 && bigPct <= 40) {
    tips.push({ tone: 'good', tag: 'Good habit', title: 'Nicely diversified', body: `${rows.length} holdings across ${sectors} sectors, with no single position dominating. This is the shape of a resilient portfolio: one bad story can’t define your result. Keep an eye on position sizes as prices move — winners quietly become concentration risk.`, lesson: 'longterm' });
  }
  if (transactions.length >= 1 && transactions.length <= 6 && rows.length > 0) {
    tips.push({ tone: 'good', tag: 'Good habit', title: 'You’re trading calmly', body: 'A small number of deliberate trades beats constant tinkering. Frequent trading is where most beginners leak money — every trade is a chance to be wrong twice (selling and re-buying). Patience is a strategy.', lesson: 'longterm' });
  }
  return tips;
}
