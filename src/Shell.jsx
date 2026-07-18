import { useMemo, useState } from 'react';
import { store } from './lib/store';
import * as mkt from './lib/market';
import { coachTips } from './lib/coach';
import { fmt, fmt0, toPath } from './lib/format';
import { NAV } from './lib/nav';
import Logo from './components/Logo';
import Dashboard from './views/Dashboard';
import Trade from './views/Trade';
import Portfolio from './views/Portfolio';
import Coach from './views/Coach';
import Learn from './views/Learn';
import History from './views/History';
import Settings from './views/Settings';

const GREEN = '#2FC97C', RED = '#F35B5B', MUT = '#9A9AA3';

export default function Shell({ state }) {
  const [view, setView] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(null);
  const [qty, setQty] = useState('');
  const [mode, setMode] = useState('buy');
  const [msg, setMsg] = useState(null);
  const [msgOk, setMsgOk] = useState(true);
  const [lessonId, setLessonId] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [settingsAmt, setSettingsAmt] = useState('');

  function goTo(v, opts = {}) {
    setView(v);
    setMsg(null);
    setConfirmReset(false);
    if ('sel' in opts) setSel(opts.sel);
    if ('lessonId' in opts) setLessonId(opts.lessonId);
  }

  function pickTicker(t) {
    setSel(t);
    setQuery('');
    setQty('');
    setMsg(null);
  }

  const rows = useMemo(() => (
    Object.entries(state.holdings).map(([t, h]) => {
      const q = mkt.getQuote(t);
      return q ? { t, shares: h.shares, cost: h.cost, q } : null;
    }).filter(Boolean)
  ), [state.holdings]);

  const invested = rows.reduce((a, r) => a + r.shares * r.q.price, 0);
  const total = invested + state.cash;
  const gain = total - state.startingAmount;
  const gainPct = gain / state.startingAmount * 100;

  const chart = useMemo(() => {
    if (rows.length === 0) return null;
    const days = 90;
    const spy = mkt.getSeries('SPY', days);
    const pf = [], sp = [];
    for (let i = 0; i < days; i++) {
      pf.push(state.cash + rows.reduce((a, r) => a + r.shares * mkt.getSeries(r.t, days)[i], 0));
      sp.push(state.startingAmount * spy[i] / spy[0]);
    }
    const min = Math.min(...pf, ...sp), max = Math.max(...pf, ...sp);
    const pfR = (pf[days - 1] / pf[0] - 1) * 100, spR = (sp[days - 1] / sp[0] - 1) * 100;
    const d = pfR - spR;
    return {
      pfPath: toPath(pf, min, max, 600, 200, 10),
      spyPath: toPath(sp, min, max, 600, 200, 10),
      maxFmt: fmt0(max),
      minFmt: fmt0(min),
      vs: { value: (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + ' pts', color: d >= 0 ? GREEN : RED }
    };
  }, [rows, state.cash, state.startingAmount]);

  const tips = useMemo(() => coachTips({
    holdings: state.holdings,
    cash: state.cash,
    startingAmount: state.startingAmount,
    transactions: state.transactions,
    quoteOf: t => mkt.getQuote(t)
  }), [state.holdings, state.cash, state.startingAmount, state.transactions]);

  const totalFmt = fmt(total), cashFmt = fmt(state.cash), investedFmt = fmt(invested);
  const startFmt = fmt0(state.startingAmount);
  const gainColor = gain > 0.005 ? GREEN : gain < -0.005 ? RED : MUT;
  const gainFmt = (gain >= 0 ? '+' : '−') + fmt(Math.abs(gain));
  const gainPctFmt = (gain >= 0 ? '+' : '−') + Math.abs(gainPct).toFixed(2) + '%';

  const pfRows = useMemo(() => rows.map(r => {
    const value = r.shares * r.q.price, g = value - r.cost, gp = g / r.cost * 100;
    return {
      t: r.t,
      name: r.q.n,
      shares: r.shares,
      sharesLabel: r.shares + (r.shares === 1 ? ' share' : ' shares'),
      avgFmt: fmt(r.cost / r.shares),
      priceFmt: fmt(r.q.price),
      valueFmt: fmt(value),
      gainFmt: (g >= 0 ? '+' : '−') + fmt(Math.abs(g)),
      gainPctFmt: (g >= 0 ? '+' : '−') + Math.abs(gp).toFixed(2) + '%',
      color: g >= 0 ? GREEN : RED
    };
  }).sort((a, b) => a.t < b.t ? -1 : 1), [rows]);

  const statCards = [
    { label: 'Cash', value: fmt0(state.cash) },
    { label: 'Invested', value: fmt0(invested) },
    { label: 'Positions', value: String(rows.length) },
    { label: 'vs S&P 500 (90d)', value: chart ? chart.vs.value : '—', color: chart ? chart.vs.color : MUT }
  ];

  const activeNav = NAV.find(n => n.id === view);
  const mobileTitle = activeNav?.label === 'Dashboard' ? 'Gild' : activeNav?.label;

  return (
    <div className="shell">
      <header className="topnav">
        <div className="brand"><Logo size={26} /><span>Gild</span></div>
        <nav className="nav-items">
          {NAV.map(n => (
            <button key={n.id} className={'nav-btn' + (view === n.id ? ' active' : '')} onClick={() => goTo(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="topnav-right">
          <span className="badge">SAMPLE DATA</span>
          <span className="total-value">{totalFmt}</span>
        </div>
      </header>

      <header className="mobilehead">
        <Logo size={24} />
        <span className="mobile-title">{mobileTitle}</span>
        <span className="total-value">{totalFmt}</span>
      </header>

      <main className="content">
        <div className="content-inner">
          {view === 'dashboard' && (
            <Dashboard
              totalFmt={totalFmt}
              gainFmt={gainFmt}
              gainColor={gainColor}
              gainPctFmt={gainPctFmt}
              startFmt={startFmt}
              chart={chart}
              statCards={statCards}
              pfRows={pfRows}
              onOpenHolding={t => { pickTicker(t); goTo('trade', { sel: t }); }}
              onGoTrade={() => goTo('trade')}
            />
          )}

          {view === 'trade' && (
            <Trade
              query={query}
              setQuery={q => { setQuery(q); setMsg(null); }}
              sel={sel}
              onPick={pickTicker}
              qty={qty}
              setQty={q => { setQty(q); setMsg(null); }}
              mode={mode}
              setMode={m => { setMode(m); setMsg(null); }}
              msg={msg}
              msgOk={msgOk}
              holdings={state.holdings}
              cash={state.cash}
              onTrade={(isBuy, ticker, n, price) => {
                const res = isBuy ? store.actions.buy(ticker, n, price) : store.actions.sell(ticker, n, price);
                setMsg(res.msg);
                setMsgOk(res.ok);
                if (res.ok) setQty('');
              }}
            />
          )}

          {view === 'portfolio' && (
            <Portfolio pfRows={pfRows} totalFmt={totalFmt} cashFmt={cashFmt} investedFmt={investedFmt} onGoTrade={() => goTo('trade')} />
          )}

          {view === 'coach' && (
            <Coach tips={tips} onGoLesson={id => goTo('learn', { lessonId: id })} />
          )}

          {view === 'learn' && (
            <Learn lessonId={lessonId} onToggle={id => setLessonId(prev => (prev === id ? null : id))} />
          )}

          {view === 'history' && <History transactions={state.transactions} />}

          {view === 'settings' && (
            <Settings
              startFmt={startFmt}
              startingAmount={state.startingAmount}
              settingsAmt={settingsAmt}
              setSettingsAmt={setSettingsAmt}
              onSave={() => {
                const v = parseFloat(settingsAmt);
                if (v > 0) { store.actions.setStarting(v); setSettingsAmt(''); }
              }}
              confirmReset={confirmReset}
              onResetClick={() => {
                if (confirmReset) {
                  store.actions.reset();
                  setConfirmReset(false);
                  setSel(null);
                  setQty('');
                  goTo('dashboard');
                } else {
                  setConfirmReset(true);
                }
              }}
            />
          )}
        </div>
      </main>

      <nav className="bottomnav">
        {NAV.map(n => (
          <button key={n.id} className={'bottomnav-btn' + (view === n.id ? ' active' : '')} onClick={() => goTo(n.id)}>
            <svg viewBox="0 0 24 24" width="21" height="21">
              <path d={n.icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{n.short}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
