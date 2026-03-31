import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { purchaseCard, activateCard } from '../../cards/api/cards.api';
import { fetchCardPlans } from '../../card-plans/api/card-plans.api';
import { CardOnboardingPanel } from '../components/CardOnboardingPanel';
import { UserCardPanel } from '../components/UserCardPanel';
import { TransactionPreviewList } from '../components/TransactionPreviewList';
import { fetchMyActiveCard, fetchMyCards, fetchMyTransactions } from '../api/me.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function UserDashboardPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [purchaseError, setPurchaseError] = useState('');
  const [activationError, setActivationError] = useState('');
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState(null);

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
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
  } = useQuery({
    queryKey: ['me', 'transactions'],
    queryFn: fetchMyTransactions,
  });

  const {
    data: cardPlansResponse,
    isLoading: isCardPlansLoading,
  } = useQuery({
    queryKey: ['card-plans', 'public'],
    queryFn: fetchCardPlans,
  });

  const purchaseMutation = useMutation({
    mutationFn: purchaseCard,
    onSuccess: (response) => {
      setPurchaseError('');
      setPurchasedCard(response.data);
      toast.success('Votre nouvelle carte est prete.', 'Carte ajoutee');
      queryClient.invalidateQueries({ queryKey: ['me', 'cards'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'cards', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'card'] });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Achat impossible');
      setPurchaseError(message);
      toast.error(message, 'Achat impossible');
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateCard,
    onSuccess: async (_response, _code, context) => {
      setActivationError('');
      setActivationSuccess(true);
      toast.success('Votre carte est active.', 'Activation reussie');
      if (typeof context?.onSuccess === 'function') {
        context.onSuccess();
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me', 'cards'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'cards', 'active'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'card'] }),
        queryClient.invalidateQueries({ queryKey: ['offers', 'active'] }),
      ]);
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Activation impossible');
      setActivationSuccess(false);
      setActivationError(message);
      toast.error(message, 'Activation impossible');
    },
  });

  const activeCard = activeCardResponse?.data;
  const cards = cardsResponse?.data || [];
  const transactions = transactionsResponse?.data || [];
  const cardPlans = cardPlansResponse?.data || [];
  const ownedPlanIds = new Set(cards.map((card) => card.cardPlan?.id).filter(Boolean));
  const availablePlanCount = cardPlans.filter((cardPlan) => !ownedPlanIds.has(cardPlan.id)).length;
  const latestTransaction = transactions[0] || null;

  if (isActiveCardLoading || isCardsLoading || isCardPlansLoading) {
    return <LoadingState title="Bienvenue chez SmartCard" description="Nous preparons votre espace." />;
  }

  const hasWallet = cards.length > 0;
  const showOnboarding = !hasWallet;
  const shouldShowWalletAction = hasWallet && !activeCard && (activeCardError?.response?.status === 404 || (!activeCard && !isActiveCardLoading));

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-user">
        <div className="premium-hero-copy">
          <p className="eyebrow">Accueil</p>
          <h1>{activeCard ? 'Prete a scanner' : 'Choisissez votre carte'}</h1>
          <p className="muted premium-hero-lead">
            {activeCard ? 'Votre carte active suffit en caisse.' : 'Activez une formule et profitez de vos avantages.'}
          </p>
          <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
            <Link className="primary-button link-button premium-inline-button" to={activeCard ? '/my-cards' : '/card-plans'}>
              {activeCard ? 'Mes cartes' : 'Nos cartes'}
            </Link>
            <Link className="primary-button alt-button link-button premium-inline-button" to={activeCard ? '/offers' : '/card-plans'}>
              {activeCard ? 'Avantages' : 'Comparer'}
            </Link>
          </div>
        </div>
        <div className="premium-hero-aside">
          <div className="premium-spotlight-card">
            <span className="meta-label">Active</span>
            <strong>{activeCard?.cardPlan?.name || 'Aucune'}</strong>
            <p className="muted">Changez-la en un geste.</p>
          </div>
          <div className="premium-spotlight-card premium-spotlight-card-soft">
            <span className="meta-label">Avantages</span>
            <strong>{activeCard?.eligibleOffers?.length || activeCard?.cardPlan?.offers?.length || 0}</strong>
            <p className="muted">{availablePlanCount > 0 ? `${availablePlanCount} cartes a decouvrir.` : 'Catalogue ouvert.'}</p>
          </div>
        </div>
      </section>

      {showOnboarding ? (
        <CardOnboardingPanel
          cardPlans={cardPlans}
          purchasedCard={purchasedCard}
          purchaseState={{ isPending: purchaseMutation.isPending, error: purchaseError }}
          activationState={{ isPending: activateMutation.isPending, error: activationError, success: activationSuccess }}
          onPurchase={(cardPlanId) => {
            setActivationSuccess(false);
            purchaseMutation.mutate({ cardPlanId });
          }}
          onActivate={(code, done) => {
            setActivationSuccess(false);
            activateMutation.mutate(code, {
              onSuccess: () => {
                done();
                setPurchasedCard(null);
              },
            });
          }}
        />
      ) : activeCard ? (
        <UserCardPanel card={activeCard} />
      ) : shouldShowWalletAction ? (
        <section className="content-card wallet-empty-card premium-support-card">
          <EmptyState
            title="Activez une carte"
            description="Choisissez celle a utiliser maintenant."
          />
          <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
            <Link className="primary-button link-button premium-inline-button" to="/my-cards">
              Mes cartes
            </Link>
            <Link className="primary-button alt-button link-button premium-inline-button" to="/card-plans">
              Nouvelle carte
            </Link>
          </div>
        </section>
      ) : null}

      <section className="premium-summary-grid">
        <article className="metric-card premium-stat-card premium-stat-card-dark">
          <span className="meta-label">Cartes</span>
          <p className="metric-value">{cards.length}</p>
          <p className="muted">Dans votre portefeuille.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Dernier gain</span>
          <p className="metric-value">{latestTransaction?.discountAmount || '0'}</p>
          <p className="muted">Votre derniere economie.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">A decouvrir</span>
          <p className="metric-value">{availablePlanCount}</p>
          <p className="muted">Cartes disponibles.</p>
        </article>
      </section>

      <section className="premium-dual-grid">
        <article className="panel content-card premium-support-card">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Portefeuille</p>
              <h2>Vos cartes</h2>
            </div>
          </div>
          <p className="muted">Activez la bonne carte.</p>
          <div className="premium-link-stack">
            <Link className="secondary-link" to="/my-cards">Voir mes cartes</Link>
            <Link className="secondary-link" to="/card-plans">Acheter une carte</Link>
          </div>
        </article>

        <article className="panel content-card premium-support-card premium-support-card-accent">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Avantages</p>
              <h2>Utilisables maintenant</h2>
            </div>
          </div>
          <p className="muted">Seulement l essentiel.</p>
          <Link className="secondary-link" to="/offers">Voir mes avantages</Link>
        </article>
      </section>

      <section className="panel content-card premium-transaction-section">
        <div className="section-heading-row premium-section-heading-row">
          <div>
            <p className="eyebrow">Historique</p>
            <h2>Derniers passages</h2>
          </div>
          <Link className="secondary-link" to="/transactions">Tout voir</Link>
        </div>
        {isTransactionsLoading ? (
          <p className="muted">Chargement...</p>
        ) : transactions.length === 0 ? (
          <p className="muted">Vos passages apparaitront ici.</p>
        ) : (
          <TransactionPreviewList transactions={transactions.slice(0, 4)} />
        )}
      </section>
    </div>
  );
}
