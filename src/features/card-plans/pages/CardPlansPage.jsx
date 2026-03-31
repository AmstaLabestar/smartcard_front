import { Link } from 'react-router-dom';
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
      toast.success(`Votre carte ${response.data.cardPlan?.name || ''} est ajoutee.`, 'Carte achetee');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['me', 'cards'] }),
        queryClient.invalidateQueries({ queryKey: ['me', 'cards', 'active'] }),
      ]);
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
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Catalogue"
          title="Choisissez votre prochaine carte"
          description="Chaque carte ouvre un reseau d avantages different."
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button" to="/my-cards">Mes cartes</Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/offers">Avantages</Link>
            </>
          )}
          aside={(
            <div className="premium-spotlight-card premium-spotlight-card-soft">
              <span className="meta-label">Disponibles</span>
              <strong>{availableCount}</strong>
              <p className="muted">Cartes a ajouter.</p>
            </div>
          )}
        />
      </section>

      <section className="panel content-card premium-support-card">
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
              isOwned ? (
                <span className="status-pill status-active">Deja ajoutee</span>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  disabled={purchaseMutation.isPending}
                  onClick={() => purchaseMutation.mutate({ cardPlanId: cardPlan.id })}
                >
                  {purchaseMutation.isPending && purchaseMutation.variables?.cardPlanId === cardPlan.id
                    ? 'Achat...'
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
