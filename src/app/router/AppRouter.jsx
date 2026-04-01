import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { CardPlansPage } from '../../features/card-plans/pages/CardPlansPage';
import { MyCardsPage } from '../../features/cards/pages/MyCardsPage';
import { UserDashboardPage } from '../../features/me/pages/UserDashboardPage';
import { OffersPage } from '../../features/offers/pages/OffersPage';
import { MerchantDashboardPage } from '../../features/merchant/pages/MerchantDashboardPage';
import { MerchantOffersPage } from '../../features/merchant/pages/MerchantOffersPage';
import { MerchantScanPage } from '../../features/merchant/pages/MerchantScanPage';
import { MerchantStatsPage } from '../../features/merchant/pages/MerchantStatsPage';
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage';
import { AdminUsersPage } from '../../features/admin/pages/AdminUsersPage';
import { AdminMerchantsPage } from '../../features/admin/pages/AdminMerchantsPage';
import { AdminCardsPage } from '../../features/admin/pages/AdminCardsPage';
import { AdminOffersPage } from '../../features/admin/pages/AdminOffersPage';
import { AdminCardPlansPage } from '../../features/admin/pages/AdminCardPlansPage';
import { UserTransactionsPage } from '../../features/transactions/pages/UserTransactionsPage';
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
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboardPage />} />
        </Route>

        <Route
          path="/my-cards"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyCardsPage />} />
        </Route>

        <Route
          path="/card-plans"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CardPlansPage />} />
        </Route>

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserTransactionsPage />} />
        </Route>

        <Route
          path="/offers"
          element={
            <ProtectedRoute allowedRoles={['USER', 'MERCHANT', 'ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OffersPage />} />
        </Route>

        <Route
          path="/merchant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MerchantDashboardPage />} />
        </Route>

        <Route
          path="/merchant/offers"
          element={
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MerchantOffersPage />} />
        </Route>

        <Route
          path="/merchant/scan"
          element={
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MerchantScanPage />} />
        </Route>

        <Route
          path="/merchant/stats"
          element={
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MerchantStatsPage />} />
        </Route>

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
        </Route>

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminUsersPage />} />
        </Route>

        <Route
          path="/admin/merchants"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminMerchantsPage />} />
        </Route>

        <Route
          path="/admin/cards"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminCardsPage />} />
        </Route>

        <Route
          path="/admin/offers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOffersPage />} />
        </Route>

        <Route
          path="/admin/card-plans"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminCardPlansPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
