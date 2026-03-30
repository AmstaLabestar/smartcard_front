export function MerchantOfferList({ offers, onStatusChange, isUpdating }) {
  return (
    <div className="list-stack">
      {offers.map((offer) => (
        <article key={offer.id} className="list-item merchant-offer-item">
          <div>
            <strong>{offer.title}</strong>
            <p className="muted">{offer.discountType} - {offer.discountValue}</p>
            <p className="muted">{offer.description || 'Sans description'}</p>
          </div>
          <div className="merchant-offer-actions">
            <span className={`status-pill status-${offer.status.toLowerCase()}`}>{offer.status}</span>
            <div className="inline-actions">
              <button type="button" onClick={() => onStatusChange(offer.id, 'ACTIVE')} disabled={isUpdating}>
                Activer
              </button>
              <button type="button" onClick={() => onStatusChange(offer.id, 'DRAFT')} disabled={isUpdating}>
                Draft
              </button>
              <button type="button" onClick={() => onStatusChange(offer.id, 'EXPIRED')} disabled={isUpdating}>
                Expirer
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
