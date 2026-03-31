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
import { PageIntro } from '../../../shared/ui/PageIntro';

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
  const activeOfferCount = activeCard?.eligibleOffers?.length || activeCard?.cardPlan?.offers?.length || 0;

  if (isCardsLoading || isActiveCardLoading) {
    return <LoadingState title="Chargement de votre portefeuille" description="Nous recuperons vos cartes." />;
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Votre portefeuille est vide"
        description="Choisissez une carte pour commencer."
      >
        <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
          <Link className="primary-button link-button premium-inline-button" to="/card-plans">
            Voir le catalogue
          </Link>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="wallet-page premium-page-stack wallet-page-focused">
      <section className="panel content-card premium-hero-card premium-hero-card-soft wallet-hero-card">
        <PageIntro
          kicker="Mes cartes"
          title="Votre carte active, prete en caisse"
          description="Presentez-la, ou activez-en une autre en un geste."
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button" to="/offers">Mes avantages</Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/card-plans">Nouvelle carte</Link>
            </>
          )}
          aside={(
            <div className="premium-hero-aside wallet-hero-aside">
              <div className="premium-spotlight-card">
                <span className="meta-label">Active</span>
                <strong>{activeCard?.cardPlan?.name || 'Aucune'}</strong>
                <p className="muted">Celle affichee en caisse.</p>
              </div>
              <div className="premium-spotlight-card premium-spotlight-card-soft">
                <span className="meta-label">Avantages</span>
                <strong>{activeOfferCount}</strong>
                <p className="muted">Disponibles maintenant.</p>
              </div>
            </div>
          )}
        />
      </section>

      {activeCard ? <UserCardPanel card={activeCard} /> : null}

      <section className="panel content-card wallet-section premium-support-card wallet-grid-section">
        <div className="section-heading-row premium-section-heading-row">
          <div>
            <p className="eyebrow">Portefeuille</p>
            <h2>Autres cartes</h2>
          </div>
          <p className="muted">Choisissez celle a activer.</p>
        </div>
        <OwnedCardGrid cards={cards} onActivate={(cardId) => activateMutation.mutate(cardId)} activatingCardId={activateMutation.variables} />
      </section>
    </div>
  );
}
