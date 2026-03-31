import { useQuery } from '@tanstack/react-query';

import { fetchAdminMerchants } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function AdminMerchantsPage() {
  const { data } = useQuery({ queryKey: ['admin', 'merchants'], queryFn: fetchAdminMerchants });
  const rows = data?.data || [];

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro kicker="Admin" title="Merchants" description="Retrouvez les partenaires du reseau SmartCard." />
      </section>
      <AdminDataTable
        eyebrow="Merchants"
        title="Tous les merchants"
        rows={rows}
        emptyMessage="Aucun commercant enregistre."
        columns={[
          { key: 'firstName', label: 'Prenom' },
          { key: 'lastName', label: 'Nom' },
          { key: 'email', label: 'Email' },
          { key: 'phoneNumber', label: 'Telephone' },
        ]}
      />
    </div>
  );
}
