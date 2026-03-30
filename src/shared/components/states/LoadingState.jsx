export function LoadingState({ title = 'Chargement...' }) {
  return (
    <section className="content-card state-card">
      <div className="state-pulse" />
      <h2>{title}</h2>
      <p className="muted">Les donnees sont en train d'arriver depuis le backend.</p>
    </section>
  );
}
