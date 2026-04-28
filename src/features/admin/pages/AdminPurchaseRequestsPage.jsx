import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  approveAdminPurchaseRequest,
  fetchAdminPurchaseRequests,
  rejectAdminPurchaseRequest,
} from '../api/admin.api';
import { PageIntro } from '../../../shared/ui/PageIntro';
import { EmptyState } from '../../../shared/components/states/EmptyState';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'APPROVED', label: 'Acceptees' },
  { value: 'REJECTED', label: 'Refusees' },
];

function formatDateTime(value) {
  if (!value) {
    return 'Date indisponible';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function AdminPurchaseRequestsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
      ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
    }),
    [statusFilter],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'purchase-requests', queryParams],
    queryFn: () => fetchAdminPurchaseRequests(queryParams),
  });

  const requests = data?.data || [];

  const refreshPurchaseRequests = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'purchase-requests'] });
    await queryClient.invalidateQueries({ queryKey: ['admin', 'cards'] });
    await queryClient.invalidateQueries({ queryKey: ['admin', 'card-plans'] });
  };

  const approveMutation = useMutation({
    mutationFn: approveAdminPurchaseRequest,
    onSuccess: async () => {
      toast.success('La demande a ete acceptee et la carte est maintenant disponible.', 'Demandes');
      await refreshPurchaseRequests();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Validation impossible'), 'Demandes');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAdminPurchaseRequest,
    onSuccess: async () => {
      setRejectTarget(null);
      setRejectionReason('');
      toast.success('La demande a ete refusee.', 'Demandes');
      await refreshPurchaseRequests();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Refus impossible'), 'Demandes');
    },
  });

  const handleApprove = (purchaseRequestId) => {
    approveMutation.mutate(purchaseRequestId);
  };

  const handleRejectSubmit = (event) => {
    event.preventDefault();

    if (!rejectTarget) {
      return;
    }

    rejectMutation.mutate({
      purchaseRequestId: rejectTarget.id,
      rejectionReason,
    });
  };

  return (
    <div className="premium-page-stack admin-purchase-requests-page">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro
          kicker="Admin"
          title="Demandes d'achat"
          description="Validez les paiements cash avant d emettre les cartes."
        />
      </section>

      <section className="content-card premium-support-card admin-purchase-requests-toolbar">
        <div className="admin-purchase-requests-filters" role="tablist" aria-label="Filtres des demandes">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={filter.value === statusFilter ? 'primary-button admin-filter-chip active' : 'secondary-button admin-filter-chip'}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-purchase-requests-grid">
        {isLoading ? (
          <div className="content-card premium-support-card">
            <p className="muted">Chargement des demandes...</p>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="Aucune demande"
            description="Aucune demande ne correspond a ce filtre."
          />
        ) : (
          requests.map((request) => {
            const isPending = request.status === 'PENDING';
            const isApproving = approveMutation.isPending && approveMutation.variables === request.id;

            return (
              <article key={request.id} className="content-card premium-support-card admin-purchase-request-card">
                <div className="admin-purchase-request-head">
                  <div>
                    <p className="eyebrow">Demande</p>
                    <h3>{request.cardPlan?.name || 'Carte SmartCard'}</h3>
                    <p className="muted">
                      {request.user?.firstName || 'Client'} {request.user?.lastName || ''}
                    </p>
                  </div>
                  <span
                    className={[
                      'status-pill',
                      request.status === 'APPROVED'
                        ? 'status-active'
                        : request.status === 'PENDING'
                          ? 'status-pending'
                          : 'status-inactive',
                    ].join(' ')}
                  >
                    {request.status === 'PENDING'
                      ? 'En attente'
                      : request.status === 'APPROVED'
                        ? 'Acceptee'
                        : 'Refusee'}
                  </span>
                </div>

                <div className="admin-purchase-request-meta">
                  <p><strong>Prix :</strong> {request.cardPlan?.price || '--'}</p>
                  <p><strong>Date :</strong> {formatDateTime(request.createdAt)}</p>
                  <p><strong>Email :</strong> {request.user?.email || 'Non renseigne'}</p>
                  <p><strong>Telephone :</strong> {request.user?.phoneNumber || 'Non renseigne'}</p>
                </div>

                {request.note ? <p className="admin-purchase-request-note">{request.note}</p> : null}
                {request.rejectionReason ? <p className="admin-purchase-request-note admin-purchase-request-note-danger">{request.rejectionReason}</p> : null}

                <div className="admin-purchase-request-actions">
                  <button
                    type="button"
                    className="primary-button admin-request-action-button"
                    onClick={() => handleApprove(request.id)}
                    disabled={!isPending || isApproving}
                  >
                    {isApproving ? 'Validation...' : 'Accepter'}
                  </button>
                  <button
                    type="button"
                    className="secondary-button admin-request-action-button"
                    onClick={() => {
                      setRejectTarget(request);
                      setRejectionReason('');
                    }}
                    disabled={!isPending}
                  >
                    Rejeter
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {rejectTarget ? (
        <div className="admin-users-modal-backdrop" role="presentation" onClick={() => setRejectTarget(null)}>
          <section
            className="admin-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-reject-request-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-users-modal-head">
              <div>
                <p className="eyebrow">Demandes</p>
                <h2 id="admin-reject-request-title">Refuser la demande</h2>
              </div>
              <button
                type="button"
                className="admin-users-modal-close"
                onClick={() => setRejectTarget(null)}
                aria-label="Fermer"
              >
                x
              </button>
            </div>

            <form className="stack-form admin-users-form" onSubmit={handleRejectSubmit}>
              <p className="muted">
                Tu peux ajouter une raison courte pour aider l equipe a suivre le paiement.
              </p>

              <textarea
                className="admin-purchase-request-textarea"
                placeholder="Raison du refus"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                rows={4}
              />

              <div className="admin-users-form-actions">
                <button type="button" className="secondary-button" onClick={() => setRejectTarget(null)}>
                  Annuler
                </button>
                <button type="submit" className="primary-button" disabled={rejectMutation.isPending}>
                  {rejectMutation.isPending ? 'Refus...' : 'Confirmer le refus'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
