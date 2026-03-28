export function EmptyState({ title, description }) {
  return (
    <section className="content-card state-card">
      <div className="state-icon">--</div>
      <h2>{title}</h2>
      <p className="muted">{description}</p>
    </section>
  );
}
