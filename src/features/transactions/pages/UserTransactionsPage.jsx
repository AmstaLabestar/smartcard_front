import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchUserTransactions } from '../api/transactions.api';
import { TransactionHistoryList } from '../components/TransactionHistoryList';
import { TransactionSummaryCards } from '../components/TransactionSummaryCards';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';
import { PageIntro } from '../../../shared/ui/PageIntro';

const FILTERS = {
  ALL: 'Toutes',
  SAVINGS: 'Economies',
  HIGH_VALUE: '100+',
};

export function UserTransactionsPage() {
  const [filter, setFilter] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', 'user'],
    queryFn: fetchUserTransactions,
  });

  const transactions = data?.data || [];

  const filteredTransactions = useMemo(() => {
    if (filter === 'SAVINGS') {
      return transactions.filter((transaction) => Number(transaction.discountAmount || 0) > 0);
    }

    if (filter === 'HIGH_VALUE') {
      return transactions.filter((transaction) => Number(transaction.originalAmount || 0) >= 100);
    }

    return transactions;
  }, [filter, transactions]);

  if (isLoading) {
    return <LoadingState title="Historique" description="Nous recuperons vos passages." />;
  }

  return (
    <div className="transactions-page premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Historique"
          title="Vos derniers passages"
          description="Retrouvez vos paiements et vos economies en un coup d oeil."
          actions={(
            <>
              <Link className="primary-button link-button premium-inline-button" to="/offers">Avantages</Link>
              <Link className="primary-button alt-button link-button premium-inline-button" to="/my-cards">Mes cartes</Link>
            </>
          )}
        />
      </section>

      <TransactionSummaryCards transactions={transactions} />

      <section className="content-card transactions-toolbar-card premium-support-card">
        <div>
          <p className="eyebrow">Filtres</p>
          <h2>Affichage rapide</h2>
        </div>
        <div className="filter-chips" role="tablist" aria-label="Filtres transactions">
          {Object.entries(FILTERS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Aucune transaction"
          description="Changez de filtre ou utilisez votre carte pour commencer."
        />
      ) : (
        <section className="content-card premium-support-card">
          <div className="section-heading-row premium-section-heading-row">
            <div>
              <p className="eyebrow">Historique</p>
              <h2>Toutes vos transactions</h2>
            </div>
          </div>
          <TransactionHistoryList transactions={filteredTransactions} />
        </section>
      )}
    </div>
  );
}
