import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { activateOwnedCard } from '../api/cards.api';
import { OwnedCardGrid } from '../components/OwnedCardGrid';
import { UserCardPanel } from '../../me/components/UserCardPanel';
import { fetchMyActiveCard, fetchMyCards } from '../../me/api/me.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function MyCardsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: cardsResponse, isLoading: isCardsLoading } = useQuery({
    queryKey: ['me', 'cards'],
    queryFn: fetchMyCards,
  });

  const { data: activeCardResponse, isLoading: isActiveCardLoading } = useQuery({
    queryKey: ['me', 'cards', 'active'],
    queryFn: fetchMyActiveCard,
    retry: false,
  });

  const activateMutation = useMutation({
    mutationFn: activateOwnedCard,
    onSuccess: async () => {
      toast.success('Votre carte active a ete mise a jour.', 'Carte active');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me', 'cards'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'cards', 'active'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'card'] }),
        queryClient.invalidateQueries({ queryKey: ['offers', 'active'] }),
      ]);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Impossible d activer cette carte'), 'Activation impossible');
    },
  });

  const cards = cardsResponse?.data || [];
  const activeCard = activeCardResponse?.data || cards.find((card) => card.status === 'ACTIVE') || null;

  if (isCardsLoading || isActiveCardLoading) {
    return <LoadingState title="Chargement de votre portefeuille" description="Nous recuperons vos cartes." />;
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Votre portefeuille est vide"
        description="Choisissez une carte pour commencer."
      />
    );
  }

  return (
    <div className="wallet-page premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-user">
        <div className="premium-hero-copy">
          <p className="eyebrow">Mes cartes</p>
          <h1>Votre portefeuille</h1>
          <p className="muted premium-hero-lead">Une carte active, le reste a portee de main.</p>
          <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
            <Link className="primary-button link-button premium-inline-button" to="/card-plans">Nouvelle carte</Link>
            <Link className="primary-button alt-button link-button premium-inline-button" to="/offers">Avantages</Link>
          </div>
        </div>
        <div className="premium-hero-aside">
          <div className="premium-spotlight-card">
            <span className="meta-label">Active</span>
            <strong>{activeCard?.cardPlan?.name || 'Aucune'}</strong>
            <p className="muted">Vos avantages suivent celle-ci.</p>
          </div>
        </div>
      </section>

      {activeCard ? <UserCardPanel card={activeCard} /> : null}

      <section className="premium-summary-grid premium-summary-grid-compact">
        <article className="metric-card premium-stat-card premium-stat-card-dark">
          <span className="meta-label">Cartes</span>
          <p className="metric-value">{cards.length}</p>
          <p className="muted">Dans votre portefeuille.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Visible</span>
          <p className="metric-value">{activeCard?.cardPlan?.name || 'Aucune'}</p>
          <p className="muted">Presentee en caisse.</p>
        </article>
      </section>

      <section className="panel content-card wallet-section premium-support-card">
        <div className="section-heading-row premium-section-heading-row">
          <div>
            <p className="eyebrow">Portefeuille</p>
            <h2>Toutes vos cartes</h2>
          </div>
          <p className="muted">Choisissez-en une.</p>
        </div>
        <OwnedCardGrid cards={cards} onActivate={(cardId) => activateMutation.mutate(cardId)} activatingCardId={activateMutation.variables} />
      </section>
    </div>
  );
}
