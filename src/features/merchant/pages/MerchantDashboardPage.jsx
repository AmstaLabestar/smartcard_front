import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchMerchantOffers } from '../../offers/api/offers.api';
import { fetchMerchantTransactions } from '../../transactions/api/transactions.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';

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
    <div className="merchant-dashboard-page">
      <section className="panel content-card hero-card merchant-hero-card">
        <div>
          <p className="eyebrow">Merchant</p>
          <h1>Console commercant</h1>
          <p className="muted">Pilotez vos offres actives, validez les reductions en boutique et suivez l'usage de vos campagnes.</p>
        </div>
        <div className="inline-actions top-actions">
          <Link className="primary-button link-button" to="/merchant/offers">
            Gerer les offres
          </Link>
          <Link className="primary-button link-button alt-button" to="/merchant/scan">
            Scanner un client
          </Link>
        </div>
      </section>

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Offres actives</h3>
          <p className="metric-value">{activeOffers}</p>
          <p className="muted">Offres immediatement disponibles pour les clients.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Transactions</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Nombre total de scans transformes en reductions.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Montant final cumule</h3>
          <p className="metric-value">{totalRevenue.toFixed(2)}</p>
          <p className="muted">Somme finale payee apres application des reductions.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Reduction accordee</h3>
          <p className="metric-value">{totalDiscount.toFixed(2)}</p>
          <p className="muted">Valeur totale des remises accordees a vos clients.</p>
        </article>
      </section>

      <section className="merchant-dashboard-grid">
        <section className="content-card merchant-insight-card">
          <p className="eyebrow">Actions rapides</p>
          <h2>Rythme boutique</h2>
          <div className="list-stack">
            <article className="list-item">
              <strong>1. Garder des offres actives</strong>
              <p className="muted">Sans offre active, vos vendeurs ne peuvent pas appliquer de reduction au comptoir.</p>
            </article>
            <article className="list-item">
              <strong>2. Scanner avec le bon montant initial</strong>
              <p className="muted">Le backend calcule ensuite automatiquement la remise et bloque les doubles scans trop rapproches.</p>
            </article>
            <article className="list-item">
              <strong>3. Verifier les dernieres validations</strong>
              <p className="muted">Chaque transaction enregistree vous aide a suivre l'usage reel de vos offres.</p>
            </article>
          </div>
        </section>

        <section className="content-card merchant-insight-card">
          <p className="eyebrow">Catalogue</p>
          <h2>Etat de vos offres</h2>
          {offers.length === 0 ? (
            <EmptyState
              title="Aucune offre pour l'instant"
              description="Creez votre premiere offre pour commencer a distribuer des reductions a vos clients."
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

      <section className="panel content-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Dernieres validations</p>
            <h2>Transactions recentes</h2>
          </div>
          <Link className="link-button secondary-link" to="/merchant/scan">
            Nouveau scan
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="muted">Aucune transaction pour le moment.</p>
        ) : (
          <div className="list-stack">
            {transactions.slice(0, 6).map((transaction) => (
              <article key={transaction.id} className="list-item merchant-transaction-item">
                <div>
                  <strong>{transaction.offer?.title || 'Offre SmartCard'}</strong>
                  <p className="muted">Client: {transaction.user?.firstName} {transaction.user?.lastName}</p>
                  <p className="muted">Ref: {transaction.reference}</p>
                </div>
                <div className="merchant-transaction-values">
                  <span>Initial: {transaction.originalAmount}</span>
                  <span>Reduction: {transaction.discountAmount}</span>
                  <strong>A payer: {transaction.amount}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
