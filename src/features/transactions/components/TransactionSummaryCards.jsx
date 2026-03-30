export function TransactionSummaryCards({ transactions }) {
  const totalTransactions = transactions.length;
  const totalSaved = transactions.reduce((sum, transaction) => sum + Number(transaction.discountAmount || 0), 0);
  const totalSpent = transactions.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return (
    <section className="cards-grid">
      <article className="metric-card highlight-card">
        <h3>Transactions</h3>
        <p className="metric-value">{totalTransactions}</p>
        <p className="muted">Nombre total de passages confirms chez les commerçants.</p>
      </article>
      <article className="metric-card highlight-card">
        <h3>Total economise</h3>
        <p className="metric-value">{totalSaved.toFixed(2)}</p>
        <p className="muted">Somme des reductions appliquees grace a la carte.</p>
      </article>
      <article className="metric-card highlight-card">
        <h3>Total paye</h3>
        <p className="metric-value">{totalSpent.toFixed(2)}</p>
        <p className="muted">Montant final reellement regle apres reduction.</p>
      </article>
    </section>
  );
}
