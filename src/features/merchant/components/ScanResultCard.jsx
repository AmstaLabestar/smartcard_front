export function ScanResultCard({ transaction }) {
  if (!transaction) {
    return (
      <section className="content-card result-card scan-placeholder-card">
        <p className="eyebrow">Resultat scan</p>
        <h2>En attente de validation</h2>
        <p className="muted">Saisissez un QR code, choisissez une offre puis confirmez le montant initial pour voir la transaction ici.</p>
      </section>
    );
  }

  return (
    <section className="content-card result-card scan-success-card">
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
      <div className="purchase-result">
        <p><strong>Transaction :</strong> {transaction.reference}</p>
        <p><strong>Client :</strong> {transaction.user?.firstName} {transaction.user?.lastName}</p>
        <p><strong>Carte :</strong> {transaction.card?.cardNumber}</p>
      </div>
    </section>
  );
}
