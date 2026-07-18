import { fmt } from '../lib/format';

const GREEN = '#2FC97C', RED = '#F35B5B';

export default function History({ transactions }) {
  return (
    <div>
      <h1 className="view-title">History</h1>

      {transactions.length === 0 && (
        <div className="empty-state" style={{ marginTop: 18 }}>
          <div className="title">No transactions yet</div>
          <div className="desc">Every buy and sell will be logged here.</div>
        </div>
      )}

      <div className="txn-list">
        {transactions.map(tx => (
          <div className="txn-row" key={tx.ts + tx.ticker}>
            <span
              className="txn-badge"
              style={{
                color: tx.type === 'buy' ? GREEN : RED,
                background: tx.type === 'buy' ? 'rgba(47,201,124,0.12)' : 'rgba(243,91,91,0.12)'
              }}
            >
              {tx.type.toUpperCase()}
            </span>
            <span className="txn-body">
              <b>{tx.ticker}</b>
              <span className="sep"> · {tx.shares + (tx.shares === 1 ? ' share' : ' shares')} @ {fmt(tx.price)}</span>
            </span>
            <span className="txn-total">{fmt(tx.shares * tx.price)}</span>
            <span className="txn-when">
              {new Date(tx.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
