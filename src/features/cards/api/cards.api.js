import { apiClient } from '../../../shared/lib/api-client';

export async function purchaseCard(payload = {}) {
  const body = {
    title: payload.title || 'SmartCard Reduction',
    ...(payload.description ? { description: payload.description } : {}),
  };

  const { data } = await apiClient.post('/cards/purchase', body);
  return data;
}

export async function activateCard(activationCode) {
  const { data } = await apiClient.post('/cards/activate', { activationCode });
  return data;
}
