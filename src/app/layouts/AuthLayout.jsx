import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="brand-block">
          <p className="eyebrow">SmartCard</p>
          <h1>Vos meilleures reductions, dans une seule carte</h1>
          <p className="muted">Choisissez votre carte, activez-la en quelques secondes et profitez d'avantages exclusifs chez nos partenaires.</p>
        </div>
        <Outlet />
      </section>
    </main>
  );
}
