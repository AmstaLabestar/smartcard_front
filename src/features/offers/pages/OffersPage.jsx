import { useQuery } from '@tanstack/react-query';

import { fetchActiveOffers } from '../api/offers.api';

export function OffersPage() {
  const { data: offersResponse } = useQuery({
    queryKey: ['offers', 'active'],
    queryFn: fetchActiveOffers,
  });

  const offers = offersResponse?.data || [];

  return (
    <section className="panel content-card">
      <p className="eyebrow">Offers</p>
      <h1>Offres disponibles</h1>
      {offers.length === 0 ? (
        <p className="muted">Aucune offre active pour le moment.</p>
      ) : (
        <div className="list-stack">
          {offers.map((offer) => (
            <article key={offer.id} className="list-item">
              <strong>{offer.title}</strong>
              <span>{offer.discountType} - {offer.discountValue}</span>
              <span>{offer.creator?.firstName} {offer.creator?.lastName}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
