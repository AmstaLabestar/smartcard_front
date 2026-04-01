import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

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
    return <LoadingState title="Chargement de vos avantages" description="Nous preparons votre selection." />;
  }

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <div className="premium-hero-copy premium-hero-copy-wide">
          <p className="eyebrow">Avantages</p>
          <h1>Disponibles maintenant</h1>
          <p className="muted premium-hero-lead">Seulement ce que votre carte active debloque.</p>
          <div className="inline-actions premium-hero-actions premium-hero-actions-compact">
            <Link className="primary-button link-button premium-inline-button" to="/my-cards">Mes cartes</Link>
            <Link className="primary-button alt-button link-button premium-inline-button" to="/card-plans">Nouvelle carte</Link>
          </div>
        </div>
      </section>

      <section className="panel content-card offers-page premium-support-card user-offers-focus-shell">
        <div className="section-heading-row premium-section-heading-row user-offers-focus-heading">
          <div>
            <p className="eyebrow">Selection</p>
            <h2>Vos avantages</h2>
          </div>
          <p className="muted">{offers.length} offre{offers.length > 1 ? 's' : ''}</p>
        </div>
        {offers.length === 0 ? (
          <EmptyState
            title="Aucune offre"
            description="Activez une autre carte."
          />
        ) : (
          <OfferGrid offers={offers} />
        )}
      </section>
    </div>
  );
}
