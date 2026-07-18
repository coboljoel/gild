import { useState } from 'react';
import Logo from '../components/Logo';

const CHIPS = [25000, 100000, 250000];

export default function Setup({ onStart }) {
  const [amt, setAmt] = useState('100000');

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <Logo size={64} />
        <div className="setup-title">Gild</div>
        <div className="setup-tagline">Fake money. Real lessons.</div>
        <p className="setup-blurb">
          Practice investing in real stocks with pretend cash. Gild tracks your performance against the
          S&amp;P 500 and coaches you on the concepts behind every move.
        </p>
        <div className="setup-amount-block">
          <div className="section-label">Your practice cash</div>
          <div className="amount-input">
            <span className="dollar">$</span>
            <input type="number" min="100" step="1000" value={amt} onChange={e => setAmt(e.target.value)} />
          </div>
          <div className="chip-row">
            {CHIPS.map(v => (
              <button key={v} className="chip" onClick={() => setAmt(String(v))}>${v / 1000}k</button>
            ))}
          </div>
        </div>
        <button className="btn-gold btn-block" onClick={() => onStart(parseFloat(amt))}>Start practicing</button>
        <div className="setup-disclaimer">Simulator only — no real money is ever involved. Educational content, not financial advice.</div>
      </div>
    </div>
  );
}
