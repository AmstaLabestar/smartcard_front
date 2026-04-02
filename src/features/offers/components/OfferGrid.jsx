import { memo, useState } from 'react';

const OfferCard = memo(function OfferCard({ offer, onOpen }) {
  return (
    <article className="offer-card user-offers-focus-card">
      <div className="user-offers-focus-top">
        <p className="user-offers-focus-discount">
          <span className="user-offers-focus-discount-label">REMISE</span>{' '}
          <span className="offer-value">{offer.discountValue}{offer.discountType === 'PERCENTAGE' ? '%' : ''}</span>
        </p>
        <span className="user-offers-focus-status">Active</span>
      </div>
      <div className="user-offers-focus-main">
        <h3>{offer.creator?.firstName} {offer.creator?.lastName}</h3>
      </div>
      <button
        type="button"
        className="primary-button alt-button user-offers-focus-button"
        onClick={() => onOpen(offer)}
      >
        Voir avantage
      </button>
    </article>
  );
});

export function OfferGrid({ offers }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const closeModal = () => setSelectedOffer(null);

  return (
    <>
      <div className="offer-grid user-offers-focus-grid">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onOpen={setSelectedOffer} />
        ))}
      </div>

      {selectedOffer ? (
        <div className="user-offers-modal-backdrop" onClick={closeModal} role="presentation">
          <div
            className="user-offers-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="user-offers-modal-head">
              <div>
                <p className="offer-value">
                  {selectedOffer.discountValue}
                  {selectedOffer.discountType === 'PERCENTAGE' ? '%' : ''}
                </p>
                <h3 id="offer-modal-title">{selectedOffer.title}</h3>
              </div>
              <button
                type="button"
                className="user-offers-modal-close"
                onClick={closeModal}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <p className="user-offers-modal-partner">
              {selectedOffer.creator?.firstName} {selectedOffer.creator?.lastName}
            </p>
            <p className="user-offers-modal-copy">
              {selectedOffer.description || 'Disponible avec votre carte active.'}
            </p>
            <small className="user-offers-modal-terms">
              {selectedOffer.terms || 'Conditions en caisse'}
            </small>
          </div>
        </div>
      ) : null}
    </>
  );
}
