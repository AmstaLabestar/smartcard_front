export function CardPlanGrid({
  cardPlans,
  selectedCardPlanId,
  onSelect,
  ownedPlanIds = new Set(),
  actionRenderer = null,
  selectionEnabled = true,
}) {
  return (
    <div className="card-plan-grid">
      {cardPlans.map((cardPlan) => {
        const isSelected = selectedCardPlanId === cardPlan.id;
        const isOwned = ownedPlanIds.has(cardPlan.id);
        const cardClassName = [
          'card-plan-card',
          isSelected ? 'card-plan-card-active' : '',
          isOwned ? 'card-plan-card-owned' : '',
        ].filter(Boolean).join(' ');

        const content = (
          <>
            <div className="card-plan-topline">
              <p className="eyebrow">{isOwned ? 'Dans vos cartes' : cardPlan.status}</p>
              <strong>{cardPlan.price}</strong>
            </div>
            <h3>{cardPlan.name}</h3>
            <p className="muted">{cardPlan.marketingHighlights || cardPlan.description || 'Carte SmartCard.'}</p>
            <p className="meta-label">{cardPlan.offers?.length || 0} avantages</p>
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
  );
}
