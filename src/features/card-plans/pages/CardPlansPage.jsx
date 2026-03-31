import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { purchaseCard } from '../../cards/api/cards.api';
import { fetchCardPlans } from '../api/card-plans.api';
import { fetchMyCards } from '../../me/api/me.api';
import { CardPlanGrid } from '../components/CardPlanGrid';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

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
      toast.success(`Votre nouvelle carte ${response.data.cardPlan?.name || ''} a bien ete ajoutee a votre portefeuille.`, 'Carte achetee');
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

  if (isPlansLoading || isCardsLoading) {
    return <LoadingState title="Decouverte des cartes" description="Nous chargeons les cartes disponibles et les formules deja presentes dans votre portefeuille." />;
  }

  return (
    <section className="panel content-card offers-page">
      <div className="offers-header">
        <div>
          <p className="eyebrow">Nos cartes</p>
          <h1>Trouvez la carte qui vous ouvre le plus d'avantages</h1>
        </div>
        <p className="muted">Composez votre portefeuille librement : chaque carte donne acces a un reseau d avantages different.</p>
      </div>
      {cardPlans.length === 0 ? (
        <EmptyState
          title="Aucune carte disponible pour le moment"
          description="Nous preparons de nouvelles cartes avec encore plus d'avantages partenaires."
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
              <span className="status-pill status-active">Deja possedee</span>
            ) : (
              <button
                className="primary-button"
                type="button"
                disabled={purchaseMutation.isPending}
                onClick={() => purchaseMutation.mutate({ cardPlanId: cardPlan.id })}
              >
                {purchaseMutation.isPending && purchaseMutation.variables?.cardPlanId === cardPlan.id
                  ? 'Achat en cours...'
                  : 'Acheter cette carte'}
              </button>
            )
          )}
        />
      )}
    </section>
  );
}
