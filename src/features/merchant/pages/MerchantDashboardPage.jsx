import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { fetchMerchantTransactions } from '../../transactions/api/transactions.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
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
  const totalRevenue = transactions.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const totalDiscount = transactions.reduce((sum, transaction) => sum + Number(transaction.discountAmount || 0), 0);

  return (
    <div className="merchant-dashboard-page premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Merchant"
          title="Scannez. Validez. Encaissez."
          description="Votre espace caisse, rapide et lisible."
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button" to="/merchant/scan">Scanner</Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/merchant/offers">Mes offres</Link>
            </>
          )}
          aside={(
            <div className="premium-hero-aside merchant-hero-aside">
              <div className="premium-spotlight-card">
                <span className="meta-label">Actives</span>
                <strong>{activeOffers}</strong>
                <p className="muted">Offres disponibles.</p>
              </div>
              <div className="premium-spotlight-card premium-spotlight-card-soft">
                <span className="meta-label">Passages</span>
                <strong>{transactions.length}</strong>
                <p className="muted">Transactions validees.</p>
              </div>
            </div>
          )}
        />
      </section>

      <section className="premium-summary-grid merchant-summary-grid">
        <article className="metric-card premium-stat-card premium-stat-card-dark">
          <span className="meta-label">Offres</span>
          <p className="metric-value">{activeOffers}</p>
          <p className="muted">Actives maintenant.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Encaisse</span>
          <p className="metric-value">{totalRevenue.toFixed(2)}</p>
          <p className="muted">Montant final.</p>
        </article>
        <article className="metric-card premium-stat-card">
          <span className="meta-label">Remises</span>
          <p className="metric-value">{totalDiscount.toFixed(2)}</p>
          <p className="muted">Accordees aux clients.</p>
        </article>
      </section>

      <section className="merchant-dashboard-grid premium-dual-grid">
        <section className="content-card merchant-insight-card premium-support-card">
          <p className="eyebrow">Raccourcis</p>
          <h2>Le plus utile</h2>
          <div className="list-stack">
            <article className="list-item">
              <strong>Scanner</strong>
              <p className="muted">Votre action principale.</p>
            </article>
            <article className="list-item">
              <strong>Offres actives</strong>
              <p className="muted">Gardez-les visibles.</p>
            </article>
            <article className="list-item">
              <strong>Suivi rapide</strong>
              <p className="muted">Vos derniers passages restent ici.</p>
            </article>
          </div>
        </section>

        <section className="content-card merchant-insight-card premium-support-card premium-support-card-accent">
          <p className="eyebrow">Mes offres</p>
          <h2>En vitrine</h2>
          {offers.length === 0 ? (
            <EmptyState
              title="Aucune offre pour le moment"
              description="Creez votre premiere offre."
            />
          ) : (
            <div className="list-stack">
              {offers.slice(0, 4).map((offer) => (
                <article key={offer.id} className="list-item merchant-offer-summary">
                  <div>
                    <strong>{offer.title}</strong>
                    <p className="muted">{offer.discountType} - {offer.discountValue}</p>
                  </div>
                  <span className={`status-pill status-${offer.status.toLowerCase()}`}>{offer.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="panel content-card premium-transaction-section">
        <div className="section-heading-row premium-section-heading-row">
          <div>
            <p className="eyebrow">Activite</p>
            <h2>Dernieres validations</h2>
          </div>
          <Link className="link-button secondary-link" to="/merchant/scan">
            Nouveau scan
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="muted">Vos prochains scans apparaitront ici.</p>
        ) : (
          <div className="list-stack">
            {transactions.slice(0, 6).map((transaction) => (
              <article key={transaction.id} className="list-item merchant-transaction-item">
                <div>
                  <strong>{transaction.offer?.title || 'Offre SmartCard'}</strong>
                  <p className="muted">{transaction.user?.firstName} {transaction.user?.lastName}</p>
                  <p className="muted">Ref. {transaction.reference}</p>
                </div>
                <div className="merchant-transaction-values">
                  <span>Initial : {transaction.originalAmount}</span>
                  <span>Remise : {transaction.discountAmount}</span>
                  <strong>Final : {transaction.amount}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
