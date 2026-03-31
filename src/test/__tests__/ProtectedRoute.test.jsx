import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { renderWithProviders } from '../utils/renderWithProviders';
import { useAuthStore } from '../../features/auth/store/auth.store';

vi.mock('../../features/auth/hooks/useAuthBootstrap', () => ({
  useAuthBootstrap: vi.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      isBootstrapped: true,
    });
  });

  it('redirects unauthenticated users to login', () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route
          path="/merchant"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <div>Zone merchant</div>
            </ProtectedRoute>
          )}
        />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      { route: '/merchant' },
    );

    expect(container).toHaveTextContent('Login page');
  });

  it('redirects users with the wrong role to their default route', () => {
    useAuthStore.setState({
      token: 'token',
      user: { role: 'USER', firstName: 'Nadia' },
      isBootstrapped: true,
    });

    const { container } = renderWithProviders(
      <Routes>
        <Route
          path="/merchant"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <div>Zone merchant</div>
            </ProtectedRoute>
          )}
        />
        <Route path="/dashboard" element={<div>User dashboard</div>} />
      </Routes>,
      { route: '/merchant' },
    );

    expect(container).toHaveTextContent('User dashboard');
  });

  it('renders protected content for an allowed role', () => {
    useAuthStore.setState({
      token: 'token',
      user: { role: 'MERCHANT', firstName: 'Paul' },
      isBootstrapped: true,
    });

    const { container } = renderWithProviders(
      <Routes>
        <Route
          path="/merchant"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <div>Zone merchant</div>
            </ProtectedRoute>
          )}
        />
      </Routes>,
      { route: '/merchant' },
    );

    expect(container).toHaveTextContent('Zone merchant');
  });
});
