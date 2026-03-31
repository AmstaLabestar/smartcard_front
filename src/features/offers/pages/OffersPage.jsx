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
    return <LoadingState title="Chargement de vos avantages" description="Nous preparons les offres disponibles avec votre carte active." />;
  }

  return (
    <section className="panel content-card offers-page">
      <div className="offers-header">
        <div>
          <p className="eyebrow">Vos avantages</p>
          <h1>Les meilleures offres debloquees avec votre carte active</h1>
        </div>
        <p className="muted">Cette selection suit la carte actuellement active dans votre portefeuille SmartCard.</p>
      </div>
      {offers.length === 0 ? (
        <EmptyState
          title="Aucune offre debloquee pour le moment"
          description="Activez la carte la plus adaptee a votre besoin ou choisissez une nouvelle formule pour acceder a davantage d avantages partenaires."
        />
      ) : (
        <OfferGrid offers={offers} />
      )}
    </section>
  );
}
