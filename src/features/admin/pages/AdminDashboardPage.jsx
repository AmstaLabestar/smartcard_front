import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import {
  fetchAdminCardPlans,
  fetchAdminCards,
  fetchAdminMerchants,
  fetchAdminOffers,
  fetchAdminUsers,
} from '../api/admin.api';

export function AdminDashboardPage() {
  const results = useQueries({
    queries: [
      { queryKey: ['admin', 'users'], queryFn: fetchAdminUsers },
      { queryKey: ['admin', 'merchants'], queryFn: fetchAdminMerchants },
      { queryKey: ['admin', 'cards'], queryFn: fetchAdminCards },
      { queryKey: ['admin', 'offers'], queryFn: fetchAdminOffers },
      { queryKey: ['admin', 'card-plans'], queryFn: fetchAdminCardPlans },
    ],
  });

  const users = results[0].data?.data || [];
  const merchants = results[1].data?.data || [];
  const cards = results[2].data?.data || [];
  const offers = results[3].data?.data || [];
  const cardPlans = results[4].data?.data || [];

  return (
    <>
      <section className="panel content-card hero-card">
        <p className="eyebrow">Admin</p>
        <h1>Back-office SmartCard</h1>
        <p className="muted">Vue globale simple pour superviser la V1 et piloter les cartes commerciales.</p>
        <div className="inline-actions top-actions">
          <Link className="primary-button link-button" to="/admin/users">
            Utilisateurs
          </Link>
          <Link className="primary-button link-button alt-button" to="/admin/card-plans">
            Card Plans
          </Link>
          <Link className="primary-button link-button alt-button" to="/admin/offers">
            Offres
          </Link>
        </div>
      </section>
      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Users</h3>
          <p className="metric-value">{users.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Merchants</h3>
          <p className="metric-value">{merchants.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Cards</h3>
          <p className="metric-value">{cards.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Offers</h3>
          <p className="metric-value">{offers.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Card Plans</h3>
          <p className="metric-value">{cardPlans.length}</p>
        </article>
      </section>
    </>
  );
}
