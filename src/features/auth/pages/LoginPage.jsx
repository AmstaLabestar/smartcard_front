import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { fetchCurrentUser, loginUser } from '../api/auth.api';
import { prefetchSessionData } from '../lib/prefetchSessionData';
import { loginSchema } from '../schemas/auth.schemas';
import { getDefaultRoute, useAuthStore } from '../store/auth.store';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { useToast } from '../../../shared/components/feedback/ToastProvider';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState('');
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setServerError('');

    try {
      const identifier = values.identifier.trim();
      const payload = identifier.includes('@')
        ? { email: identifier, password: values.password }
        : { phoneNumber: identifier, password: values.password };

      const authResponse = await loginUser(payload);
      const token = authResponse.data.accessToken;
      const meResponse = await fetchCurrentUser(token);
      const user = meResponse.data;

      setSession({ token, user });
      void prefetchSessionData(user.role);
      toast.success('Heureux de vous retrouver sur SmartCard.', 'Connexion reussie');

      const fallbackRoute = getDefaultRoute(user.role);
      const nextRoute = location.state?.from?.pathname || fallbackRoute;
      navigate(nextRoute, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Connexion impossible');
      setServerError(message);
      toast.error(message, 'Connexion impossible');
    }
  };

  return (
    <section className="form-card">
      <h2>Connexion</h2>
      <p className="muted">Accedez a votre espace SmartCard pour retrouver vos avantages, vos offres et vos transactions.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="Email ou numero" {...register('identifier')} />
          {errors.identifier ? <small className="error-text">{errors.identifier.message}</small> : null}
        </div>
        <div>
          <input type="password" placeholder="Mot de passe" {...register('password')} />
          {errors.password ? <small className="error-text">{errors.password.message}</small> : null}
        </div>
        {serverError ? <p className="error-banner">{serverError}</p> : null}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion en cours...' : 'Acceder a mon espace'}
        </button>
      </form>
      <p>
        Nouveau sur SmartCard ? <Link to="/register">Creer mon compte</Link>
      </p>
    </section>
  );
}
