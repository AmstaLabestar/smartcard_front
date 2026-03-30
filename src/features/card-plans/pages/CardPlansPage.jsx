import { useQuery } from '@tanstack/react-query';

import { fetchCardPlans } from '../api/card-plans.api';
import { CardPlanGrid } from '../components/CardPlanGrid';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';

export function CardPlansPage() {
  const { data: cardPlansResponse, isLoading } = useQuery({
    queryKey: ['card-plans', 'public'],
    queryFn: fetchCardPlans,
  });

  const cardPlans = cardPlansResponse?.data || [];

  if (isLoading) {
    return <LoadingState title="Chargement des cartes" description="Nous recuperons les cartes commerciales actuellement disponibles." />;
  }

  return (
    <section className="panel content-card offers-page">
      <div className="offers-header">
        <div>
          <p className="eyebrow">Card Plans</p>
          <h1>Choisissez la carte qui vous correspond</h1>
        </div>
        <p className="muted">Chaque carte donne acces a un ensemble d'avantages differents.</p>
      </div>
      {cardPlans.length === 0 ? (
        <EmptyState
          title="Aucune carte disponible"
          description="Aucune carte commerciale active n'est disponible pour le moment."
        />
      ) : (
        <CardPlanGrid cardPlans={cardPlans} selectedCardPlanId={null} onSelect={() => {}} />
      )}
    </section>
  );
}
