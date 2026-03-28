import { useEffect, useState } from 'react';

const ACTIVATION_STORAGE_KEY = 'smartcard_pending_activation_code';

export function CardOnboardingPanel({ onPurchase, onActivate, purchaseState, activationState, purchasedCard }) {
  const [activationCode, setActivationCode] = useState('');

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
      <h2>Obtenir puis activer votre carte</h2>
      <p className="muted">Sans carte active, le commercant ne peut pas scanner votre reduction.</p>
      <div className="onboarding-grid">
        <article className="metric-card">
          <h3>1. Acheter la carte</h3>
          <p className="muted">Le backend genere votre carte digitale, votre QR code et votre code d'activation.</p>
          <button className="primary-button" type="button" onClick={onPurchase} disabled={purchaseState.isPending}>
            {purchaseState.isPending ? 'Generation...' : 'Acheter ma carte'}
          </button>
        </article>
        <article className="metric-card">
          <h3>2. Activer la carte</h3>
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
