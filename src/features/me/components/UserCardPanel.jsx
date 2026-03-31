import { QRCodeDisplay } from '../../../shared/components/qr/QRCodeDisplay';

export function UserCardPanel({ card }) {
  if (!card) return null;

  return (
    <section className="smart-card-panel">
      <div className="smart-card-surface smart-card-surface-premium">
        <div>
          <p className="eyebrow">Carte active</p>
          <h2>{card.title}</h2>
          {card.cardPlan?.marketingHighlights ? <p className="smart-card-tagline">{card.cardPlan.marketingHighlights}</p> : null}
        </div>
        <div className="smart-card-meta">
          <span>{card.cardNumber}</span>
          <span className={`status-pill status-${card.status?.toLowerCase()}`}>{card.status}</span>
        </div>
        <div className="smart-card-qr smart-card-qr-visual">
          <div>
            <p>Presentez simplement votre QR code en caisse</p>
            <p className="muted smart-card-helper">Le partenaire scanne votre carte et retrouve automatiquement vos reductions disponibles.</p>
          </div>
          <QRCodeDisplay value={card.qrCode} title={`Carte ${card.cardNumber}`} showValue={false} className="smart-card-qr-display" />
        </div>
      </div>
      <article className="content-card compact-card card-detail-card">
        <h3>Votre formule</h3>
        <p className="muted">Activation : {card.activatedAt ? new Date(card.activatedAt).toLocaleString() : 'En attente d activation'}</p>
        <p className="muted">Prix : {card.price}</p>
        {card.cardPlan?.name ? <p className="muted">Plan : {card.cardPlan.name}</p> : null}
        {card.eligibleOffers ? <p className="muted">Avantages inclus : {card.eligibleOffers.length}</p> : card.cardPlan?.offers ? <p className="muted">Avantages inclus : {card.cardPlan.offers.length}</p> : null}
        <QRCodeDisplay value={card.qrCode} title={`Valeur QR ${card.cardNumber}`} size={120} className="smart-card-inline-qr" />
      </article>
    </section>
  );
}
