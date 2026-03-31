import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import {
  fetchAdminCardPlans,
  fetchAdminCards,
  fetchAdminMerchants,
  fetchAdminOffers,
  fetchAdminUsers,
} from '../api/admin.api';
import { PageIntro } from '../../../shared/ui/PageIntro';

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
    <div className="premium-page-stack admin-dashboard-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Admin"
          title="Pilotez SmartCard"
          description="Gardez une vue claire sur la plateforme, les cartes et les offres."
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button" to="/admin/card-plans">Plans</Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/admin/offers">Offres</Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/admin/users">Users</Link>
            </>
          )}
        />
      </section>

      <section className="premium-summary-grid admin-summary-grid">
        <article className="metric-card premium-stat-card premium-stat-card-dark">
          <span className="meta-label">Clients</span>
          <p className="metric-value">{users.length}</p>
          <p className="muted">Comptes users.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Merchants</span>
          <p className="metric-value">{merchants.length}</p>
          <p className="muted">Partenaires actifs.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Cartes</span>
          <p className="metric-value">{cards.length}</p>
          <p className="muted">Cartes emises.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Offres</span>
          <p className="metric-value">{offers.length}</p>
          <p className="muted">Dans le reseau.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Plans</span>
          <p className="metric-value">{cardPlans.length}</p>
          <p className="muted">Cartes commerciales.</p>
        </article>
      </section>
    </div>
  );
}
