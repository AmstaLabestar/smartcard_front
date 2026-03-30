import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUserTransactions } from '../api/transactions.api';
import { TransactionHistoryList } from '../components/TransactionHistoryList';
import { TransactionSummaryCards } from '../components/TransactionSummaryCards';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';

const FILTERS = {
  ALL: 'Toutes',
  SAVINGS: 'Avec reduction',
  HIGH_VALUE: 'Montant >= 100',
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
    return <LoadingState title="Chargement de vos transactions" description="Nous recuperons votre historique SmartCard." />;
  }

  return (
    <div className="transactions-page">
      <section className="panel content-card hero-card">
        <p className="eyebrow">Transactions</p>
        <h1>Historique complet de vos reductions</h1>
        <p className="muted">Suivez vos passages en boutique, le montant initial, la reduction appliquee et le total vraiment paye.</p>
      </section>

      <TransactionSummaryCards transactions={transactions} />

      <section className="content-card transactions-toolbar-card">
        <div>
          <p className="eyebrow">Filtrer</p>
          <h2>Afficher ce qui vous interesse</h2>
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
          title="Aucune transaction pour ce filtre"
          description="Essayez un autre filtre ou utilisez votre carte chez un commercant pour commencer a voir de l'activite."
        />
      ) : (
        <section className="content-card">
          <h2>Historique</h2>
          <TransactionHistoryList transactions={filteredTransactions} />
        </section>
      )}
    </div>
  );
}
