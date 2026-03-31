export function TransactionSummaryCards({ transactions }) {
  const totalTransactions = transactions.length;
  const totalSaved = transactions.reduce((sum, transaction) => sum + Number(transaction.discountAmount || 0), 0);
  const totalSpent = transactions.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return (
    <section className="premium-summary-grid premium-summary-grid-compact">
      <article className="metric-card premium-stat-card premium-stat-card-dark">
        <span className="meta-label">Passages</span>
        <p className="metric-value">{totalTransactions}</p>
        <p className="muted">Transactions enregistrees.</p>
      </article>
      <article className="metric-card premium-stat-card">
        <span className="meta-label">Economise</span>
        <p className="metric-value">{totalSaved.toFixed(2)}</p>
        <p className="muted">Grace a vos cartes.</p>
      </article>
      <article className="metric-card premium-stat-card">
        <span className="meta-label">Paye</span>
        <p className="metric-value">{totalSpent.toFixed(2)}</p>
        <p className="muted">Montant final.</p>
      </article>
    </section>
  );
}
