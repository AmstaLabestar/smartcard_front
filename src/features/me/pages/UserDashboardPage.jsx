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
      toast.success('Votre nouvelle carte est prete. Activez-la depuis votre portefeuille pour debloquer ses avantages.', 'Carte ajoutee');
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
      toast.success('Votre carte est active. Vos avantages sont maintenant disponibles.', 'Activation reussie');
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

  if (isActiveCardLoading || isCardsLoading || isCardPlansLoading) {
    return <LoadingState title="Bienvenue chez SmartCard" description="Nous preparons votre portefeuille, votre carte active et vos dernieres activites." />;
  }

  const hasWallet = cards.length > 0;
  const showOnboarding = !hasWallet;
  const shouldShowWalletAction = hasWallet && !activeCard && (activeCardError?.response?.status === 404 || (!activeCard && !isActiveCardLoading));

  return (
    <>
      <section className="panel content-card hero-card">
        <p className="eyebrow">Votre espace</p>
        <h1>Retrouvez la carte active qui ouvre vos meilleurs avantages</h1>
        <p className="muted">Activez la formule qui vous correspond, gardez votre portefeuille sous la main et profitez d offres exclusives chez nos partenaires.</p>
        <div className="inline-actions top-actions">
          <Link className="primary-button link-button" to="/card-plans">Acheter une nouvelle carte</Link>
          {hasWallet ? <Link className="primary-button alt-button link-button" to="/my-cards">Gerer mes cartes</Link> : null}
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
        <section className="content-card wallet-empty-card">
          <EmptyState
            title="Aucune carte active pour le moment"
            description="Vous avez deja des cartes dans votre portefeuille. Activez celle de votre choix pour debloquer les offres correspondantes."
          />
          <div className="inline-actions">
            <Link className="primary-button link-button" to="/my-cards">
              Gerer mes cartes
            </Link>
            <Link className="primary-button alt-button link-button" to="/card-plans">
              Acheter une nouvelle carte
            </Link>
          </div>
        </section>
      ) : null}

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Cartes dans votre portefeuille</h3>
          <p className="metric-value">{cards.length}</p>
          <p className="muted">Gardez plusieurs formules a portee de main et activez celle qui correspond a votre prochain achat.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Votre formule active</h3>
          <p className="metric-value">{activeCard?.cardPlan?.name || 'Aucune'}</p>
          <p className="muted">C est elle qui determine les offres visibles et utilisables en ce moment.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Autres cartes disponibles</h3>
          <p className="metric-value">{availablePlanCount}</p>
          <p className="muted">Explorez d autres formules pour acceder a de nouveaux reseaux de partenaires et enrichir votre portefeuille.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Derniere economie</h3>
          <p className="metric-value">{transactions[0]?.discountAmount || '0'}</p>
          <p className="muted">Le montant economise lors de votre derniere utilisation de carte.</p>
        </article>
      </section>

      <section className="panel content-card dashboard-wallet-summary">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Portefeuille</p>
            <h2>Votre collection SmartCard</h2>
          </div>
          <Link className="secondary-link" to="/my-cards">Voir toutes mes cartes</Link>
        </div>
        <p className="muted">
          {hasWallet
            ? 'Ajoutez une nouvelle carte quand vous voulez acceder a d autres avantages partenaires, puis activez celle qui correspond a votre prochain besoin.'
            : 'Commencez par choisir votre premiere carte pour ouvrir votre portefeuille SmartCard.'}
        </p>
      </section>

      <section className="panel content-card">
        <h2>Vos dernieres transactions</h2>
        {isTransactionsLoading ? (
          <p className="muted">Nous recuperons vos dernieres transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="muted">Vos prochaines economies apparaitront ici des votre premiere utilisation.</p>
        ) : (
          <TransactionPreviewList transactions={transactions.slice(0, 5)} />
        )}
      </section>
    </>
  );
}
