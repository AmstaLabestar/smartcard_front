import { Link, Outlet } from 'react-router-dom';

export function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <h2>SmartCard</h2>
        <nav>
          <Link to="/dashboard">User</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/merchant/dashboard">Merchant</Link>
          <Link to="/admin/dashboard">Admin</Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
