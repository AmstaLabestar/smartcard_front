export function CardPlanGrid({ cardPlans, selectedCardPlanId, onSelect }) {
  return (
    <div className="card-plan-grid">
      {cardPlans.map((cardPlan) => {
        const isSelected = selectedCardPlanId === cardPlan.id;

        return (
          <button
            key={cardPlan.id}
            type="button"
            className={isSelected ? 'card-plan-card card-plan-card-active' : 'card-plan-card'}
            onClick={() => onSelect(cardPlan.id)}
          >
            <div className="card-plan-topline">
              <p className="eyebrow">{cardPlan.status}</p>
              <strong>{cardPlan.price}</strong>
            </div>
            <h3>{cardPlan.name}</h3>
            <p className="muted">{cardPlan.description || 'Carte commerciale SmartCard.'}</p>
            {cardPlan.marketingHighlights ? <p className="card-plan-highlights">{cardPlan.marketingHighlights}</p> : null}
            <p className="muted">{cardPlan.offers?.length || 0} avantages inclus</p>
          </button>
        );
      })}
    </div>
  );
}
