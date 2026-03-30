import { apiClient } from '../../../shared/lib/api-client';

export async function fetchActiveOffers() {
  const { data } = await apiClient.get('/offers');
  return data;
}

export async function fetchMerchantOffers() {
  const { data } = await apiClient.get('/offers/mine');
  return data;
}

export async function fetchOfferCatalog() {
  const { data } = await apiClient.get('/offers');
  return data;
}
