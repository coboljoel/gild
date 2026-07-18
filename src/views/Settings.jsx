import * as mkt from '../lib/market';

export default function Settings({ startFmt, startingAmount, settingsAmt, setSettingsAmt, onSave, confirmReset, onResetClick }) {
  const live = mkt.hasLiveData();
  return (
    <div>
      <h1 className="view-title">Settings</h1>
      <div className="settings-list">
        <div className="card">
          <div className="settings-title">Starting amount</div>
          <div className="settings-desc">Currently {startFmt}. Changing it adjusts your cash by the difference and re-baselines your gain/loss.</div>
          <div className="settings-save-row">
            <div className="amount-input">
              <span className="dollar">$</span>
              <input
                type="number"
                min="100"
                step="1000"
                value={settingsAmt}
                placeholder={String(startingAmount)}
                onChange={e => setSettingsAmt(e.target.value)}
              />
            </div>
            <button className="btn-gold save-btn" onClick={onSave}>Save</button>
          </div>
        </div>

        <div className="card">
          <div className="settings-title">Reset portfolio</div>
          <div className="settings-desc">Wipes holdings, cash, and history, and returns you to setup. Can’t be undone.</div>
          <button
            className="btn-danger-outline"
            style={{
              marginTop: 12,
              border: '1px solid ' + (confirmReset ? 'rgba(243,91,91,0.6)' : 'rgba(255,255,255,0.15)'),
              color: confirmReset ? '#F35B5B' : 'var(--muted)'
            }}
            onClick={onResetClick}
          >
            {confirmReset ? 'Tap again to confirm reset' : 'Reset portfolio'}
          </button>
        </div>

        <div className="card">
          <div className="settings-title">Data source</div>
          {live ? (
            <div className="settings-desc" style={{ lineHeight: 1.6 }}>
              Prices and search are <span style={{ color: 'var(--gold)', fontWeight: 700 }}>live</span>, via
              Finnhub's free API. Its free tier doesn't include historical candles, so the 90-day performance
              chart and sparklines stay simulated — rescaled to end at today's real price. <code>store.js</code> is
              still local-only; swap it for a backend such as Supabase to persist across devices.
            </div>
          ) : (
            <div className="settings-desc" style={{ lineHeight: 1.6 }}>
              This app runs on built-in <span style={{ color: 'var(--gold)', fontWeight: 700 }}>sample data</span> for
              ~44 popular US stocks and ETFs. Set <code>VITE_FINNHUB_API_KEY</code> (see the README) to switch to
              live quotes and full-market search via Finnhub's free tier.
            </div>
          )}
        </div>

        <div className="card">
          <div className="settings-title">Account</div>
          <div className="settings-desc">Email sign-in and cross-device sync would arrive with a backend-connected build.</div>
          <button
            className="btn-danger-outline"
            style={{ marginTop: 12, border: '1px solid rgba(255,255,255,0.12)', color: 'var(--dim)', cursor: 'not-allowed' }}
            disabled
          >
            Sign out
          </button>
        </div>

        <div className="settings-foot">Gild is a paper-trading simulator. No real money, no brokerage, no financial advice.</div>
      </div>
    </div>
  );
}
