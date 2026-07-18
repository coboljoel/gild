import * as mkt from '../lib/market';
import { fmt, toPath } from '../lib/format';

const GREEN = '#2FC97C', RED = '#F35B5B', GOLD = '#D4AF37', MUT = '#9A9AA3';
const POPULAR = ['VOO', 'AAPL', 'MSFT', 'NVDA', 'KO', 'DIS'];

function TickerRow({ q, onPick }) {
  return (
    <button className="ticker-row" onClick={() => onPick(q.t)}>
      <span className="ticker-main">
        <span className="ticker-symbol">{q.t}</span>
        <span className="ticker-name">{q.n}</span>
      </span>
      <span className="ticker-price">{fmt(q.price)}</span>
      <span className="ticker-change" style={{ color: q.changePct >= 0 ? GREEN : RED }}>
        {(q.changePct >= 0 ? '+' : '−') + Math.abs(q.changePct).toFixed(2) + '%'}
      </span>
    </button>
  );
}

export default function Trade({ query, setQuery, sel, onPick, qty, setQty, mode, setMode, msg, msgOk, holdings, cash, onTrade }) {
  const results = mkt.search(query);
  const showPopular = results.length === 0 && !sel;

  const q = sel ? mkt.getQuote(sel) : null;
  const spark = sel ? mkt.getSeries(sel) : null;
  const own = sel ? holdings[sel] : null;
  const isBuy = mode === 'buy';
  const n = Math.floor(parseFloat(qty)) || 0;

  let sparkStroke;
  let sparkPath;
  if (spark) {
    const mn = Math.min(...spark), mx = Math.max(...spark);
    sparkPath = toPath(spark, mn, mx, 300, 70, 4);
    sparkStroke = spark[spark.length - 1] >= spark[0] ? GREEN : RED;
  }

  return (
    <div>
      <h1 className="view-title">Trade</h1>
      <input
        className="search-input"
        value={query}
        placeholder="Search a ticker or company — try NVDA or Vanguard"
        onChange={e => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="ticker-list">
          {results.map(r => <TickerRow key={r.t} q={r} onPick={onPick} />)}
        </div>
      )}

      {showPopular && (
        <>
          <div className="section-label" style={{ marginTop: 22 }}>Popular</div>
          <div className="ticker-list">
            {POPULAR.map(t => <TickerRow key={t} q={mkt.getQuote(t)} onPick={onPick} />)}
          </div>
        </>
      )}

      {q && (
        <div className="card trade-card">
          <div className="trade-head">
            <span className="trade-symbol">{q.t}</span>
            <span className="trade-name">{q.n}</span>
            <span className="trade-sector">{q.s}</span>
          </div>
          <div className="trade-price-row">
            <span className="trade-price">{fmt(q.price)}</span>
            <span className="trade-change" style={{ color: q.change >= 0 ? GREEN : RED }}>
              {(q.change >= 0 ? '+' : '−') + fmt(Math.abs(q.change)).slice(1) + ' (' + (q.changePct >= 0 ? '+' : '−') + Math.abs(q.changePct).toFixed(2) + '%)'} today
            </span>
          </div>
          <svg className="spark-svg" viewBox="0 0 300 70" preserveAspectRatio="none">
            <path d={sparkPath} fill="none" stroke={sparkStroke} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="spark-caption">Past 90 days · sample data</div>

          {own && (
            <div className="own-line">
              You own <b>{own.shares + (own.shares === 1 ? ' share' : ' shares')}</b> — avg cost {fmt(own.cost / own.shares)}
            </div>
          )}

          <div className="tab-row">
            <button className={"tab-btn" + (isBuy ? ' active' : '')} onClick={() => setMode('buy')}>Buy</button>
            <button className={"tab-btn" + (!isBuy ? ' active' : '')} onClick={() => setMode('sell')}>Sell</button>
          </div>

          <div className="qty-row">
            <label>Shares</label>
            <input type="number" min="1" step="1" value={qty} placeholder="0" onChange={e => setQty(e.target.value)} />
          </div>

          <div className="row-between">
            <span>{isBuy ? 'Estimated cost' : 'Estimated proceeds'}</span>
            <span className="strong">{fmt(n * q.price)}</span>
          </div>
          <div className="row-between">
            <span>{isBuy ? 'Cash available' : 'Shares you own'}</span>
            <span style={{ fontWeight: 700 }}>{isBuy ? fmt(cash) : String(own ? own.shares : 0)}</span>
          </div>

          <button className="btn-gold btn-block" style={{ marginTop: 14 }} onClick={() => onTrade(isBuy, q.t, n, q.price)}>
            {(isBuy ? 'Buy ' : 'Sell ') + q.t}
          </button>

          {msg && (
            <div className="msg-box" style={{ color: msgOk ? GREEN : '#E8B04C', borderColor: msgOk ? 'rgba(47,201,124,0.4)' : 'rgba(232,176,76,0.4)' }}>
              {msg}
            </div>
          )}
        </div>
      )}

      <div className="hint-text">Sample prices for practice. The real build shows live quotes (~15&nbsp;min delayed on the free data tier).</div>
    </div>
  );
}
