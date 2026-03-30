export function TransactionHistoryList({ transactions }) {
  return (
    <div className="list-stack transaction-history-list">
      {transactions.map((transaction) => (
        <article key={transaction.id} className="list-item transaction-history-item">
          <div className="transaction-main">
            <div>
              <strong>{transaction.offer?.title || 'Offre SmartCard'}</strong>
              <p className="muted">Reference: {transaction.reference}</p>
            </div>
            <span className="status-pill status-active">{transaction.status}</span>
          </div>
          <div className="transaction-meta-grid">
            <div>
              <span className="meta-label">Montant initial</span>
              <strong>{transaction.originalAmount}</strong>
            </div>
            <div>
              <span className="meta-label">Reduction</span>
              <strong>{transaction.discountAmount}</strong>
            </div>
            <div>
              <span className="meta-label">Montant final</span>
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
