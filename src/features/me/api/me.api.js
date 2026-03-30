import { apiClient } from '../../../shared/lib/api-client';

export async function fetchMe() {
  const { data } = await apiClient.get('/me');
  return data;
}

export async function fetchMyCard() {
  const { data } = await apiClient.get('/me/card');
  return data;
}

export async function fetchMyTransactions() {
  const { data } = await apiClient.get('/me/transactions');
  return data;
}
