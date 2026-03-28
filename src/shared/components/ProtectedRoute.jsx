import { Navigate, useLocation } from 'react-router-dom';

import { useAuthBootstrap } from '../../features/auth/hooks/useAuthBootstrap';
import { getDefaultRoute, useAuthStore } from '../../features/auth/store/auth.store';

export function ProtectedRoute({ children, allowedRoles }) {
  useAuthBootstrap();

  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  if (!isBootstrapped) {
    return <div className="content-card">Chargement de la session...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return children;
}
