import { useQuery } from '@tanstack/react-query';

import { fetchAdminMerchants } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';

export function AdminMerchantsPage() {
  const { data } = useQuery({ queryKey: ['admin', 'merchants'], queryFn: fetchAdminMerchants });
  const rows = data?.data || [];

  return (
    <AdminDataTable
      title="Commercants"
      rows={rows}
      emptyMessage="Aucun commercant enregistre."
      columns={[
        { key: 'firstName', label: 'Prenom' },
        { key: 'lastName', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Telephone' },
      ]}
    />
  );
}
