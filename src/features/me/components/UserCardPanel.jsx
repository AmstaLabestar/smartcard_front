export function UserCardPanel({ card }) {
  if (!card) return null;

  return (
    <section className="smart-card-panel">
      <div className="smart-card-surface">
        <div>
          <p className="eyebrow">Carte active</p>
          <h2>{card.title}</h2>
        </div>
        <div className="smart-card-meta">
          <span>{card.cardNumber}</span>
          <span className={`status-pill status-${card.status?.toLowerCase()}`}>{card.status}</span>
        </div>
        <div className="smart-card-qr">
          <p>QR Code</p>
          <code>{card.qrCode}</code>
        </div>
      </div>
      <article className="content-card compact-card">
        <h3>Informations</h3>
        <p className="muted">Activation : {card.activatedAt ? new Date(card.activatedAt).toLocaleString() : 'Non activee'}</p>
        <p className="muted">Prix : {card.price}</p>
      </article>
    </section>
  );
}
