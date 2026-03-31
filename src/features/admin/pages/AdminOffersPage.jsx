import { useQuery } from '@tanstack/react-query';

import { fetchAdminOffers } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';
import { PageIntro } from '../../../shared/ui/PageIntro';

export function AdminOffersPage() {
  const { data } = useQuery({ queryKey: ['admin', 'offers'], queryFn: fetchAdminOffers });
  const rows = data?.data || [];

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro kicker="Admin" title="Offres" description="Surveillez l inventaire global des offres partenaires." />
      </section>
      <AdminDataTable
        eyebrow="Offres"
        title="Toutes les offres"
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
    </div>
  );
}
