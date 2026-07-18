export default function Portfolio({ pfRows, totalFmt, cashFmt, investedFmt, onGoTrade }) {
  return (
    <div>
      <h1 className="view-title">Portfolio</h1>
      <div className="pf-summary">
        <span>Total <b>{totalFmt}</b></span>
        <span>Cash <b>{cashFmt}</b></span>
        <span>Invested <b>{investedFmt}</b></span>
      </div>

      {pfRows.length === 0 && (
        <div className="empty-state" style={{ marginTop: 18 }}>
          <div className="title">Nothing here yet</div>
          <div className="desc">Your holdings will appear here after your first purchase.</div>
          <button className="btn-gold" onClick={onGoTrade}>Find a stock</button>
        </div>
      )}

      {pfRows.length > 0 && (
        <div className="pf-table">
          <div className="pf-table-head">
            <span>Company</span>
            <span className="right">Shares</span>
            <span className="right">Avg cost</span>
            <span className="right">Price</span>
            <span className="right">Value</span>
            <span className="right">Gain / loss</span>
          </div>
          {pfRows.map(h => (
            <div className="pf-table-row" key={h.t}>
              <span className="company">
                <span className="sym">{h.t}</span>
                <span className="name">{h.name}</span>
              </span>
              <span className="right" style={{ fontWeight: 700 }}>{h.shares}</span>
              <span className="right" style={{ color: 'var(--muted)' }}>{h.avgFmt}</span>
              <span className="right">{h.priceFmt}</span>
              <span className="right" style={{ fontWeight: 800 }}>{h.valueFmt}</span>
              <span className="right gain-cell" style={{ color: h.color }}>
                {h.gainFmt}
                <span className="pct">{h.gainPctFmt}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {pfRows.length > 0 && (
        <div className="pf-cards">
          {pfRows.map(h => (
            <div className="pf-card" key={h.t}>
              <div className="pf-card-top">
                <span className="sym">{h.t}</span>
                <span className="value">{h.valueFmt}</span>
              </div>
              <div className="pf-card-bottom">
                <span className="detail">{h.sharesLabel} · avg {h.avgFmt} · now {h.priceFmt}</span>
                <span className="gain" style={{ color: h.color }}>{h.gainFmt} ({h.gainPctFmt})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
