import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchCardPlans } from '../../card-plans/api/card-plans.api';
import { fetchMyActiveCard, fetchMyCards } from '../api/me.api';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function UserDashboardPage() {
  const {
    data: activeCardResponse,
    isLoading: isActiveCardLoading,
    error: activeCardError,
  } = useQuery({
    queryKey: ['me', 'cards', 'active'],
    queryFn: fetchMyActiveCard,
    retry: false,
  });

  const {
    data: cardsResponse,
    isLoading: isCardsLoading,
  } = useQuery({
    queryKey: ['me', 'cards'],
    queryFn: fetchMyCards,
  });

  const {
    data: cardPlansResponse,
    isLoading: isCardPlansLoading,
  } = useQuery({
    queryKey: ['card-plans', 'public'],
    queryFn: fetchCardPlans,
  });

  const activeCard = activeCardResponse?.data;
  const cards = cardsResponse?.data || [];
  const cardPlans = cardPlansResponse?.data || [];
  const ownedPlanIds = new Set(cards.map((card) => card.cardPlan?.id).filter(Boolean));
  const availablePlanCount = cardPlans.filter((cardPlan) => !ownedPlanIds.has(cardPlan.id)).length;
  const activeOfferCount = activeCard?.eligibleOffers?.length || activeCard?.cardPlan?.offers?.length || 0;

  if (isActiveCardLoading || isCardsLoading || isCardPlansLoading) {
    return <LoadingState title="Accueil SmartCard" description="Chargement..." />;
  }

  const hasWallet = cards.length > 0;
  const hasActiveCard = Boolean(activeCard);
  const needsActivation = hasWallet && !hasActiveCard && (activeCardError?.response?.status === 404 || !isActiveCardLoading);

  let title = 'Vos avantages, sans detour';
  let description = 'Choisissez une action.';
  let primaryLabel = 'Ma carte';
  let primaryTo = '/my-cards';
  let secondaryLabel = 'Mes offres';
  let secondaryTo = '/offers';

  if (!hasWallet) {
    title = 'Commencez simplement';
    description = 'Choisissez votre premiere carte.';
    primaryLabel = 'Catalogue';
    primaryTo = '/card-plans';
  } else if (needsActivation) {
    title = 'Activez une carte';
    description = 'Choisissez celle a utiliser.';
    primaryLabel = 'Activer';
    primaryTo = '/my-cards';
  }

  return (
    <div className="premium-page-stack user-home-v2-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft user-home-v2-hero">
        <PageIntro
          kicker="Accueil"
          title={title}
          description={description}
          compact
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button ui-quick-button" to={primaryTo}>
                {primaryLabel}
              </Link>
              <Link className="primary-button alt-button link-button premium-inline-button ui-quick-button" to={secondaryTo}>
                {secondaryLabel}
              </Link>
              <Link className="primary-button alt-button link-button premium-inline-button ui-quick-button" to="/card-plans">
                Catalogue
              </Link>
            </>
          )}
        />
      </section>

      <section className="ui-stat-strip user-home-v2-stats" aria-label="Resume du compte">
        <article className="ui-stat-pill">
          <span className="meta-label">Cartes</span>
          <strong>{cards.length}</strong>
        </article>
        <article className="ui-stat-pill">
          <span className="meta-label">Active</span>
          <strong>{hasActiveCard ? 'Oui' : 'Non'}</strong>
        </article>
        <article className="ui-stat-pill">
          <span className="meta-label">Offres</span>
          <strong>{activeOfferCount}</strong>
        </article>
      </section>

      {!hasWallet ? (
        <section className="panel content-card premium-support-card ui-screen-block user-home-v2-section">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Depart</p>
              <h2>Votre premiere carte</h2>
            </div>
          </div>
          <p className="muted">Le catalogue vous attend.</p>
        </section>
      ) : needsActivation ? (
        <section className="panel content-card premium-support-card ui-screen-block user-home-v2-section">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Activation</p>
              <h2>Choisissez la bonne carte</h2>
            </div>
          </div>
          <p className="muted">Activez-la depuis votre page carte.</p>
        </section>
      ) : (
        <section className="premium-dual-grid user-home-v2-grid">
          <article className="panel content-card premium-support-card ui-screen-block user-home-v2-card">
            <div className="section-heading-row premium-section-heading-row">
              <div>
                <p className="eyebrow">Carte</p>
                <h2>Presentez la bonne</h2>
              </div>
            </div>
            <p className="muted">Votre carte active est prete.</p>
          </article>

          <article className="panel content-card premium-support-card premium-support-card-accent ui-screen-block user-home-v2-card">
            <div className="section-heading-row premium-section-heading-row">
              <div>
                <p className="eyebrow">Offres</p>
                <h2>Utilisez vos avantages</h2>
              </div>
            </div>
            <p className="muted">Consultez ce qui est disponible.</p>
          </article>
        </section>
      )}

      {availablePlanCount > 0 ? (
        <section className="panel content-card premium-support-card premium-support-card-soft ui-screen-block user-home-v2-section">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2>{availablePlanCount} carte{availablePlanCount > 1 ? 's' : ''} a decouvrir</h2>
            </div>
          </div>
          <p className="muted">De nouvelles formules sont disponibles.</p>
        </section>
      ) : null}
    </div>
  );
}
