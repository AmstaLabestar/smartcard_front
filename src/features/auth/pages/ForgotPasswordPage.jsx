import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { requestPasswordReset } from '../api/auth.api';
import { forgotPasswordSchema } from '../schemas/auth.schemas';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function ForgotPasswordPage() {
  const toast = useToast();
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      const message = 'Si cet email existe chez SmartCard, un lien de reinitialisation vient d etre envoye.';
      reset();
      setSuccessMessage(message);
      toast.success(message, 'Mot de passe');
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Envoi impossible');
      setSuccessMessage('');
      toast.error(message, 'Mot de passe');
    },
  });

  const onSubmit = (values) => {
    setSuccessMessage('');
    forgotPasswordMutation.mutate(values);
  };

  return (
    <section className="form-card">
      <h2>Mot de passe oublie</h2>
      <p className="muted">Entrez votre email. Nous vous enverrons un lien pour reinitialiser votre mot de passe.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="email" placeholder="Email" {...register('email')} />
          {errors.email ? <small className="error-text">{errors.email.message}</small> : null}
        </div>
        {successMessage ? <p className="success-banner">{successMessage}</p> : null}
        <button className="primary-button" type="submit" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? 'Envoi...' : 'Recevoir le lien'}
        </button>
      </form>
      <p>
        <Link to="/login">Retour a la connexion</Link>
      </p>
    </section>
  );
}
