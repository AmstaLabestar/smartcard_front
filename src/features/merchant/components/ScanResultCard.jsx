export function ScanResultCard({ preview, transaction }) {
  if (transaction) {
    return (
      <section className="content-card result-card scan-success-card premium-support-card">
        <p className="eyebrow">Validee</p>
        <h2>{transaction.offer?.title}</h2>
        <div className="cards-grid">
          <article className="metric-card premium-stat-card">
            <h3>Initial</h3>
            <p className="metric-value">{transaction.originalAmount}</p>
          </article>
          <article className="metric-card premium-stat-card">
            <h3>Remise</h3>
            <p className="metric-value">{transaction.discountAmount}</p>
          </article>
          <article className="metric-card premium-stat-card premium-stat-card-dark">
            <h3>Final</h3>
            <p className="metric-value">{transaction.amount}</p>
          </article>
        </div>
        <div className="purchase-result">
          <p><strong>Ref :</strong> {transaction.reference}</p>
          <p><strong>Client :</strong> {transaction.user?.firstName} {transaction.user?.lastName}</p>
          <p><strong>Carte :</strong> {transaction.card?.cardNumber}</p>
        </div>
      </section>
    );
  }

  if (preview) {
    return (
      <section className="content-card result-card scan-success-card premium-support-card premium-support-card-accent">
        <p className="eyebrow">Carte lue</p>
        <h2>{preview.customer?.firstName} {preview.customer?.lastName}</h2>
        <div className="cards-grid">
          <article className="metric-card premium-stat-card">
            <h3>Formule</h3>
            <p className="metric-value">{preview.card?.cardPlan?.name || preview.card?.title}</p>
          </article>
          <article className="metric-card premium-stat-card">
            <h3>Numero</h3>
            <p className="metric-value qr-preview">{preview.card?.cardNumber}</p>
          </article>
          <article className="metric-card premium-stat-card premium-stat-card-dark">
            <h3>Compatibles</h3>
            <p className="metric-value">{preview.eligibleOffers?.length || 0}</p>
          </article>
        </div>
        <div className="purchase-result">
          <p><strong>Client :</strong> {preview.customer?.firstName} {preview.customer?.lastName}</p>
          <p><strong>Formule :</strong> {preview.card?.cardPlan?.name || 'Carte SmartCard'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-card result-card scan-placeholder-card premium-support-card">
      <p className="eyebrow">Resultat</p>
      <h2>En attente</h2>
      <p className="muted">Scannez une carte pour commencer.</p>
    </section>
  );
}
