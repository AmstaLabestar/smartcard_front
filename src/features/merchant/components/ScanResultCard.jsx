export function ScanResultCard({ transaction }) {
  if (!transaction) return null;

  return (
    <section className="content-card result-card">
      <p className="eyebrow">Transaction creee</p>
      <h2>{transaction.offer?.title}</h2>
      <div className="cards-grid">
        <article className="metric-card">
          <h3>Montant initial</h3>
          <p className="metric-value">{transaction.originalAmount}</p>
        </article>
        <article className="metric-card">
          <h3>Reduction</h3>
          <p className="metric-value">{transaction.discountAmount}</p>
        </article>
        <article className="metric-card">
          <h3>A payer</h3>
          <p className="metric-value">{transaction.amount}</p>
        </article>
      </div>
      <p className="muted">Ref transaction : {transaction.reference}</p>
    </section>
  );
}
