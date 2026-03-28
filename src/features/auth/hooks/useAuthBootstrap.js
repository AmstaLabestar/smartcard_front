import { useEffect } from 'react';

import { fetchCurrentUser } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAuthBootstrap() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const bootstrapDone = useAuthStore((state) => state.bootstrapDone);
  const logout = useAuthStore((state) => state.logout);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!token) {
        bootstrapDone();
        return;
      }

      try {
        const response = await fetchCurrentUser();

        if (active) {
          setUser(response.data);
        }
      } catch (_error) {
        if (active) {
          logout();
        }
      }
    }

    if (!isBootstrapped) {
      bootstrap();
    }

    return () => {
      active = false;
    };
  }, [bootstrapDone, isBootstrapped, logout, setUser, token]);
}
