export function LoadingState({ title = 'Chargement...', description = 'Nous preparons votre experience SmartCard.' }) {
  return (
    <section className="content-card state-card">
      <div className="state-pulse" />
      <h2>{title}</h2>
      <p className="muted">{description}</p>
    </section>
  );
}
