import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageIntro } from '../../../shared/ui/PageIntro';
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
  const activeOffers = offers.filter((offer) => offer.status === 'ACTIVE').length;
  const totalDiscount = transactions.reduce((sum, transaction) => sum + Number(transaction.discountAmount || 0), 0);

  return (
    <div className="merchant-dashboard-page premium-page-stack merchant-home-v2-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft merchant-home-v2-hero">
        <PageIntro
          kicker="Accueil"
          title="Votre espace caisse"
          description="Choisissez une action."
          compact
        />
      </section>

      <section className="panel content-card premium-support-card merchant-home-v2-actions-shell">
        <div className="merchant-home-v2-actions">
          <Link className="primary-button link-button merchant-home-v2-action-button" to="/merchant/scan">
            Scanner
          </Link>
          <Link className="primary-button alt-button link-button merchant-home-v2-action-button" to="/merchant/offers">
            Offres
          </Link>
        </div>
      </section>

      <section className="panel content-card merchant-home-v2-spotlight">
        <div className="merchant-home-v2-spotlight-copy">
          <p className="eyebrow">Aujourd'hui</p>
          <h2>Votre activite</h2>
          <p className="muted">Suivez l'essentiel en un coup d'oeil.</p>
        </div>
        <div className="merchant-home-v2-spotlight-stats">
          <span className="merchant-home-v2-spotlight-stat">Scans {transactions.length}</span>
          <span className="merchant-home-v2-spotlight-stat">Offres {activeOffers}</span>
          <span className="merchant-home-v2-spotlight-stat">Remises {totalDiscount.toFixed(2)}</span>
        </div>
        <Link className="primary-button alt-button link-button merchant-home-v2-spotlight-button" to="/merchant/stats">
          Voir stats
        </Link>
      </section>
    </div>
  );
}
