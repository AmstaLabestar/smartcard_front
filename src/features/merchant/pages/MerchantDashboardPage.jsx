import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

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
      <section className="panel content-card hero-card">
        <p className="eyebrow">Merchant</p>
        <h1>Console commercant</h1>
        <p className="muted">Pilotez vos offres et validez les reductions en boutique.</p>
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
        <h2>Dernieres transactions</h2>
        {transactions.length === 0 ? (
          <p className="muted">Aucune transaction pour le moment.</p>
        ) : (
          <div className="list-stack">
            {transactions.slice(0, 5).map((transaction) => (
              <article key={transaction.id} className="list-item">
                <strong>{transaction.offer?.title}</strong>
                <span>Client: {transaction.user?.firstName} {transaction.user?.lastName}</span>
                <span>Montant final: {transaction.amount}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
