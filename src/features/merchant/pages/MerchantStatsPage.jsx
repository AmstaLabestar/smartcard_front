import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchMerchantTransactions } from '../../transactions/api/transactions.api';
import { LoadingState } from '../../../shared/components/states/LoadingState';

const FILTERS = {
  TODAY: "Aujourd'hui",
  WEEK: '7 jours',
  MONTH: '30 jours',
};

function filterTransactions(transactions, range) {
  const now = new Date();
  const start = new Date(now);

  if (range === 'TODAY') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'WEEK') {
    start.setDate(start.getDate() - 7);
  } else {
    start.setDate(start.getDate() - 30);
  }

  return transactions.filter((transaction) => new Date(transaction.createdAt) >= start);
}

export function MerchantStatsPage() {
  const [range, setRange] = useState('TODAY');
  const { data: transactionsResponse, isLoading } = useQuery({
    queryKey: ['merchant', 'transactions'],
    queryFn: fetchMerchantTransactions,
  });

  const transactions = transactionsResponse?.data || [];
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, range),
    [transactions, range],
  );

  const totalRevenue = filteredTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0,
  );
  const totalDiscount = filteredTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.discountAmount || 0),
    0,
  );

  if (isLoading) {
    return <LoadingState title="Statistiques" description="Nous preparons votre activite." />;
  }

  return (
    <div className="premium-page-stack merchant-stats-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft merchant-stats-hero">
        <div className="premium-hero-copy premium-hero-copy-wide">
          <p className="eyebrow">Statistiques</p>
          <h1>Votre activite recente</h1>
          <p className="muted premium-hero-lead">Chiffres et historique.</p>
        </div>
      </section>

      <section className="ui-stat-strip merchant-stats-strip">
        <article className="ui-stat-pill">
          <span className="meta-label">Scans</span>
          <p className="metric-value">{filteredTransactions.length}</p>
          <p className="muted">Valides</p>
        </article>
        <article className="ui-stat-pill">
          <span className="meta-label">Encaisse</span>
          <p className="metric-value">{totalRevenue.toFixed(2)}</p>
          <p className="muted">Final</p>
        </article>
        <article className="ui-stat-pill">
          <span className="meta-label">Remises</span>
          <p className="metric-value">{totalDiscount.toFixed(2)}</p>
          <p className="muted">Accordees</p>
        </article>
      </section>

      <section className="content-card premium-support-card merchant-stats-filters">
        <div className="filter-chips" role="tablist" aria-label="Filtres statistiques">
          {Object.entries(FILTERS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={range === key ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="content-card premium-support-card merchant-stats-history">
        <div className="section-heading-row premium-section-heading-row merchant-stats-heading">
          <div>
            <p className="eyebrow">Historique</p>
            <h2>Dernieres validations</h2>
          </div>
          <p className="muted">{filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}</p>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="muted">Aucune validation sur cette periode.</p>
        ) : (
          <div className="list-stack merchant-stats-list">
            {filteredTransactions.map((transaction) => (
              <article key={transaction.id} className="list-item merchant-stats-item">
                <div className="merchant-stats-item-main">
                  <strong>{transaction.offer?.title || 'Offre SmartCard'}</strong>
                  <p className="muted">{transaction.user?.firstName} {transaction.user?.lastName}</p>
                </div>
                <div className="merchant-stats-item-values">
                  <strong>{transaction.amount}</strong>
                  <span className="muted">Remise {transaction.discountAmount}</span>
                  <small>{new Date(transaction.createdAt).toLocaleString()}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
