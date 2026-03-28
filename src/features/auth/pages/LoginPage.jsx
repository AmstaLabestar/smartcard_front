import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginUser, fetchCurrentUser } from '../api/auth.api';
import { loginSchema } from '../schemas/auth.schemas';
import { getDefaultRoute, useAuthStore } from '../store/auth.store';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState('');
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
      const payload = values.identifier.includes('@')
        ? { email: values.identifier, password: values.password }
        : { phoneNumber: values.identifier, password: values.password };

      const authResponse = await loginUser(payload);
      const token = authResponse.data.accessToken;
      const meResponse = await fetchCurrentUser(token);
      const user = meResponse.data;

      setSession({ token, user });

      const fallbackRoute = getDefaultRoute(user.role);
      const nextRoute = location.state?.from?.pathname || fallbackRoute;
      navigate(nextRoute, { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.error?.message || 'Connexion impossible');
    }
  };

  return (
    <section className="form-card">
      <h2>Connexion</h2>
      <p className="muted">Connecte ton compte utilisateur, commercant ou admin.</p>
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
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p>
        Pas encore de compte ? <Link to="/register">Creer un compte</Link>
      </p>
    </section>
  );
}

