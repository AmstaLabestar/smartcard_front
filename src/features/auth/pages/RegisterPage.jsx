import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { fetchCurrentUser, registerUser } from '../api/auth.api';
import { registerSchema } from '../schemas/auth.schemas';
import { getDefaultRoute, useAuthStore } from '../store/auth.store';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState('');
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'USER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    setServerError('');

    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        role: values.role,
        ...(values.email ? { email: values.email } : {}),
        ...(values.phoneNumber ? { phoneNumber: values.phoneNumber } : {}),
      };

      const authResponse = await registerUser(payload);
      const token = authResponse.data.accessToken;
      const meResponse = await fetchCurrentUser(token);
      const user = meResponse.data;

      setSession({ token, user });
      toast.success('Votre compte est pret. Vous pouvez commencer a profiter de SmartCard.', 'Bienvenue');
      navigate(getDefaultRoute(user.role), { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Inscription impossible');
      setServerError(message);
      toast.error(message, 'Inscription impossible');
    }
  };

  return (
    <section className="form-card">
      <h2>Creer un compte</h2>
      <p className="muted">Rejoignez SmartCard et accedez rapidement a des reductions reservees a votre profil.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="segmented-control">
          <label>
            <input type="radio" value="USER" {...register('role')} />
            <span>Client</span>
          </label>
          <label>
            <input type="radio" value="MERCHANT" {...register('role')} />
            <span>Partenaire</span>
          </label>
        </div>
        <div>
          <input type="text" placeholder="Prenom" {...register('firstName')} />
          {errors.firstName ? <small className="error-text">{errors.firstName.message}</small> : null}
        </div>
        <div>
          <input type="text" placeholder="Nom" {...register('lastName')} />
          {errors.lastName ? <small className="error-text">{errors.lastName.message}</small> : null}
        </div>
        <div>
          <input type="email" placeholder="Email" {...register('email')} />
          {errors.email ? <small className="error-text">{errors.email.message}</small> : null}
        </div>
        <div>
          <input type="text" placeholder={selectedRole === 'MERCHANT' ? 'Numero professionnel ou mobile' : 'Numero de telephone'} {...register('phoneNumber')} />
          {errors.phoneNumber ? <small className="error-text">{errors.phoneNumber.message}</small> : null}
        </div>
        <div>
          <input type="password" placeholder="Mot de passe" {...register('password')} />
          {errors.password ? <small className="error-text">{errors.password.message}</small> : null}
        </div>
        {serverError ? <p className="error-banner">{serverError}</p> : null}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creation du compte...' : 'Commencer avec SmartCard'}
        </button>
      </form>
      <p>
        Vous avez deja un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </section>
  );
}
