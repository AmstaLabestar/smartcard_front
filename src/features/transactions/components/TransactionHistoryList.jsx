export function TransactionHistoryList({ transactions }) {
  return (
    <div className="list-stack transaction-history-list">
      {transactions.map((transaction) => (
        <article key={transaction.id} className="list-item transaction-history-item premium-history-item">
          <div className="transaction-main">
            <div>
              <strong>{transaction.offer?.title || 'Offre SmartCard'}</strong>
              <p className="muted">Ref. {transaction.reference}</p>
            </div>
            <span className="status-pill status-active">{transaction.status}</span>
          </div>
          <div className="transaction-meta-grid premium-transaction-meta-grid">
            <div>
              <span className="meta-label">Initial</span>
              <strong>{transaction.originalAmount}</strong>
            </div>
            <div>
              <span className="meta-label">Remise</span>
              <strong>{transaction.discountAmount}</strong>
            </div>
            <div>
              <span className="meta-label">Final</span>
              <strong>{transaction.amount}</strong>
            </div>
            <div>
              <span className="meta-label">Date</span>
              <strong>{new Date(transaction.createdAt).toLocaleString()}</strong>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
