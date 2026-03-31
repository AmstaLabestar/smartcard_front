import { QRCodeDisplay } from '../../../shared/components/qr/QRCodeDisplay';

export function OwnedCardGrid({ cards, onActivate, activatingCardId }) {
  return (
    <div className="owned-card-grid">
      {cards.map((card) => {
        const isActive = card.status === 'ACTIVE';
        const isActivating = activatingCardId === card.id;
        const eligibleOffersCount = card.eligibleOffers?.length || card.cardPlan?.offers?.length || 0;

        return (
          <article key={card.id} className={isActive ? 'owned-card-item owned-card-item-active' : 'owned-card-item'}>
            <div className="owned-card-item-topline">
              <p className="eyebrow">{isActive ? 'Active' : 'Disponible'}</p>
              <span className={`status-pill status-${card.status?.toLowerCase()}`}>{card.status}</span>
            </div>
            <h3>{card.cardPlan?.name || card.title}</h3>
            <div className="owned-card-meta-grid owned-card-meta-grid-compact">
              <div>
                <span className="meta-label">Numero</span>
                <strong>{card.cardNumber}</strong>
              </div>
              <div>
                <span className="meta-label">Avantages</span>
                <strong>{eligibleOffersCount}</strong>
              </div>
            </div>
            {isActive ? (
              <div className="owned-card-qr-preview owned-card-qr-preview-visual owned-card-qr-preview-inline">
                <span className="meta-label">QR</span>
                <QRCodeDisplay value={card.qrCode} title={`QR ${card.cardNumber}`} size={132} showValue={false} className="owned-card-qr-display" />
              </div>
            ) : null}
            <button
              className={isActive ? 'primary-button alt-button' : 'primary-button'}
              type="button"
              disabled={isActive || isActivating}
              onClick={() => onActivate(card.id)}
            >
              {isActive ? 'Active' : isActivating ? 'Activation...' : 'Activer'}
            </button>
          </article>
        );
      })}
    </div>
  );
}
