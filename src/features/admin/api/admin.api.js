import { apiClient } from '../../../shared/lib/api-client';

export async function fetchAdminUsers() {
  const { data } = await apiClient.get('/users/admin/all');
  return data;
}

export async function fetchAdminMerchants() {
  const { data } = await apiClient.get('/users/admin/merchants');
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
