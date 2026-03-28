import { useQuery } from '@tanstack/react-query';

import { fetchMyCard, fetchMyTransactions } from '../api/me.api';

export function UserDashboardPage() {
  const { data: cardResponse } = useQuery({
    queryKey: ['me', 'card'],
    queryFn: fetchMyCard,
  });

  const { data: transactionsResponse } = useQuery({
    queryKey: ['me', 'transactions'],
    queryFn: fetchMyTransactions,
  });

  const card = cardResponse?.data;
  const transactions = transactionsResponse?.data || [];

  return (
    <>
      <section className="panel content-card">
        <p className="eyebrow">User Dashboard</p>
        <h1>Mon espace carte de reduction</h1>
        <p className="muted">Ce dashboard consomme deja le backend via /me/card et /me/transactions.</p>
      </section>
      <section className="cards-grid">
        <article className="metric-card">
          <h3>Carte</h3>
          <p className="metric-value">{card?.status || 'Aucune carte'}</p>
          <p className="muted">{card?.cardNumber || 'Achetez une carte pour commencer.'}</p>
        </article>
        <article className="metric-card">
          <h3>QR Code</h3>
          <p className="metric-value qr-preview">{card?.qrCode || 'Indisponible'}</p>
          <p className="muted">Visible uniquement pour le user connecte.</p>
        </article>
        <article className="metric-card">
          <h3>Transactions</h3>
          <p className="metric-value">{transactions.length}</p>
          <p className="muted">Nombre total de transactions enregistrees.</p>
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
                <strong>{transaction.offer?.title || 'Offre'}</strong>
                <span>Montant final: {transaction.amount}</span>
                <span>Reduction: {transaction.discountAmount}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
