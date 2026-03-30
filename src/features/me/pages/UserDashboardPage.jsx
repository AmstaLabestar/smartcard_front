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
      toast.success('Votre carte est prete. Activez-la pour debloquer tous ses avantages.', 'Carte preparee');
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
    return <LoadingState title="Bienvenue chez SmartCard" description="Nous preparons votre carte, vos avantages et vos dernieres activites." />;
  }

  const hasNoCard = cardError?.response?.status === 404 || (!card && !isCardLoading);
  const showOnboarding = hasNoCard || card?.status === 'INACTIVE';

  return (
    <>
      <section className="panel content-card hero-card">
        <p className="eyebrow">Votre espace</p>
        <h1>Retrouvez votre carte et tous vos avantages en un coup d'oeil</h1>
        <p className="muted">Choisissez la carte qui vous ressemble, activez-la et profitez d'offres exclusives chez nos partenaires.</p>
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
          title="Aucune carte active pour le moment"
          description={cardError?.response?.data?.error?.message || 'Choisissez une carte et activez-la pour commencer a profiter de vos avantages.'}
        />
      )}

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Statut de votre carte</h3>
          <p className="metric-value">{card?.status || (showOnboarding ? 'En preparation' : 'Aucune')}</p>
          <p className="muted">Une carte active vous ouvre l'acces a toutes les offres incluses dans votre plan.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Votre formule</h3>
          <p className="metric-value">{card?.cardPlan?.name || 'Aucune'}</p>
          <p className="muted">Le plan choisi determine les avantages que vous pouvez utiliser chez nos partenaires.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Utilisations confirmees</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Retrouvez ici toutes vos utilisations validees en boutique.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Derniere economie</h3>
          <p className="metric-value">{transactions[0]?.discountAmount || '0'}</p>
          <p className="muted">Le montant economise lors de votre derniere utilisation de carte.</p>
        </article>
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
