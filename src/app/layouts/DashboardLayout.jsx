import { NavLink, Outlet } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/auth.store';
import { MobileBottomNav } from '../../shared/components/navigation/MobileBottomNav';
import { useIsMobile } from '../../shared/hooks/useIsMobile';

const linksByRole = {
  USER: [
    { to: '/dashboard', label: 'Accueil' },
    { to: '/my-cards', label: 'Carte' },
    { to: '/card-plans', label: 'Catalogue' },
    { to: '/offers', label: 'Offres' },
  ],
  MERCHANT: [
    { to: '/merchant/dashboard', label: 'Accueil' },
    { to: '/merchant/offers', label: 'Offres' },
    { to: '/merchant/scan', label: 'Scan' },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Accueil' },
    { to: '/admin/card-plans', label: 'Plans' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/offers', label: 'Offres' },
  ],
};

export function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isMobile = useIsMobile();

  const links = linksByRole[user?.role] || [];

  if (isMobile) {
    return (
      <div className="dashboard-shell dashboard-shell-mobile">
        <main className="dashboard-content dashboard-content-mobile">
          <header className="mobile-header-card ui-shell-card ui-mobile-header-card mobile-header-card-v2">
            <div className="mobile-header-copy">
              <p className="eyebrow ui-page-kicker">SmartCard</p>
              <h2>Bonjour</h2>
              <p className="muted mobile-header-user">{user?.firstName}</p>
            </div>
            <button className="mobile-header-icon-button" type="button" onClick={logout} aria-label="Deconnexion">
              <span className="mobile-header-button-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
                  <path d="M14 16l4-4-4-4" />
                  <path d="M18 12H9" />
                </svg>
              </span>
            </button>
          </header>
          <Outlet />
        </main>
        <MobileBottomNav links={links} />
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar ui-shell-card ui-sidebar-shell">
        <div className="ui-sidebar-brand-block">
          <p className="eyebrow sidebar-eyebrow ui-page-kicker">SmartCard</p>
          <h2>SmartCard</h2>
          <p className="sidebar-user">{user?.firstName} {user?.lastName}</p>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="primary-button sidebar-button" type="button" onClick={logout}>
          Deconnexion
        </button>
      </aside>
      <main className="dashboard-content ui-page-shell">
        <Outlet />
      </main>
    </div>
  );
}
