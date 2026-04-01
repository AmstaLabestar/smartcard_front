import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { fetchMerchantTransactions } from '../../transactions/api/transactions.api';
import { PageIntro } from '../../../shared/ui/PageIntro';

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
  const activeOffers = offers.filter((offer) => offer.status === 'ACTIVE').length;
  const todayScans = transactions.length;
  const totalDiscount = transactions.reduce((sum, transaction) => sum + Number(transaction.discountAmount || 0), 0);

  return (
    <div className="merchant-dashboard-page premium-page-stack merchant-home-v2-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft merchant-home-v2-hero">
        <PageIntro
          kicker="Accueil"
          title="Votre espace caisse"
          description="Choisissez une action."
          compact
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button ui-quick-button" to="/merchant/scan">Scanner</Link>
              <Link className="primary-button alt-button link-button premium-inline-button ui-quick-button" to="/merchant/offers">Offres</Link>
            </>
          )}
          aside={(
            <div className="premium-spotlight-card merchant-home-v2-spotlight">
              <span className="meta-label">Aujourd'hui</span>
              <strong>{todayScans}</strong>
              <p className="muted">Scans valides.</p>
            </div>
          )}
        />
      </section>

      <section className="ui-stat-strip merchant-home-v2-stats">
        <article className="ui-stat-pill">
          <span className="meta-label">Offres</span>
          <p className="metric-value">{activeOffers}</p>
          <p className="muted">Actives</p>
        </article>
        <article className="ui-stat-pill">
          <span className="meta-label">Scans</span>
          <p className="metric-value">{todayScans}</p>
          <p className="muted">Valides</p>
        </article>
        <article className="ui-stat-pill">
          <span className="meta-label">Remises</span>
          <p className="metric-value">{totalDiscount.toFixed(2)}</p>
          <p className="muted">Accordees</p>
        </article>
      </section>

      <section className="merchant-home-v2-grid">
        <section className="content-card premium-support-card merchant-home-v2-card">
          <p className="eyebrow">Action</p>
          <h2>Scanner un client</h2>
          <p className="muted">Votre action principale.</p>
          <Link className="primary-button link-button ui-quick-button merchant-home-v2-button" to="/merchant/scan">
            Ouvrir le scan
          </Link>
        </section>

        <section className="content-card premium-support-card premium-support-card-accent merchant-home-v2-card">
          <p className="eyebrow">Offres</p>
          <h2>Gerer vos offres</h2>
          <p className="muted">
            {activeOffers > 0 ? `${activeOffers} actives maintenant.` : 'Creez votre premiere offre.'}
          </p>
          <Link className="primary-button alt-button link-button ui-quick-button merchant-home-v2-button" to="/merchant/offers">
            Voir les offres
          </Link>
        </section>
      </section>

      <section className="panel content-card premium-support-card merchant-home-v2-note">
        <div className="section-heading-row premium-section-heading-row merchant-home-v2-note-head">
          <div>
            <p className="eyebrow">Repere</p>
            <h2>Rapide et simple</h2>
          </div>
        </div>
        <p className="muted">Accueil pour orienter. Scan pour encaisser. Offres pour gerer.</p>
      </section>
    </div>
  );
}
