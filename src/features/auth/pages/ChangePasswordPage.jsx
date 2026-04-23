import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { changeMyPassword } from '../api/auth.api';
import { changePasswordSchema } from '../schemas/auth.schemas';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { PageIntro } from '../../../shared/ui/PageIntro';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function ChangePasswordPage() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changeMyPassword,
    onSuccess: () => {
      reset();
      toast.success('Votre mot de passe a ete mis a jour.', 'Mot de passe');
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, 'Mise a jour impossible');
      toast.error(message, 'Mot de passe');
    },
  });

  const onSubmit = (values) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div className="premium-page-stack">
      <section className="panel content-card premium-hero-card premium-hero-card-soft">
        <PageIntro kicker="Securite" title="Mot de passe" description="Mettez a jour votre mot de passe en toute securite." />
      </section>

      <section className="content-card premium-support-card password-settings-card">
        <form className="stack-form password-settings-form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input type="password" placeholder="Mot de passe actuel" {...register('currentPassword')} />
            {errors.currentPassword ? <small className="error-text">{errors.currentPassword.message}</small> : null}
          </div>

          <div>
            <input type="password" placeholder="Nouveau mot de passe" {...register('newPassword')} />
            {errors.newPassword ? <small className="error-text">{errors.newPassword.message}</small> : null}
          </div>

          <div>
            <input type="password" placeholder="Confirmer le nouveau mot de passe" {...register('confirmPassword')} />
            {errors.confirmPassword ? <small className="error-text">{errors.confirmPassword.message}</small> : null}
          </div>

          <button type="submit" className="primary-button password-settings-button" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Mise a jour...' : 'Mettre a jour'}
          </button>
        </form>
      </section>
    </div>
  );
}
