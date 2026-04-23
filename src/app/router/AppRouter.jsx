import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { RouteLoadingState } from '../../shared/components/states/RouteLoadingState';

const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ChangePasswordPage = lazy(() => import('../../features/auth/pages/ChangePasswordPage').then((module) => ({ default: module.ChangePasswordPage })));
const CardPlansPage = lazy(() => import('../../features/card-plans/pages/CardPlansPage').then((module) => ({ default: module.CardPlansPage })));
const MyCardsPage = lazy(() => import('../../features/cards/pages/MyCardsPage').then((module) => ({ default: module.MyCardsPage })));
const UserDashboardPage = lazy(() => import('../../features/me/pages/UserDashboardPage').then((module) => ({ default: module.UserDashboardPage })));
const OffersPage = lazy(() => import('../../features/offers/pages/OffersPage').then((module) => ({ default: module.OffersPage })));
const MerchantDashboardPage = lazy(() => import('../../features/merchant/pages/MerchantDashboardPage').then((module) => ({ default: module.MerchantDashboardPage })));
const MerchantOffersPage = lazy(() => import('../../features/merchant/pages/MerchantOffersPage').then((module) => ({ default: module.MerchantOffersPage })));
const MerchantScanPage = lazy(() => import('../../features/merchant/pages/MerchantScanPage').then((module) => ({ default: module.MerchantScanPage })));
const MerchantStatsPage = lazy(() => import('../../features/merchant/pages/MerchantStatsPage').then((module) => ({ default: module.MerchantStatsPage })));
const AdminDashboardPage = lazy(() => import('../../features/admin/pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('../../features/admin/pages/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })));
const AdminMerchantsPage = lazy(() => import('../../features/admin/pages/AdminMerchantsPage').then((module) => ({ default: module.AdminMerchantsPage })));
const AdminCardsPage = lazy(() => import('../../features/admin/pages/AdminCardsPage').then((module) => ({ default: module.AdminCardsPage })));
const AdminOffersPage = lazy(() => import('../../features/admin/pages/AdminOffersPage').then((module) => ({ default: module.AdminOffersPage })));
const AdminCardPlansPage = lazy(() => import('../../features/admin/pages/AdminCardPlansPage').then((module) => ({ default: module.AdminCardPlansPage })));
const UserTransactionsPage = lazy(() => import('../../features/transactions/pages/UserTransactionsPage').then((module) => ({ default: module.UserTransactionsPage })));

function withRouteLoader(element) {
  return <Suspense fallback={<RouteLoadingState />}>{element}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={withRouteLoader(<LoginPage />)} />
          <Route path="/register" element={withRouteLoader(<RegisterPage />)} />
        </Route>

        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<UserDashboardPage />)} />
        </Route>

        <Route
          path="/my-cards"
          element={(
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<MyCardsPage />)} />
        </Route>

        <Route
          path="/card-plans"
          element={(
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<CardPlansPage />)} />
        </Route>

        <Route
          path="/transactions"
          element={(
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<UserTransactionsPage />)} />
        </Route>

        <Route
          path="/password"
          element={(
            <ProtectedRoute allowedRoles={['USER', 'MERCHANT', 'ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<ChangePasswordPage />)} />
        </Route>

        <Route
          path="/offers"
          element={(
            <ProtectedRoute allowedRoles={['USER', 'MERCHANT', 'ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<OffersPage />)} />
        </Route>

        <Route
          path="/merchant/dashboard"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<MerchantDashboardPage />)} />
        </Route>

        <Route
          path="/merchant/offers"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<MerchantOffersPage />)} />
        </Route>

        <Route
          path="/merchant/scan"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<MerchantScanPage />)} />
        </Route>

        <Route
          path="/merchant/stats"
          element={(
            <ProtectedRoute allowedRoles={['MERCHANT']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<MerchantStatsPage />)} />
        </Route>

        <Route
          path="/admin/dashboard"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<AdminDashboardPage />)} />
        </Route>

        <Route
          path="/admin/users"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<AdminUsersPage />)} />
        </Route>

        <Route
          path="/admin/merchants"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<AdminMerchantsPage />)} />
        </Route>

        <Route
          path="/admin/cards"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<AdminCardsPage />)} />
        </Route>

        <Route
          path="/admin/offers"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<AdminOffersPage />)} />
        </Route>

        <Route
          path="/admin/card-plans"
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={withRouteLoader(<AdminCardPlansPage />)} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
