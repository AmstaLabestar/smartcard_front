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
          <h1>Vos avantages disponibles</h1>
        </div>
        <p className="muted">Cette liste est maintenant filtree selon la carte que vous avez achetee.</p>
      </div>
      {offers.length === 0 ? (
        <EmptyState
          title="Aucune offre disponible pour votre carte"
          description="Activez une carte ou choisissez un autre plan pour debloquer plus d'avantages."
        />
      ) : (
        <OfferGrid offers={offers} />
      )}
    </section>
  );
}
