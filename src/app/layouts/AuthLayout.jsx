import { Outlet } from 'react-router-dom';

import { PageIntro } from '../../shared/ui/PageIntro';

export function AuthLayout() {
  return (
    <main className="auth-shell ui-auth-shell">
      <section className="auth-panel ui-auth-panel">
        <div className="brand-block ui-auth-brand-block">
          <PageIntro
            kicker="SmartCard"
            title="Toutes vos reductions, dans une seule app"
            description="Choisissez une carte, activez-la rapidement et presentez votre QR en caisse."
            aside={
              <div className="ui-auth-badge-cluster">
                <span className="ui-chip">Cartes multiples</span>
                <span className="ui-chip">Scan rapide</span>
                <span className="ui-chip">Avantages actifs</span>
              </div>
            }
            className="ui-page-intro-auth"
          />
        </div>
        <Outlet />
      </section>
    </main>
  );
}
