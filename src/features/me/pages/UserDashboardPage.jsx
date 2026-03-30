import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { purchaseCard, activateCard } from '../../cards/api/cards.api';
import { fetchCardPlans } from '../../card-plans/api/card-plans.api';
import { CardOnboardingPanel } from '../components/CardOnboardingPanel';
import { UserCardPanel } from '../components/UserCardPanel';
import { TransactionPreviewList } from '../components/TransactionPreviewList';
import { fetchMyCard, fetchMyTransactions } from '../api/me.api';
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
    data: cardResponse,
    isLoading: isCardLoading,
    error: cardError,
  } = useQuery({
    queryKey: ['me', 'card'],
    queryFn: fetchMyCard,
    retry: false,
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
      toast.success('Votre carte a bien ete generee. Activez-la pour afficher votre QR.', 'Carte prete');
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
      toast.success('Votre carte est maintenant active et prete a etre scannee.', 'Carte activee');
      if (typeof context?.onSuccess === 'function') {
        context.onSuccess();
      }
      await queryClient.invalidateQueries({ queryKey: ['me', 'card'] });
      await queryClient.invalidateQueries({ queryKey: ['offers', 'active'] });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Activation impossible');
      setActivationSuccess(false);
      setActivationError(message);
      toast.error(message, 'Activation impossible');
    },
  });

  const card = cardResponse?.data;
  const transactions = transactionsResponse?.data || [];
  const cardPlans = cardPlansResponse?.data || [];

  if (isCardLoading || isCardPlansLoading) {
    return <LoadingState title="Chargement de votre espace" description="Nous recuperons votre carte, vos dernieres activites et les cartes disponibles." />;
  }

  const hasNoCard = cardError?.response?.status === 404 || (!card && !isCardLoading);
  const showOnboarding = hasNoCard || card?.status === 'INACTIVE';

  return (
    <>
      <section className="panel content-card hero-card">
        <p className="eyebrow">User Dashboard</p>
        <h1>Bienvenue dans votre espace SmartCard</h1>
        <p className="muted">Choisissez une carte, activez-la et accedez ensuite uniquement aux avantages inclus dans votre plan.</p>
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
                queryClient.invalidateQueries({ queryKey: ['me', 'card'] });
              },
            });
          }}
        />
      ) : card ? (
        <UserCardPanel card={card} />
      ) : (
        <EmptyState
          title="Aucune carte liee a ce compte"
          description={cardError?.response?.data?.error?.message || 'Achetez puis activez votre carte pour commencer a profiter des reductions.'}
        />
      )}

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Statut de la carte</h3>
          <p className="metric-value">{card?.status || (showOnboarding ? 'En attente' : 'Aucune')}</p>
          <p className="muted">Un user doit avoir une carte active pour etre scanne chez un merchant.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Carte choisie</h3>
          <p className="metric-value">{card?.cardPlan?.name || 'Aucune'}</p>
          <p className="muted">Le plan achete determine les offres visibles et utilisables.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Total transactions</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Toutes vos utilisations confirmees chez les commerçants.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Derniere reduction</h3>
          <p className="metric-value">{transactions[0]?.discountAmount || '0'}</p>
          <p className="muted">Montant economise sur la transaction la plus recente.</p>
        </article>
      </section>

      <section className="panel content-card">
        <h2>Dernieres transactions</h2>
        {isTransactionsLoading ? (
          <p className="muted">Chargement des transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="muted">Aucune transaction pour le moment.</p>
        ) : (
          <TransactionPreviewList transactions={transactions.slice(0, 5)} />
        )}
      </section>
    </>
  );
}
