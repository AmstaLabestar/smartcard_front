import { useQuery } from '@tanstack/react-query';

import { fetchAdminUsers } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';

export function AdminUsersPage() {
  const { data } = useQuery({ queryKey: ['admin', 'users'], queryFn: fetchAdminUsers });
  const rows = data?.data || [];

  return (
    <AdminDataTable
      title="Tous les utilisateurs"
      rows={rows}
      emptyMessage="Aucun utilisateur enregistre."
      columns={[
        { key: 'firstName', label: 'Prenom' },
        { key: 'lastName', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Telephone' },
        { key: 'role', label: 'Role' },
      ]}
    />
  );
}
