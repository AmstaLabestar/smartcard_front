import { apiClient } from '../../../shared/lib/api-client';

export async function fetchCardPlans() {
  const { data } = await apiClient.get('/card-plans');
  return data;
}

export async function fetchCardPlan(cardPlanId) {
  const { data } = await apiClient.get(`/card-plans/${cardPlanId}`);
  return data;
}
