import { useQuery } from '@tanstack/react-query';

import { fetchAdminCards } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function AdminCardsPage() {
  const { data } = useQuery({ queryKey: ['admin', 'cards'], queryFn: fetchAdminCards });
  const rows = data?.data || [];

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro kicker="Admin" title="Cartes" description="Suivez les cartes emises et leur statut." />
      </section>
      <AdminDataTable
        eyebrow="Cartes"
        title="Toutes les cartes"
        rows={rows}
        emptyMessage="Aucune carte enregistree."
        columns={[
          { key: 'cardNumber', label: 'Numero' },
          { key: 'status', label: 'Statut' },
          { key: 'price', label: 'Prix' },
          { key: 'owner', label: 'Proprietaire', render: (row) => `${row.owner?.firstName || ''} ${row.owner?.lastName || ''}`.trim() },
        ]}
      />
    </div>
  );
}
