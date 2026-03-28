import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { UserDashboardPage } from '../../features/me/pages/UserDashboardPage';
import { OffersPage } from '../../features/offers/pages/OffersPage';
import { MerchantDashboardPage } from '../../features/merchant/pages/MerchantDashboardPage';
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
