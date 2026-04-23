import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { resetPassword } from '../api/auth.api';
import { resetPasswordSchema } from '../schemas/auth.schemas';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function ResetPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() || '', [searchParams]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Votre mot de passe a ete reinitialise.', 'Mot de passe');
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Reinitialisation impossible');
      toast.error(message, 'Mot de passe');
    },
  });

  const onSubmit = (values) => {
    if (!token) {
      toast.error('Le lien de reinitialisation est incomplet.', 'Mot de passe');
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: values.newPassword,
    });
  };

  return (
    <section className="form-card">
      <h2>Nouveau mot de passe</h2>
      <p className="muted">Choisissez un nouveau mot de passe pour reprendre l acces a votre compte.</p>
      {!token ? <p className="error-banner">Le lien de reinitialisation est invalide ou incomplet.</p> : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="password" placeholder="Nouveau mot de passe" {...register('newPassword')} />
          {errors.newPassword ? <small className="error-text">{errors.newPassword.message}</small> : null}
        </div>
        <div>
          <input type="password" placeholder="Confirmer le nouveau mot de passe" {...register('confirmPassword')} />
          {errors.confirmPassword ? <small className="error-text">{errors.confirmPassword.message}</small> : null}
        </div>
        <button className="primary-button" type="submit" disabled={resetPasswordMutation.isPending || !token}>
          {resetPasswordMutation.isPending ? 'Reinitialisation...' : 'Reinitialiser le mot de passe'}
        </button>
      </form>
      <p>
        <Link to="/login">Retour a la connexion</Link>
      </p>
    </section>
  );
}
