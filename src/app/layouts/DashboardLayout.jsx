import { NavLink, Outlet } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/auth.store';
import { MobileBottomNav } from '../../shared/components/navigation/MobileBottomNav';
import { useIsMobile } from '../../shared/hooks/useIsMobile';

const linksByRole = {
  USER: [
    { to: '/dashboard', label: 'Accueil' },
    { to: '/my-cards', label: 'Cartes' },
    { to: '/card-plans', label: 'Catalogue' },
    { to: '/offers', label: 'Offres' },
  ],
  MERCHANT: [
    { to: '/merchant/dashboard', label: 'Accueil' },
    { to: '/merchant/offers', label: 'Offres' },
    { to: '/merchant/scan', label: 'Scan' },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/card-plans', label: 'Plans' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/offers', label: 'Offers' },
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
          <header className="mobile-header-card">
            <div>
              <p className="eyebrow">SmartCard</p>
              <h2>SmartCard</h2>
              <p className="muted mobile-header-user">{user?.firstName} {user?.lastName}</p>
            </div>
            <button className="primary-button mobile-header-button" type="button" onClick={logout}>
              Sortir
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
      <aside className="sidebar">
        <div>
          <p className="eyebrow sidebar-eyebrow">SmartCard</p>
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
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

