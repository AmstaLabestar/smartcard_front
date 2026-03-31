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
          <p className="eyebrow">Espace partenaire</p>
          <h1>Faites rayonner vos offres et suivez leur impact en temps reel</h1>
          <p className="muted">Activez vos campagnes, validez les reductions en boutique et mesurez instantanement l'engagement de vos clients.</p>
        </div>
        <div className="inline-actions top-actions">
          <Link className="primary-button link-button" to="/merchant/offers">
            Gerer mes offres
          </Link>
          <Link className="primary-button link-button alt-button" to="/merchant/scan">
            Lancer un scan
          </Link>
        </div>
      </section>

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Offres en vitrine</h3>
          <p className="metric-value">{activeOffers}</p>
          <p className="muted">Les offres actuellement visibles et activables pour vos clients.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Passages en caisse</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Nombre total de reductions validees via SmartCard.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Chiffre final genere</h3>
          <p className="metric-value">{totalRevenue.toFixed(2)}</p>
          <p className="muted">Montant encaisse apres application des reductions.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Economies accordees</h3>
          <p className="metric-value">{totalDiscount.toFixed(2)}</p>
          <p className="muted">Valeur totale offerte a vos clients pour les fideliser durablement.</p>
        </article>
      </section>

      <section className="merchant-dashboard-grid">
        <section className="content-card merchant-insight-card">
          <p className="eyebrow">En pratique</p>
          <h2>Les bons reflexes en boutique</h2>
          <div className="list-stack">
            <article className="list-item">
              <strong>Gardez une offre active</strong>
              <p className="muted">Une offre visible, c'est une occasion de plus de convertir un passage en caisse en client fidele.</p>
            </article>
            <article className="list-item">
              <strong>Saisissez le bon montant</strong>
              <p className="muted">SmartCard applique automatiquement la bonne reduction et vous aide a eviter les erreurs au comptoir.</p>
            </article>
            <article className="list-item">
              <strong>Suivez vos performances</strong>
              <p className="muted">Chaque transaction validee vous aide a mesurer l'attractivite reelle de vos offres.</p>
            </article>
          </div>
        </section>

        <section className="content-card merchant-insight-card">
          <p className="eyebrow">Vos offres</p>
          <h2>Ce que vos clients peuvent activer aujourd'hui</h2>
          {offers.length === 0 ? (
            <EmptyState
              title="Aucune offre publiee pour le moment"
              description="Creez votre premiere offre pour attirer l'attention et convertir davantage de clients en boutique."
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
            <p className="eyebrow">Activite recente</p>
            <h2>Vos dernieres reductions validees</h2>
          </div>
          <Link className="link-button secondary-link" to="/merchant/scan">
            Nouveau scan
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="muted">Vos prochaines validations apparaitront ici des le premier passage client.</p>
        ) : (
          <div className="list-stack">
            {transactions.slice(0, 6).map((transaction) => (
              <article key={transaction.id} className="list-item merchant-transaction-item">
                <div>
                  <strong>{transaction.offer?.title || 'Offre SmartCard'}</strong>
                  <p className="muted">Client : {transaction.user?.firstName} {transaction.user?.lastName}</p>
                  <p className="muted">Reference : {transaction.reference}</p>
                </div>
                <div className="merchant-transaction-values">
                  <span>Montant initial : {transaction.originalAmount}</span>
                  <span>Economie client : {transaction.discountAmount}</span>
                  <strong>Montant final : {transaction.amount}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
