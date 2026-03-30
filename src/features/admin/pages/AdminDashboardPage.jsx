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
        <p className="eyebrow">Pilotage</p>
        <h1>Pilotez l'offre SmartCard depuis un seul espace</h1>
        <p className="muted">Suivez l'activite de la plateforme, organisez les cartes commerciales et gardez la maitrise de vos avantages partenaires.</p>
        <div className="inline-actions top-actions">
          <Link className="primary-button link-button" to="/admin/users">
            Voir les utilisateurs
          </Link>
          <Link className="primary-button link-button alt-button" to="/admin/card-plans">
            Gerer les cartes
          </Link>
          <Link className="primary-button link-button alt-button" to="/admin/offers">
            Explorer les offres
          </Link>
        </div>
      </section>
      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Clients</h3>
          <p className="metric-value">{users.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Partenaires</h3>
          <p className="metric-value">{merchants.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Cartes actives</h3>
          <p className="metric-value">{cards.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Offres diffusees</h3>
          <p className="metric-value">{offers.length}</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Formules commerciales</h3>
          <p className="metric-value">{cardPlans.length}</p>
        </article>
      </section>
    </>
  );
}
