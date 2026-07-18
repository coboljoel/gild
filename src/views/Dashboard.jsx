export default function Dashboard({ totalFmt, gainFmt, gainColor, gainPctFmt, startFmt, chart, statCards, pfRows, onOpenHolding, onGoTrade }) {
  return (
    <div>
      <div className="section-label">Portfolio value</div>
      <div className="portfolio-value">{totalFmt}</div>
      <div className="gain-line">
        <span className="amount" style={{ color: gainColor }}>{gainFmt} ({gainPctFmt})</span>
        <span className="since">since you started with {startFmt}</span>
      </div>

      <div className="card perf-card">
        <div className="perf-head">
          <span className="title">Performance</span>
          <span className="legend-item"><span className="legend-swatch-solid" />You</span>
          <span className="legend-item"><span className="legend-swatch-dashed" />S&amp;P 500</span>
        </div>

        {chart ? (
          <>
            <div className="chart-wrap">
              <svg viewBox="0 0 600 200" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="600" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <path d={chart.spyPath} fill="none" stroke="#55555E" strokeWidth="1.6" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                <path d={chart.pfPath} fill="none" stroke="#D4AF37" strokeWidth="2.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="chart-max">{chart.maxFmt}</span>
              <span className="chart-min">{chart.minFmt}</span>
            </div>
            <div className="chart-caption">Simulated 90-day history of your current holdings vs. the S&amp;P 500, from a {startFmt} start. Sample prices.</div>
          </>
        ) : (
          <div className="empty-state" style={{ marginTop: 14, padding: '44px 20px' }}>
            <div className="title">No performance yet</div>
            <div className="desc">Make your first trade and this chart will track your portfolio against the S&amp;P 500.</div>
            <button className="btn-gold" onClick={onGoTrade}>Start trading</button>
          </div>
        )}
      </div>

      <div className="stat-grid">
        {statCards.map(st => (
          <div className="stat-card" key={st.label}>
            <div className="label">{st.label}</div>
            <div className="value" style={{ color: st.color || '#F5F5F2' }}>{st.value}</div>
          </div>
        ))}
      </div>

      {pfRows.length > 0 && (
        <>
          <div className="settings-title" style={{ marginTop: 26 }}>Holdings</div>
          <div className="holdings-list">
            {pfRows.map(h => (
              <button key={h.t} className="holding-row" onClick={() => onOpenHolding(h.t)}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="ticker">{h.t}</span>
                  <span className="shares">{h.sharesLabel}</span>
                </span>
                <span className="right">
                  <span className="value">{h.valueFmt}</span>
                  <span className="gain" style={{ color: h.color }}>{h.gainPctFmt}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
