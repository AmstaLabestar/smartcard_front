import { NavLink, Outlet } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/auth.store';

export function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const linksByRole = {
    USER: [
      { to: '/dashboard', label: 'Mon espace' },
      { to: '/my-cards', label: 'Mes cartes' },
      { to: '/card-plans', label: 'Catalogue' },
      { to: '/transactions', label: 'Transactions' },
      { to: '/offers', label: 'Offres' },
    ],
    MERCHANT: [
      { to: '/merchant/dashboard', label: 'Dashboard' },
      { to: '/merchant/offers', label: 'Mes offres' },
      { to: '/merchant/scan', label: 'Scan client' },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Back-office' },
      { to: '/admin/card-plans', label: 'Card Plans' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/merchants', label: 'Merchants' },
      { to: '/admin/cards', label: 'Cards' },
      { to: '/admin/offers', label: 'Offers' },
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
