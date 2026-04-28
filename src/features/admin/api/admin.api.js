import { apiClient } from '../../../shared/lib/api-client';

export async function fetchAdminUsers() {
  const { data } = await apiClient.get('/users/admin/all');
  return data;
}

export async function fetchAdminMerchants() {
  const { data } = await apiClient.get('/users/admin/merchants');
  return data;
}

export async function createAdminMerchant(payload) {
  const { data } = await apiClient.post('/users/admin/merchants', payload);
  return data;
}

export async function updateAdminUserStatus({ userId, status }) {
  const { data } = await apiClient.patch(`/users/admin/${userId}/status`, { status });
  return data;
}

export async function resetAdminUserPassword({ userId, newPassword }) {
  const { data } = await apiClient.patch(`/users/admin/${userId}/password`, { newPassword });
  return data;
}

export async function fetchAdminCards() {
  const { data } = await apiClient.get('/cards/admin/all');
  return data;
}

export async function fetchAdminOffers() {
  const { data } = await apiClient.get('/offers/admin/all');
  return data;
}

export async function fetchAdminCardPlans() {
  const { data } = await apiClient.get('/card-plans/admin/all');
  return data;
}

export async function fetchAdminPurchaseRequests(params = {}) {
  const { data } = await apiClient.get('/purchase-requests/admin/all', { params });
  return data;
}

export async function approveAdminPurchaseRequest(purchaseRequestId) {
  const { data } = await apiClient.patch(`/purchase-requests/admin/${purchaseRequestId}/approve`);
  return data;
}

export async function rejectAdminPurchaseRequest({ purchaseRequestId, rejectionReason }) {
  const { data } = await apiClient.patch(`/purchase-requests/admin/${purchaseRequestId}/reject`, {
    rejectionReason,
  });
  return data;
}

export async function createAdminCardPlan(payload) {
  const { data } = await apiClient.post('/card-plans', payload);
  return data;
}

export async function updateAdminCardPlanStatus({ cardPlanId, status }) {
  const { data } = await apiClient.patch(`/card-plans/${cardPlanId}/status`, { status });
  return data;
}

export async function replaceAdminCardPlanOffers({ cardPlanId, offerIds }) {
  const { data } = await apiClient.put(`/card-plans/${cardPlanId}/offers`, { offerIds });
  return data;
}
