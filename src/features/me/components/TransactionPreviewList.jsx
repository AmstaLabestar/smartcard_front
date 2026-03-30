export function TransactionPreviewList({ transactions }) {
  return (
    <div className="list-stack">
      {transactions.map((transaction) => (
        <article key={transaction.id} className="list-item transaction-item">
          <div>
            <strong>{transaction.offer?.title || 'Offre'}</strong>
            <p className="muted">Ref: {transaction.reference}</p>
          </div>
          <div className="transaction-values">
            <span>Initial: {transaction.originalAmount}</span>
            <span>Reduction: {transaction.discountAmount}</span>
            <span>A payer: {transaction.amount}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
