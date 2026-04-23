import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createAdminMerchant, fetchAdminUsers, resetAdminUserPassword, updateAdminUserStatus } from '../api/admin.api';
import { AdminDataTable } from '../components/AdminDataTable';
import { PageIntro } from '../../../shared/ui/PageIntro';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';
import { useAuthStore } from '../../auth/store/auth.store';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
};

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const currentUser = useAuthStore((state) => state.user);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [passwordResetTarget, setPasswordResetTarget] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [passwordResetValue, setPasswordResetValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const { data } = useQuery({ queryKey: ['admin', 'users'], queryFn: fetchAdminUsers });
  const rows = data?.data || [];

  const createMerchantMutation = useMutation({
    mutationFn: createAdminMerchant,
    onSuccess: () => {
      setFeedback('Merchant cree.');
      setForm(initialForm);
      setIsCreateOpen(false);
      toast.success('Merchant cree.', 'Nouveau merchant');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Creation impossible');
      setFeedback(message);
      toast.error(message, 'Creation impossible');
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: updateAdminUserStatus,
    onSuccess: (response) => {
      const updatedUser = response.data;
      const nextLabel = updatedUser.status === 'DISABLED' ? 'Compte desactive.' : 'Compte reactive.';
      toast.success(nextLabel, 'Utilisateurs');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Mise a jour impossible');
      toast.error(message, 'Utilisateurs');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetAdminUserPassword,
    onSuccess: () => {
      setPasswordResetValue('');
      setPasswordResetTarget(null);
      toast.success('Mot de passe reinitialise.', 'Utilisateurs');
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Reinitialisation impossible');
      toast.error(message, 'Utilisateurs');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('');
    createMerchantMutation.mutate({
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      ...(form.email ? { email: form.email } : {}),
      ...(form.phoneNumber ? { phoneNumber: form.phoneNumber } : {}),
    });
  };

  const handleStatusChange = (user) => {
    const nextStatus = user.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
    const actionLabel = nextStatus === 'DISABLED' ? 'desactiver' : 'reactiver';

    if (!window.confirm(`Voulez-vous ${actionLabel} ce compte ?`)) {
      return;
    }

    updateUserStatusMutation.mutate({
      userId: user.id,
      status: nextStatus,
    });
  };

  const handlePasswordResetSubmit = (event) => {
    event.preventDefault();

    if (!passwordResetTarget) {
      return;
    }

    resetPasswordMutation.mutate({
      userId: passwordResetTarget.id,
      newPassword: passwordResetValue,
    });
  };

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro kicker="Admin" title="Utilisateurs" description="Retrouvez tous les comptes de la plateforme." />
      </section>

      <section className="content-card premium-support-card admin-users-toolbar">
        <button type="button" className="primary-button admin-users-toolbar-button" onClick={() => setIsCreateOpen(true)}>
          Nouveau merchant
        </button>
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
          {
            key: 'status',
            label: 'Statut',
            render: (row) => (
              <span className={`status-pill ${row.status === 'DISABLED' ? 'status-inactive' : 'status-active'}`}>
                {row.status === 'DISABLED' ? 'Desactive' : 'Actif'}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => {
              const isSelf = currentUser?.id === row.id;
              const isPending = updateUserStatusMutation.isPending && updateUserStatusMutation.variables?.userId === row.id;
              const nextActionLabel = row.status === 'DISABLED' ? 'Reactiver' : 'Desactiver';

              return (
                <div className="admin-users-actions admin-users-actions-stack">
                  <button
                    type="button"
                    className="primary-button admin-users-action-button"
                    onClick={() => handleStatusChange(row)}
                    disabled={isPending || isSelf}
                    title={isSelf ? 'Vous ne pouvez pas modifier votre propre statut ici.' : undefined}
                  >
                    {isPending ? 'Mise a jour...' : nextActionLabel}
                  </button>
                  <button
                    type="button"
                    className="primary-button alt-button admin-users-action-button"
                    onClick={() => {
                      setPasswordResetTarget(row);
                      setPasswordResetValue('');
                    }}
                  >
                    Reset MDP
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      {isCreateOpen ? (
        <div className="admin-users-modal-backdrop" role="presentation" onClick={() => setIsCreateOpen(false)}>
          <section
            className="admin-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-create-merchant-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-users-modal-head">
              <div>
                <p className="eyebrow">Merchant</p>
                <h2 id="admin-create-merchant-title">Nouveau merchant</h2>
              </div>
              <button
                type="button"
                className="admin-users-modal-close"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form className="stack-form admin-users-form" onSubmit={handleSubmit}>
              <div className="admin-users-form-row">
                <input placeholder="Prenom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Telephone" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              <input
                type="password"
                placeholder="Mot de passe initial"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              {feedback ? <p className={createMerchantMutation.isError ? 'error-banner' : 'success-banner'}>{feedback}</p> : null}

              <div className="admin-users-form-actions">
                <button type="button" className="primary-button alt-button" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="primary-button" disabled={createMerchantMutation.isPending}>
                  {createMerchantMutation.isPending ? 'Creation...' : 'Creer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {passwordResetTarget ? (
        <div className="admin-users-modal-backdrop" role="presentation" onClick={() => setPasswordResetTarget(null)}>
          <section
            className="admin-users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-reset-password-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-users-modal-head">
              <div>
                <p className="eyebrow">Securite</p>
                <h2 id="admin-reset-password-title">Reset mot de passe</h2>
              </div>
              <button
                type="button"
                className="admin-users-modal-close"
                onClick={() => setPasswordResetTarget(null)}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form className="stack-form admin-users-form" onSubmit={handlePasswordResetSubmit}>
              <p className="muted">
                Nouveau mot de passe pour {passwordResetTarget.firstName || passwordResetTarget.email || 'cet utilisateur'}.
              </p>

              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={passwordResetValue}
                minLength={8}
                onChange={(event) => setPasswordResetValue(event.target.value)}
                required
              />

              <div className="admin-users-form-actions">
                <button type="button" className="primary-button alt-button" onClick={() => setPasswordResetTarget(null)}>
                  Annuler
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={resetPasswordMutation.isPending || passwordResetValue.trim().length < 8}
                >
                  {resetPasswordMutation.isPending ? 'Reinitialisation...' : 'Reinitialiser'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
