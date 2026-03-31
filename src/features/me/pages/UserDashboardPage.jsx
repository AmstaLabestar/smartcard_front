import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchCardPlans } from '../../card-plans/api/card-plans.api';
import { fetchMyActiveCard, fetchMyCards } from '../api/me.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
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
    return <LoadingState title="Bienvenue chez SmartCard" description="Nous preparons votre accueil." />;
  }

  const hasWallet = cards.length > 0;
  const hasActiveCard = Boolean(activeCard);
  const needsActivation = hasWallet && !hasActiveCard && (activeCardError?.response?.status === 404 || !isActiveCardLoading);

  let homeTitle = 'Vos avantages, en un instant';
  let homeDescription = 'Choisissez une action pour continuer.';

  if (!hasWallet) {
    homeTitle = 'Commencez avec votre premiere carte';
    homeDescription = 'Explorez les cartes disponibles et composez votre portefeuille.';
  } else if (needsActivation) {
    homeTitle = 'Activez une carte pour commencer';
    homeDescription = 'Choisissez la formule a utiliser maintenant.';
  }

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Accueil"
          title={homeTitle}
          description={homeDescription}
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button" to={hasWallet ? '/my-cards' : '/card-plans'}>
                {hasWallet ? 'Mes cartes' : 'Explorer'}
              </Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/offers">
                Mes avantages
              </Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/card-plans">
                Catalogue
              </Link>
            </>
          )}
        />
      </section>

      <section className="premium-summary-grid premium-summary-grid-compact">
        <article className="metric-card premium-stat-card premium-stat-card-dark">
          <span className="meta-label">Portefeuille</span>
          <p className="metric-value">{cards.length}</p>
          <p className="muted">Cartes disponibles.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Carte active</span>
          <p className="metric-value">{hasActiveCard ? '1' : '0'}</p>
          <p className="muted">{hasActiveCard ? 'Une formule active.' : 'Aucune pour le moment.'}</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Avantages</span>
          <p className="metric-value">{activeOfferCount}</p>
          <p className="muted">Disponibles maintenant.</p>
        </article>
      </section>

      {!hasWallet ? (
        <section className="content-card premium-support-card">
          <EmptyState
            title="Votre portefeuille est vide"
            description="Choisissez votre premiere carte pour commencer."
          >
            <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
              <Link className="primary-button link-button premium-inline-button" to="/card-plans">
                Voir les cartes
              </Link>
            </div>
          </EmptyState>
        </section>
      ) : (
        <section className="premium-dual-grid">
          <article className="panel content-card premium-support-card">
            <div className="section-heading-row premium-section-heading-row">
              <div>
                <p className="eyebrow">Cartes</p>
                <h2>Gerer mon portefeuille</h2>
              </div>
            </div>
            <p className="muted">Activez, changez ou ajoutez une carte.</p>
            <div className="premium-link-stack">
              <Link className="secondary-link" to="/my-cards">Voir mes cartes</Link>
              <Link className="secondary-link" to="/card-plans">Explorer le catalogue</Link>
            </div>
          </article>

          <article className="panel content-card premium-support-card premium-support-card-accent">
            <div className="section-heading-row premium-section-heading-row">
              <div>
                <p className="eyebrow">Avantages</p>
                <h2>Voir ce qui est disponible</h2>
              </div>
            </div>
            <p className="muted">Accedez vite aux avantages de votre carte active.</p>
            <div className="premium-link-stack">
              <Link className="secondary-link" to="/offers">Mes avantages</Link>
              {!hasActiveCard ? <Link className="secondary-link" to="/my-cards">Activer une carte</Link> : null}
            </div>
          </article>
        </section>
      )}

      <section className="panel content-card premium-support-card premium-support-card-soft">
        <div className="section-heading-row premium-section-heading-row">
          <div>
            <p className="eyebrow">Raccourcis</p>
            <h2>Actions utiles</h2>
          </div>
        </div>
        <div className="premium-link-stack premium-link-stack-wide">
          <Link className="secondary-link" to="/my-cards">Gerer mes cartes</Link>
          <Link className="secondary-link" to="/offers">Voir mes avantages</Link>
          <Link className="secondary-link" to="/card-plans">Acheter une nouvelle carte</Link>
        </div>
      </section>
    </div>
  );
}
