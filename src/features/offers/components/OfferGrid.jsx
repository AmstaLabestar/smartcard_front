export function OfferGrid({ offers }) {
  return (
    <div className="offer-grid">
      {offers.map((offer) => (
        <article key={offer.id} className="offer-card">
          <div className="offer-topline">
            <p className="eyebrow">{offer.discountType === 'PERCENTAGE' ? 'Remise' : 'Avantage'}</p>
            <span className="status-pill status-active">{offer.status}</span>
          </div>
          <h3>{offer.title}</h3>
          <p className="offer-value">{offer.discountValue}{offer.discountType === 'PERCENTAGE' ? '%' : ''}</p>
          <p className="muted">{offer.description || 'Un avantage partenaire a activer directement en boutique.'}</p>
          <div className="offer-footer">
            <span className="offer-partner">{offer.creator?.firstName} {offer.creator?.lastName}</span>
            <small>{offer.terms || 'Voir conditions en caisse'}</small>
          </div>
        </article>
      ))}
    </div>
  );
}
