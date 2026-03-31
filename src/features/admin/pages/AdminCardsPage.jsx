import { useQuery } from '@tanstack/react-query';

import { fetchAdminCards } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';

export function AdminCardsPage() {
  const { data } = useQuery({ queryKey: ['admin', 'cards'], queryFn: fetchAdminCards });
  const rows = data?.data || [];

  return (
    <AdminDataTable
      title="Cartes"
      rows={rows}
      emptyMessage="Aucune carte enregistree."
      columns={[
        { key: 'cardNumber', label: 'Numero' },
        { key: 'status', label: 'Statut' },
        { key: 'price', label: 'Prix' },
        { key: 'owner', label: 'Proprietaire', render: (row) => `${row.owner?.firstName || ''} ${row.owner?.lastName || ''}`.trim() },
      ]}
    />
  );
}
