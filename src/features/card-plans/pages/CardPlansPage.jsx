import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchCardPlans } from '../api/card-plans.api';
import { fetchMyCards } from '../../me/api/me.api';
import { CardPlanGrid } from '../components/CardPlanGrid';
import { createPurchaseRequest, fetchMyPurchaseRequests } from '../../purchase-requests/api/purchase-requests.api';
import { CardGridSkeleton } from '../../../shared/components/states/CardGridSkeleton';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function CardPlansPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  const { data: cardPlansResponse, isLoading: isPlansLoading } = useQuery({
    queryKey: ['card-plans', 'public'],
    queryFn: fetchCardPlans,
  });

  const { data: myCardsResponse, isLoading: isCardsLoading } = useQuery({
    queryKey: ['me', 'cards'],
    queryFn: fetchMyCards,
  });

  const { data: purchaseRequestsResponse, isLoading: isRequestsLoading } = useQuery({
    queryKey: ['purchase-requests', 'me'],
    queryFn: () => fetchMyPurchaseRequests({ page: 1, limit: 100 }),
  });

  const purchaseRequestMutation = useMutation({
    mutationFn: createPurchaseRequest,
    onSuccess: async () => {
      toast.success('Votre demande a bien ete envoyee. Un admin va la valider apres paiement.', 'Demande envoyee');
      await queryClient.invalidateQueries({ queryKey: ['purchase-requests', 'me'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Impossible d envoyer cette demande'), 'Demande impossible');
    },
  });

  const cardPlans = cardPlansResponse?.data || [];
  const myCards = myCardsResponse?.data || [];
  const purchaseRequests = purchaseRequestsResponse?.data || [];
  const ownedPlanIds = new Set(myCards.map((card) => card.cardPlan?.id).filter(Boolean));
  const purchaseRequestStatusByPlanId = new Map();

  purchaseRequests.forEach((purchaseRequest) => {
    const cardPlanId = purchaseRequest.cardPlan?.id;

    if (!cardPlanId || purchaseRequestStatusByPlanId.has(cardPlanId)) {
      return;
    }

    purchaseRequestStatusByPlanId.set(cardPlanId, purchaseRequest.status);
  });

  const requestableCount = cardPlans.filter((cardPlan) => {
    if (ownedPlanIds.has(cardPlan.id)) {
      return false;
    }

    return purchaseRequestStatusByPlanId.get(cardPlan.id) !== 'PENDING';
  }).length;

  if (isPlansLoading || isCardsLoading || isRequestsLoading) {
    return (
      <div className="premium-page-stack user-catalog-v2-page">
        <section className="panel content-card premium-hero-card premium-hero-card-soft user-catalog-v2-hero">
          <PageIntro
            kicker="Catalogue"
            title="Choisissez une carte"
            description="Demandez une carte, puis reglez en cash."
            compact
          />
        </section>

        <section className="panel content-card premium-support-card user-catalog-v2-grid-shell">
          <CardGridSkeleton className="user-catalog-v2-grid" />
        </section>
      </div>
    );
  }

  return (
    <div className="premium-page-stack user-catalog-v2-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft user-catalog-v2-hero">
        <PageIntro
          kicker="Catalogue"
          title="Choisissez une carte"
          description="Demandez une carte, puis reglez en cash."
          compact
          aside={(
            <div className="premium-spotlight-card user-catalog-v2-spotlight">
              <span className="meta-label">Demandes</span>
              <strong>{requestableCount}</strong>
              <p className="muted">A envoyer.</p>
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
            purchaseRequestStatusByPlanId={purchaseRequestStatusByPlanId}
            selectionEnabled={false}
            actionRenderer={(cardPlan, { isOwned }) => {
              if (isOwned) {
                return null;
              }

              const requestStatus = purchaseRequestStatusByPlanId.get(cardPlan.id);

              if (requestStatus === 'PENDING') {
                return (
                  <button className="secondary-button ui-quick-button" type="button" disabled>
                    En attente
                  </button>
                );
              }

              if (requestStatus === 'APPROVED') {
                return (
                  <button
                    className="secondary-button ui-quick-button"
                    type="button"
                    onClick={() => navigate('/my-cards')}
                  >
                    Voir ma carte
                  </button>
                );
              }

              return (
                <button
                  className="primary-button ui-quick-button"
                  type="button"
                  disabled={purchaseRequestMutation.isPending}
                  onClick={() => purchaseRequestMutation.mutate({ cardPlanId: cardPlan.id })}
                >
                  {purchaseRequestMutation.isPending && purchaseRequestMutation.variables?.cardPlanId === cardPlan.id
                    ? 'Envoi...'
                    : requestStatus === 'REJECTED'
                      ? 'Redemander'
                      : 'Demander'}
                </button>
              );
            }}
          />
        )}
      </section>
    </div>
  );
}
