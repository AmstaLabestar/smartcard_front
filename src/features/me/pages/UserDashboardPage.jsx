import { useQuery } from '@tanstack/react-query';

import { UserCardPanel } from '../components/UserCardPanel';
import { TransactionPreviewList } from '../components/TransactionPreviewList';
import { fetchMyCard, fetchMyTransactions } from '../api/me.api';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { LoadingState } from '../../../shared/components/states/LoadingState';

export function UserDashboardPage() {
  const {
    data: cardResponse,
    isLoading: isCardLoading,
    error: cardError,
  } = useQuery({
    queryKey: ['me', 'card'],
    queryFn: fetchMyCard,
  });

  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
  } = useQuery({
    queryKey: ['me', 'transactions'],
    queryFn: fetchMyTransactions,
  });

  const card = cardResponse?.data;
  const transactions = transactionsResponse?.data || [];

  if (isCardLoading) {
    return <LoadingState title="Chargement de votre espace" />;
  }

  return (
    <>
      <section className="panel content-card hero-card">
        <p className="eyebrow">User Dashboard</p>
        <h1>Bienvenue dans votre espace SmartCard</h1>
        <p className="muted">Retrouvez votre carte, votre QR code et vos dernieres reductions sans changer d'ecran.</p>
      </section>

      {card ? (
        <UserCardPanel card={card} />
      ) : (
        <EmptyState
          title="Aucune carte liee a ce compte"
          description={cardError?.response?.data?.error?.message || 'Achetez puis activez votre carte pour commencer a profiter des reductions.'}
        />
      )}

      <section className="cards-grid">
        <article className="metric-card highlight-card">
          <h3>Statut de la carte</h3>
          <p className="metric-value">{card?.status || 'Aucune'}</p>
          <p className="muted">Un user doit avoir une carte active pour etre scanne chez un merchant.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Total transactions</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Toutes vos utilisations confirmees chez les commerçants.</p>
        </article>
        <article className="metric-card highlight-card">
          <h3>Derniere reduction</h3>
          <p className="metric-value">{transactions[0]?.discountAmount || '0'}</p>
          <p className="muted">Montant economise sur la transaction la plus recente.</p>
        </article>
      </section>

      <section className="panel content-card">
        <h2>Dernieres transactions</h2>
        {isTransactionsLoading ? (
          <p className="muted">Chargement des transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="muted">Aucune transaction pour le moment.</p>
        ) : (
          <TransactionPreviewList transactions={transactions.slice(0, 5)} />
        )}
      </section>
    </>
  );
}
