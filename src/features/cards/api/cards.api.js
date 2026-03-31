import { apiClient } from '../../../shared/lib/api-client';

export async function purchaseCard(payload) {
  const { data } = await apiClient.post('/cards/purchase', {
    cardPlanId: payload.cardPlanId,
  });
  return data;
}

export async function activateCard(activationCode) {
  const { data } = await apiClient.post('/cards/activate', { activationCode });
  return data;
}

export async function activateOwnedCard(cardId) {
  const { data } = await apiClient.post(`/cards/${cardId}/activate`);
  return data;
}
