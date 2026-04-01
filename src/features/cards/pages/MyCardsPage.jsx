import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { activateOwnedCard } from '../api/cards.api';
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
    return <LoadingState title="Chargement de votre carte" description="Nous preparons votre carte." />;
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Aucune carte"
        description="Choisissez-en une dans le catalogue."
      >
        <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
          <Link className="primary-button link-button premium-inline-button ui-quick-button" to="/card-plans">
            Catalogue
          </Link>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="wallet-page premium-page-stack wallet-page-focused user-card-v2-page">
      {cards.length > 1 ? (
        <section className="panel content-card premium-support-card user-card-toggle-card">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Carte active</p>
              <h2>Choisir</h2>
            </div>
          </div>
          <div className="user-card-toggle-row" role="tablist" aria-label="Choix de carte active">
            {cards.map((card) => {
              const isActive = activeCard?.id === card.id;
              const isActivating = activateMutation.variables === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={isActive ? 'user-card-toggle user-card-toggle-active' : 'user-card-toggle'}
                  onClick={() => {
                    if (!isActive) {
                      activateMutation.mutate(card.id);
                    }
                  }}
                  disabled={isActive || isActivating}
                >
                  {isActivating ? 'Activation...' : card.cardPlan?.name || card.title}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {activeCard ? <UserCardPanel card={activeCard} /> : null}
    </div>
  );
}
