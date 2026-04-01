import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { purchaseCard } from '../../cards/api/cards.api';
import { fetchCardPlans } from '../api/card-plans.api';
import { fetchMyCards } from '../../me/api/me.api';
import { CardPlanGrid } from '../components/CardPlanGrid';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function CardPlansPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: cardPlansResponse, isLoading: isPlansLoading } = useQuery({
    queryKey: ['card-plans', 'public'],
    queryFn: fetchCardPlans,
  });

  const { data: myCardsResponse, isLoading: isCardsLoading } = useQuery({
    queryKey: ['me', 'cards'],
    queryFn: fetchMyCards,
  });

  const purchaseMutation = useMutation({
    mutationFn: purchaseCard,
    onSuccess: async (response) => {
      toast.success(`Votre carte ${response.data.cardPlan?.name || ''} est ajoutee et activee.`, 'Carte prete');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me', 'cards'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'cards', 'active'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'card'] }),
        queryClient.invalidateQueries({ queryKey: ['offers', 'active'] }),
      ]);
      navigate('/my-cards');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Impossible d acheter cette carte'), 'Achat impossible');
    },
  });

  const cardPlans = cardPlansResponse?.data || [];
  const myCards = myCardsResponse?.data || [];
  const ownedPlanIds = new Set(myCards.map((card) => card.cardPlan?.id).filter(Boolean));
  const availableCount = cardPlans.filter((cardPlan) => !ownedPlanIds.has(cardPlan.id)).length;

  if (isPlansLoading || isCardsLoading) {
    return <LoadingState title="Catalogue" description="Nous chargeons les cartes disponibles." />;
  }

  return (
    <div className="premium-page-stack user-catalog-v2-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft user-catalog-v2-hero">
        <PageIntro
          kicker="Catalogue"
          title="Choisissez une carte"
          description="Simple et rapide."
          compact
          aside={(
            <div className="premium-spotlight-card user-catalog-v2-spotlight">
              <span className="meta-label">Disponibles</span>
              <strong>{availableCount}</strong>
              <p className="muted">A ajouter.</p>
            </div>
          )}
        />
      </section>

      <section className="panel content-card premium-support-card user-catalog-v2-grid-shell">
        {cardPlans.length === 0 ? (
          <EmptyState
            title="Aucune carte disponible"
            description="De nouvelles cartes arrivent bientot."
          />
        ) : (
          <CardPlanGrid
            cardPlans={cardPlans}
            selectedCardPlanId={null}
            onSelect={() => {}}
            ownedPlanIds={ownedPlanIds}
            selectionEnabled={false}
            actionRenderer={(cardPlan, { isOwned }) => (
              isOwned ? null : (
                <button
                  className="primary-button ui-quick-button"
                  type="button"
                  disabled={purchaseMutation.isPending}
                  onClick={() => purchaseMutation.mutate({ cardPlanId: cardPlan.id })}
                >
                  {purchaseMutation.isPending && purchaseMutation.variables?.cardPlanId === cardPlan.id
                    ? 'Ajout...'
                    : 'Ajouter'}
                </button>
              )
            )}
          />
        )}
      </section>
    </div>
  );
}

