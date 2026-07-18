// Shared client-side store with localStorage persistence.
// Swap this module for a real backend (e.g. Supabase) to go live — the action API stays the same.
const KEY = 'gild-state-v1';
const DEFAULT = { setup: false, startingAmount: 100000, cash: 0, holdings: {}, transactions: [] };

function load() {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

let state = Object.assign({}, DEFAULT, load() || {});
const subs = new Set();

function commit(next) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  subs.forEach(f => f());
}

function fmt(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export const store = {
  get: () => state,
  subscribe(f) { subs.add(f); return () => subs.delete(f); },
  actions: {
    completeSetup(amount) {
      amount = Math.max(100, Math.min(10000000, Math.round(amount) || 100000));
      commit({ ...DEFAULT, setup: true, startingAmount: amount, cash: amount });
    },
    buy(ticker, shares, price) {
      shares = Math.floor(shares);
      if (!(shares > 0)) return { ok: false, msg: 'Enter how many whole shares you’d like to buy.' };
      const cost = shares * price;
      if (cost > state.cash) return { ok: false, msg: `That would cost ${fmt(cost)}, but you have ${fmt(state.cash)} in cash. Try fewer shares.` };
      const h = state.holdings[ticker] || { shares: 0, cost: 0 };
      const holdings = { ...state.holdings, [ticker]: { shares: h.shares + shares, cost: h.cost + cost } };
      const transactions = [{ type: 'buy', ticker, shares, price, ts: Date.now() }, ...state.transactions];
      commit({ ...state, cash: state.cash - cost, holdings, transactions });
      return { ok: true, msg: `Bought ${shares} share${shares > 1 ? 's' : ''} of ${ticker} for ${fmt(cost)}.` };
    },
    sell(ticker, shares, price) {
      shares = Math.floor(shares);
      if (!(shares > 0)) return { ok: false, msg: 'Enter how many whole shares you’d like to sell.' };
      const h = state.holdings[ticker];
      if (!h || h.shares < shares) return { ok: false, msg: `You own ${h ? h.shares : 0} share${h && h.shares === 1 ? '' : 's'} of ${ticker} — you can’t sell ${shares}.` };
      const proceeds = shares * price;
      const remaining = h.shares - shares;
      const holdings = { ...state.holdings };
      if (remaining === 0) delete holdings[ticker];
      else holdings[ticker] = { shares: remaining, cost: h.cost * (remaining / h.shares) };
      const transactions = [{ type: 'sell', ticker, shares, price, ts: Date.now() }, ...state.transactions];
      commit({ ...state, cash: state.cash + proceeds, holdings, transactions });
      return { ok: true, msg: `Sold ${shares} share${shares > 1 ? 's' : ''} of ${ticker} for ${fmt(proceeds)}.` };
    },
    setStarting(amount) {
      amount = Math.max(100, Math.min(10000000, Math.round(amount) || state.startingAmount));
      const delta = amount - state.startingAmount;
      commit({ ...state, startingAmount: amount, cash: Math.max(0, state.cash + delta) });
    },
    reset() { commit({ ...DEFAULT }); }
  }
};
