import { useState } from 'react';

export function CardPlanGrid({
  cardPlans,
  selectedCardPlanId,
  onSelect,
  ownedPlanIds = new Set(),
  actionRenderer = null,
  selectionEnabled = true,
}) {
  const [selectedCardPlan, setSelectedCardPlan] = useState(null);

  return (
    <>
      <div className="card-plan-grid user-catalog-v2-grid">
        {cardPlans.map((cardPlan) => {
          const isSelected = selectedCardPlanId === cardPlan.id;
          const isOwned = ownedPlanIds.has(cardPlan.id);
          const cardClassName = [
            'card-plan-card',
            'user-catalog-v2-card',
            isSelected ? 'card-plan-card-active' : '',
            isOwned ? 'card-plan-card-owned' : '',
          ].filter(Boolean).join(' ');

          const content = (
            <>
              <div className="card-plan-topline">
                <p className="eyebrow">{isOwned ? 'Ajoutee' : 'Disponible'}</p>
                <strong>{cardPlan.price}</strong>
              </div>
              <h3>{cardPlan.name}</h3>
              <div className="user-catalog-v2-summary">
                <span className={isOwned ? 'status-pill status-active' : 'status-pill status-inactive'}>
                  {isOwned ? 'Deja ajoutee' : 'A ajouter'}
                </span>
                <button
                  className="user-catalog-v2-detail-toggle"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedCardPlan(cardPlan);
                  }}
                >
                  Voir
                </button>
              </div>
              {actionRenderer ? <div className="card-plan-actions">{actionRenderer(cardPlan, { isOwned, isSelected })}</div> : null}
            </>
          );

          if (!selectionEnabled) {
            return (
              <article key={cardPlan.id} className={cardClassName}>
                {content}
              </article>
            );
          }

          return (
            <button
              key={cardPlan.id}
              type="button"
              className={cardClassName}
              onClick={() => onSelect(cardPlan.id)}
            >
              {content}
            </button>
          );
        })}
      </div>

      {selectedCardPlan ? (
        <div className="user-catalog-modal-backdrop" onClick={() => setSelectedCardPlan(null)} role="presentation">
          <div
            className="user-catalog-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-plan-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="user-catalog-modal-head">
              <div>
                <p className="eyebrow">{selectedCardPlan.price}</p>
                <h3 id="card-plan-modal-title">{selectedCardPlan.name}</h3>
              </div>
              <button
                type="button"
                className="user-catalog-modal-close"
                onClick={() => setSelectedCardPlan(null)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <p className="user-catalog-modal-copy">
              {selectedCardPlan.marketingHighlights || selectedCardPlan.description || 'Carte SmartCard.'}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
