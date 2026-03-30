import { useQuery } from '@tanstack/react-query';

import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { fetchMerchantTransactions } from '../../transactions/api/transactions.api';

export function MerchantDashboardPage() {
  const { data: offersResponse } = useQuery({
    queryKey: ['merchant', 'offers'],
    queryFn: fetchMerchantOffers,
  });

  const { data: transactionsResponse } = useQuery({
    queryKey: ['merchant', 'transactions'],
    queryFn: fetchMerchantTransactions,
  });

  const offers = offersResponse?.data || [];
  const transactions = transactionsResponse?.data || [];

  return (
    <>
      <section className="panel content-card">
        <p className="eyebrow">Merchant</p>
        <h1>Dashboard commercant</h1>
        <p className="muted">Ce dashboard lit deja les offres et transactions du merchant connecte.</p>
      </section>
      <section className="cards-grid">
        <article className="metric-card">
          <h3>Mes offres</h3>
          <p className="metric-value">{offers.length}</p>
          <p className="muted">Offres creees depuis le backend.</p>
        </article>
        <article className="metric-card">
          <h3>Transactions</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Transactions liees a vos offres.</p>
        </article>
      </section>
      <section className="panel content-card">
        <h2>Dernieres offres</h2>
        {offers.length === 0 ? (
          <p className="muted">Aucune offre creee pour le moment.</p>
        ) : (
          <div className="list-stack">
            {offers.slice(0, 5).map((offer) => (
              <article key={offer.id} className="list-item">
                <strong>{offer.title}</strong>
                <span>{offer.discountType} - {offer.discountValue}</span>
                <span>{offer.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
