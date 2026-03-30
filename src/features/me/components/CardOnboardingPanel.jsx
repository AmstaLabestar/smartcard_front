import { useEffect, useMemo, useState } from 'react';

import { CardPlanGrid } from '../../card-plans/components/CardPlanGrid';

const ACTIVATION_STORAGE_KEY = 'smartcard_pending_activation_code';

export function CardOnboardingPanel({
  cardPlans,
  onPurchase,
  onActivate,
  purchaseState,
  activationState,
  purchasedCard,
}) {
  const [activationCode, setActivationCode] = useState('');
  const [selectedCardPlanId, setSelectedCardPlanId] = useState('');

  useEffect(() => {
    const savedCode = sessionStorage.getItem(ACTIVATION_STORAGE_KEY);

    if (savedCode) {
      setActivationCode(savedCode);
    }
  }, []);

  useEffect(() => {
    const nextCode = purchasedCard?.activationCode || '';

    if (nextCode) {
      sessionStorage.setItem(ACTIVATION_STORAGE_KEY, nextCode);
      setActivationCode(nextCode);
    }
  }, [purchasedCard]);

  useEffect(() => {
    if (!selectedCardPlanId && cardPlans.length > 0) {
      setSelectedCardPlanId(cardPlans[0].id);
    }
  }, [cardPlans, selectedCardPlanId]);

  const selectedCardPlan = useMemo(
    () => cardPlans.find((cardPlan) => cardPlan.id === selectedCardPlanId) || null,
    [cardPlans, selectedCardPlanId],
  );

  const handleActivate = (event) => {
    event.preventDefault();

    if (!activationCode) {
      return;
    }

    onActivate(activationCode, () => {
      sessionStorage.removeItem(ACTIVATION_STORAGE_KEY);
      setActivationCode('');
    });
  };

  return (
    <section className="content-card onboarding-card">
      <p className="eyebrow">Carte requise</p>
      <h2>Choisissez, achetez puis activez votre carte</h2>
      <p className="muted">Chaque carte donne acces a un ensemble d'avantages different. Sans carte active, le commercant ne peut pas scanner votre reduction.</p>

      <div>
        <h3>1. Choisir votre carte</h3>
        <CardPlanGrid cardPlans={cardPlans} selectedCardPlanId={selectedCardPlanId} onSelect={setSelectedCardPlanId} />
      </div>

      <div className="onboarding-grid">
        <article className="metric-card">
          <h3>2. Acheter la carte</h3>
          <p className="muted">
            {selectedCardPlan
              ? `Vous allez acheter ${selectedCardPlan.name} pour ${selectedCardPlan.price}.`
              : 'Selectionnez une carte commerciale pour continuer.'}
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={() => onPurchase(selectedCardPlanId)}
            disabled={purchaseState.isPending || !selectedCardPlanId}
          >
            {purchaseState.isPending ? 'Generation...' : 'Acheter cette carte'}
          </button>
        </article>
        <article className="metric-card">
          <h3>3. Activer la carte</h3>
          <p className="muted">Collez votre code d'activation puis activez la carte pour afficher le QR.</p>
          <form className="stack-form" onSubmit={handleActivate}>
            <input
              type="text"
              placeholder="Code d'activation"
              value={activationCode}
              onChange={(event) => setActivationCode(event.target.value)}
            />
            <button className="primary-button" type="submit" disabled={activationState.isPending || !activationCode}>
              {activationState.isPending ? 'Activation...' : 'Activer ma carte'}
            </button>
          </form>
        </article>
      </div>

      {selectedCardPlan ? (
        <div className="purchase-result">
          <p><strong>Carte choisie :</strong> {selectedCardPlan.name}</p>
          <p><strong>Prix :</strong> {selectedCardPlan.price}</p>
          <p><strong>Avantages :</strong> {selectedCardPlan.offers?.length || 0} offres incluses</p>
        </div>
      ) : null}

      {purchasedCard ? (
        <div className="purchase-result">
          <p><strong>Carte generee :</strong> {purchasedCard.cardNumber}</p>
          <p><strong>Code activation :</strong> {purchasedCard.activationCode}</p>
          <p><strong>Reference achat :</strong> {purchasedCard.purchaseReference}</p>
        </div>
      ) : null}
      {purchaseState.error ? <p className="error-banner">{purchaseState.error}</p> : null}
      {activationState.error ? <p className="error-banner">{activationState.error}</p> : null}
      {activationState.success ? <p className="success-banner">Carte activee avec succes.</p> : null}
    </section>
  );
}
