import { useQuery } from '@tanstack/react-query';

import { fetchActiveOffers } from '../api/offers.api';
import { OfferGrid } from '../components/OfferGrid';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';

export function OffersPage() {
  const { data: offersResponse, isLoading } = useQuery({
    queryKey: ['offers', 'active'],
    queryFn: fetchActiveOffers,
  });

  const offers = offersResponse?.data || [];

  if (isLoading) {
    return <LoadingState title="Chargement des offres" />;
  }

  return (
    <section className="panel content-card offers-page">
      <div className="offers-header">
        <div>
          <p className="eyebrow">Offers</p>
          <h1>Offres actives disponibles</h1>
        </div>
        <p className="muted">Catalogue live branche sur l'endpoint backend /api/offers.</p>
      </div>
      {offers.length === 0 ? (
        <EmptyState
          title="Aucune offre active"
          description="Les merchants n'ont pas encore active d'offres visibles pour les users."
        />
      ) : (
        <OfferGrid offers={offers} />
      )}
    </section>
  );
}
