import { useQuery } from '@tanstack/react-query';

import { fetchAdminUsers } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function AdminUsersPage() {
  const { data } = useQuery({ queryKey: ['admin', 'users'], queryFn: fetchAdminUsers });
  const rows = data?.data || [];

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro kicker="Admin" title="Utilisateurs" description="Retrouvez tous les comptes de la plateforme." />
      </section>
      <AdminDataTable
        eyebrow="Users"
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
    </div>
  );
}
