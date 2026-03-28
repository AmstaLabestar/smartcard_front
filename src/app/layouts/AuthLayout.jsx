import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="brand-block">
          <p className="eyebrow">SmartCard</p>
          <h1>Carte de reduction mutualisee</h1>
          <p className="muted">Un socle frontend simple et modulaire pour la V1.</p>
        </div>
        <Outlet />
      </section>
    </main>
  );
}
