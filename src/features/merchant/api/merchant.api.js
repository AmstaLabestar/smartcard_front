import { apiClient } from '../../../shared/lib/api-client';

export async function createMerchantOffer(payload) {
  const { data } = await apiClient.post('/offers', payload);
  return data;
}

export async function updateMerchantOfferStatus({ offerId, status }) {
  const { data } = await apiClient.patch(`/offers/${offerId}/status`, { status });
  return data;
}

export async function scanMerchantTransaction(payload) {
  const { data } = await apiClient.post('/transactions/scan', payload);
  return data;
}
