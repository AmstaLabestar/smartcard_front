import { useQuery } from '@tanstack/react-query';

import { fetchAdminOffers } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';

export function AdminOffersPage() {
  const { data } = useQuery({ queryKey: ['admin', 'offers'], queryFn: fetchAdminOffers });
  const rows = data?.data || [];

  return (
    <AdminDataTable
      title="Offres"
      rows={rows}
      emptyMessage="Aucune offre enregistree."
      columns={[
        { key: 'title', label: 'Titre' },
        { key: 'status', label: 'Statut' },
        { key: 'discountType', label: 'Type' },
        { key: 'discountValue', label: 'Valeur' },
        { key: 'creator', label: 'Merchant', render: (row) => `${row.creator?.firstName || ''} ${row.creator?.lastName || ''}`.trim() },
      ]}
    />
  );
}
