import { useQueries } from '@tanstack/react-query';

import { fetchAdminCards, fetchAdminMerchants, fetchAdminOffers, fetchAdminUsers } from '../api/admin.api';

export function AdminDashboardPage() {
  const results = useQueries({
    queries: [
      { queryKey: ['admin', 'users'], queryFn: fetchAdminUsers },
      { queryKey: ['admin', 'merchants'], queryFn: fetchAdminMerchants },
      { queryKey: ['admin', 'cards'], queryFn: fetchAdminCards },
      { queryKey: ['admin', 'offers'], queryFn: fetchAdminOffers },
    ],
  });

  const users = results[0].data?.data || [];
  const merchants = results[1].data?.data || [];
  const cards = results[2].data?.data || [];
  const offers = results[3].data?.data || [];

  return (
    <>
      <section className="panel content-card">
        <p className="eyebrow">Admin</p>
        <h1>Back-office V1</h1>
        <p className="muted">Ce dashboard consomme deja les listings admin du backend.</p>
      </section>
      <section className="cards-grid">
        <article className="metric-card">
          <h3>Users</h3>
          <p className="metric-value">{users.length}</p>
        </article>
        <article className="metric-card">
          <h3>Merchants</h3>
          <p className="metric-value">{merchants.length}</p>
        </article>
        <article className="metric-card">
          <h3>Cards</h3>
          <p className="metric-value">{cards.length}</p>
        </article>
        <article className="metric-card">
          <h3>Offers</h3>
          <p className="metric-value">{offers.length}</p>
        </article>
      </section>
    </>
  );
}
