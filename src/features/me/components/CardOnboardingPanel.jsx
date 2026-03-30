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
      <p className="eyebrow">Votre parcours</p>
      <h2>Choisissez votre carte et activez vos avantages</h2>
      <p className="muted">Chaque carte donne acces a une selection d'offres exclusives. Une fois activee, elle devient votre passeport reduction chez nos partenaires.</p>

      <div>
        <h3>1. Choisir votre carte</h3>
        <CardPlanGrid cardPlans={cardPlans} selectedCardPlanId={selectedCardPlanId} onSelect={setSelectedCardPlanId} />
      </div>

      <div className="onboarding-grid">
        <article className="metric-card">
          <h3>2. Finaliser votre achat</h3>
          <p className="muted">
            {selectedCardPlan
              ? `Vous allez activer ${selectedCardPlan.name} et profiter de ses avantages pour ${selectedCardPlan.price}.`
              : 'Selectionnez une carte pour decouvrir ses avantages et finaliser votre achat.'}
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={() => onPurchase(selectedCardPlanId)}
            disabled={purchaseState.isPending || !selectedCardPlanId}
          >
            {purchaseState.isPending ? 'Preparation de votre carte...' : 'Acheter cette carte'}
          </button>
        </article>
        <article className="metric-card">
          <h3>3. Activer votre carte</h3>
          <p className="muted">Saisissez votre code d'activation pour debloquer votre QR code et commencer a profiter de vos reductions.</p>
          <form className="stack-form" onSubmit={handleActivate}>
            <input
              type="text"
              placeholder="Code d'activation"
              value={activationCode}
              onChange={(event) => setActivationCode(event.target.value)}
            />
            <button className="primary-button" type="submit" disabled={activationState.isPending || !activationCode}>
              {activationState.isPending ? 'Activation en cours...' : 'Activer ma carte'}
            </button>
          </form>
        </article>
      </div>

      {selectedCardPlan ? (
        <div className="purchase-result">
          <p><strong>Carte selectionnee :</strong> {selectedCardPlan.name}</p>
          <p><strong>Prix :</strong> {selectedCardPlan.price}</p>
          <p><strong>Avantages inclus :</strong> {selectedCardPlan.offers?.length || 0} offres partenaires</p>
        </div>
      ) : null}

      {purchasedCard ? (
        <div className="purchase-result">
          <p><strong>Votre carte est prete :</strong> {purchasedCard.cardNumber}</p>
          <p><strong>Code d'activation :</strong> {purchasedCard.activationCode}</p>
          <p><strong>Reference :</strong> {purchasedCard.purchaseReference}</p>
        </div>
      ) : null}
      {purchaseState.error ? <p className="error-banner">{purchaseState.error}</p> : null}
      {activationState.error ? <p className="error-banner">{activationState.error}</p> : null}
      {activationState.success ? <p className="success-banner">Votre carte est active. Vous pouvez maintenant profiter de vos avantages.</p> : null}
    </section>
  );
}
