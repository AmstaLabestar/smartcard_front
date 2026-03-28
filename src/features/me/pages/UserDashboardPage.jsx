export function UserDashboardPage() {
  return (
    <>
      <section className="panel content-card">
        <p className="eyebrow">User Dashboard</p>
        <h1>Ma carte, mes offres, mes transactions</h1>
        <p className="muted">Le sprint FE-2 branchera ici /me, /me/card et /me/transactions.</p>
      </section>
      <section className="cards-grid">
        <article className="metric-card">
          <h3>Carte</h3>
          <p className="muted">Etat, QR code, activation.</p>
        </article>
        <article className="metric-card">
          <h3>Offres</h3>
          <p className="muted">Liste des offres actives.</p>
        </article>
        <article className="metric-card">
          <h3>Transactions</h3>
          <p className="muted">Historique et reductions.</p>
        </article>
      </section>
    </>
  );
}
