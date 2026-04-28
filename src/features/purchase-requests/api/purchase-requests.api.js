import { apiClient } from '../../../shared/lib/api-client';

export async function fetchMyPurchaseRequests(params = {}) {
  const { data } = await apiClient.get('/purchase-requests/me', { params });
  return data;
}

export async function createPurchaseRequest(payload) {
  const { data } = await apiClient.post('/purchase-requests', payload);
  return data;
}
