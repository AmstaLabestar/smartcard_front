import { memo, useMemo, useState } from 'react';

function formatDiscount(offer) {
  return `REMISE ${offer.discountValue}${offer.discountType === 'PERCENTAGE' ? '%' : ''}`;
}

function getNextStatus(status) {
  if (status === 'ACTIVE') return 'DRAFT';
  return 'ACTIVE';
}

function getStatusActionLabel(status, isUpdating) {
  if (isUpdating) return '...';
  return status === 'ACTIVE' ? 'Pause' : 'Activer';
}

const MerchantOfferCard = memo(function MerchantOfferCard({ offer, isUpdating, onOpen, onStatusChange }) {
  const nextStatus = getNextStatus(offer.status);

  return (
    <article className="merchant-offers-v2-card">
      <div className="merchant-offers-v2-top">
        <strong className="merchant-offers-v2-discount">{formatDiscount(offer)}</strong>
        <span className="merchant-offers-v2-status">
          {offer.status === 'ACTIVE' ? 'Active' : offer.status === 'DRAFT' ? 'Inactive' : 'Expiree'}
        </span>
      </div>

      <div className="merchant-offers-v2-meta">
        <small>{offer.terms || 'Conditions en caisse'}</small>
      </div>

      <div className="merchant-offers-v2-actions">
        <button
          type="button"
          className="primary-button alt-button merchant-offers-v2-button"
          onClick={() => onOpen(offer)}
        >
          Voir
        </button>
        <button
          type="button"
          className="primary-button merchant-offers-v2-button"
          onClick={() => onStatusChange(offer.id, nextStatus)}
          disabled={isUpdating}
        >
          {getStatusActionLabel(offer.status, isUpdating)}
        </button>
      </div>
    </article>
  );
});

export function MerchantOfferList({ offers, onStatusChange, isUpdating }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const orderedOffers = useMemo(
    () => [...offers].sort((a, b) => (a.status === 'ACTIVE' ? -1 : 1) - (b.status === 'ACTIVE' ? -1 : 1)),
    [offers],
  );

  return (
    <>
      <div className="merchant-offers-v2-grid">
        {orderedOffers.map((offer) => (
          <MerchantOfferCard
            key={offer.id}
            offer={offer}
            isUpdating={isUpdating}
            onOpen={setSelectedOffer}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {selectedOffer ? (
        <div
          className="merchant-offers-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedOffer(null)}
        >
          <article
            className="merchant-offers-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="merchant-offer-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="merchant-offers-modal-head">
              <div>
                <p className="eyebrow">Offre</p>
                <h3 id="merchant-offer-modal-title">{selectedOffer.title}</h3>
              </div>
              <button
                type="button"
                className="merchant-offers-modal-close"
                onClick={() => setSelectedOffer(null)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <p className="merchant-offers-modal-discount">{formatDiscount(selectedOffer)}</p>
            <p className="merchant-offers-modal-status">
              {selectedOffer.status === 'ACTIVE' ? 'Active' : selectedOffer.status === 'DRAFT' ? 'Inactive' : 'Expiree'}
            </p>
            <p className="merchant-offers-modal-copy">{selectedOffer.description || 'Offre sans description.'}</p>
            <small className="merchant-offers-modal-terms">{selectedOffer.terms || 'Conditions en caisse.'}</small>

            <div className="merchant-offers-modal-actions">
              <button
                type="button"
                className="primary-button alt-button merchant-offers-v2-button"
                onClick={() => setSelectedOffer(null)}
              >
                Fermer
              </button>
              <button
                type="button"
                className="primary-button merchant-offers-v2-button"
                onClick={() => {
                  onStatusChange(selectedOffer.id, getNextStatus(selectedOffer.status));
                  setSelectedOffer(null);
                }}
                disabled={isUpdating}
              >
                {selectedOffer.status === 'ACTIVE' ? 'Pause' : 'Activer'}
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
