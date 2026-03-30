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
    return <LoadingState title="Decouverte des cartes" description="Nous chargeons les cartes disponibles et leurs avantages." />;
  }

  return (
    <section className="panel content-card offers-page">
      <div className="offers-header">
        <div>
          <p className="eyebrow">Nos cartes</p>
          <h1>Trouvez la carte qui vous ouvre le plus d'avantages</h1>
        </div>
        <p className="muted">Choisissez le plan qui correspond a votre budget et a vos habitudes de consommation.</p>
      </div>
      {cardPlans.length === 0 ? (
        <EmptyState
          title="Aucune carte disponible pour le moment"
          description="Nous preparons de nouvelles cartes avec encore plus d'avantages partenaires."
        />
      ) : (
        <CardPlanGrid cardPlans={cardPlans} selectedCardPlanId={null} onSelect={() => {}} />
      )}
    </section>
  );
}
