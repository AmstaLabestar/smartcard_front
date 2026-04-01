import { useState } from 'react';

export function CardPlanGrid({
  cardPlans,
  selectedCardPlanId,
  onSelect,
  ownedPlanIds = new Set(),
  actionRenderer = null,
  selectionEnabled = true,
}) {
  const [expandedCardId, setExpandedCardId] = useState(null);

  return (
    <div className="card-plan-grid user-catalog-v2-grid">
      {cardPlans.map((cardPlan) => {
        const isSelected = selectedCardPlanId === cardPlan.id;
        const isOwned = ownedPlanIds.has(cardPlan.id);
        const isExpanded = expandedCardId === cardPlan.id;
        const cardClassName = [
          'card-plan-card',
          'user-catalog-v2-card',
          isExpanded ? 'user-catalog-v2-card-expanded' : '',
          isSelected ? 'card-plan-card-active' : '',
          isOwned ? 'card-plan-card-owned' : '',
        ].filter(Boolean).join(' ');

        const detail = cardPlan.marketingHighlights || cardPlan.description || 'Carte SmartCard.';

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
                  setExpandedCardId((current) => (current === cardPlan.id ? null : cardPlan.id));
                }}
              >
                {isExpanded ? 'Masquer' : 'Voir'}
              </button>
            </div>
            {isExpanded ? (
              <div className="user-catalog-v2-detail">
                <p className="muted">{detail}</p>
              </div>
            ) : null}
            {actionRenderer ? <div className="card-plan-actions">{actionRenderer(cardPlan, { isOwned, isSelected })}</div> : null}
          </>
        );

        if (!selectionEnabled) {
          return (
            <article
              key={cardPlan.id}
              className={cardClassName}
              onClick={() => setExpandedCardId((current) => (current === cardPlan.id ? null : cardPlan.id))}
            >
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
  );
}
