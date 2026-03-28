import { Link, Outlet } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/auth.store';

export function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const linksByRole = {
    USER: [
      { to: '/dashboard', label: 'Mon espace' },
      { to: '/offers', label: 'Offres' },
    ],
    MERCHANT: [
      { to: '/merchant/dashboard', label: 'Dashboard' },
      { to: '/offers', label: 'Catalogue' },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Back-office' },
      { to: '/offers', label: 'Offres actives' },
    ],
  };

  const links = linksByRole[user?.role] || [];

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow sidebar-eyebrow">SmartCard</p>
          <h2>{user?.role || 'Workspace'}</h2>
          <p className="sidebar-user">{user?.firstName} {user?.lastName}</p>
        </div>
        <nav>
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
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
