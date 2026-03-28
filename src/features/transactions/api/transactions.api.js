import { apiClient } from '../../../shared/lib/api-client';

export async function fetchMerchantTransactions() {
  const { data } = await apiClient.get('/transactions/merchant');
  return data;
}
