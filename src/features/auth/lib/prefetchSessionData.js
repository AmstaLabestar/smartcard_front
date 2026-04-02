import { queryClient } from '../../../app/providers/AppProviders';
import { fetchAdminCardPlans, fetchAdminCards, fetchAdminMerchants, fetchAdminOffers, fetchAdminUsers } from '../../admin/api/admin.api';
import { fetchCardPlans } from '../../card-plans/api/card-plans.api';
import { fetchMyActiveCard, fetchMyCards } from '../../me/api/me.api';
import { fetchActiveOffers, fetchMerchantOffers } from '../../offers/api/offers.api';
import { fetchMerchantTransactions } from '../../transactions/api/transactions.api';

const prefetchersByRole = {
  USER: [
    { queryKey: ['me', 'cards', 'active'], queryFn: fetchMyActiveCard },
    { queryKey: ['me', 'cards'], queryFn: fetchMyCards },
    { queryKey: ['offers', 'active'], queryFn: fetchActiveOffers },
    { queryKey: ['card-plans', 'public'], queryFn: fetchCardPlans },
  ],
  MERCHANT: [
    { queryKey: ['merchant', 'offers'], queryFn: fetchMerchantOffers },
    { queryKey: ['merchant', 'transactions'], queryFn: fetchMerchantTransactions },
  ],
  ADMIN: [
    { queryKey: ['admin', 'users'], queryFn: fetchAdminUsers },
    { queryKey: ['admin', 'merchants'], queryFn: fetchAdminMerchants },
    { queryKey: ['admin', 'cards'], queryFn: fetchAdminCards },
    { queryKey: ['admin', 'offers'], queryFn: fetchAdminOffers },
    { queryKey: ['admin', 'card-plans'], queryFn: fetchAdminCardPlans },
  ],
};

export function prefetchSessionData(role) {
  const prefetchers = prefetchersByRole[role] || [];

  return Promise.allSettled(
    prefetchers.map(({ queryKey, queryFn }) =>
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
      }),
    ),
  );
}
