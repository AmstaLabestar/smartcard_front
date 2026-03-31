export function ScanResultCard({ preview, transaction }) {
  if (transaction) {
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

  if (preview) {
    return (
      <section className="content-card result-card scan-success-card">
        <p className="eyebrow">Carte verifiee</p>
        <h2>{preview.customer?.firstName} {preview.customer?.lastName}</h2>
        <div className="cards-grid">
          <article className="metric-card">
            <h3>Carte active</h3>
            <p className="metric-value">{preview.card?.cardPlan?.name || preview.card?.title}</p>
          </article>
          <article className="metric-card">
            <h3>Numero</h3>
            <p className="metric-value qr-preview">{preview.card?.cardNumber}</p>
          </article>
          <article className="metric-card">
            <h3>Offres compatibles</h3>
            <p className="metric-value">{preview.eligibleOffers?.length || 0}</p>
          </article>
        </div>
        <div className="purchase-result">
          <p><strong>Client :</strong> {preview.customer?.firstName} {preview.customer?.lastName}</p>
          <p><strong>Formule :</strong> {preview.card?.cardPlan?.name || 'Carte SmartCard'}</p>
          <p><strong>Avantages disponibles ici :</strong> {preview.eligibleOffers?.length || 0}</p>
          {preview.card?.qrCode ? <p><strong>QR scanne :</strong> {preview.card.qrCode}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="content-card result-card scan-placeholder-card">
      <p className="eyebrow">Resultat scan</p>
      <h2>En attente de verification</h2>
      <p className="muted">Scannez d abord la carte du client pour voir uniquement les reductions compatibles avec cette formule.</p>
    </section>
  );
}
