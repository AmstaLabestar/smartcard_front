import { create } from 'zustand';

import { queryClient } from '../../../app/providers/AppProviders';
import { registerInvalidTokenHandler } from '../../../shared/lib/api-client';

const TOKEN_KEY = 'smartcard_token';

function getDefaultRoute(role) {
  if (role === 'MERCHANT') return '/merchant/dashboard';
  if (role === 'ADMIN') return '/admin/dashboard';
  return '/dashboard';
}

export const useAuthStore = create((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  isBootstrapped: false,
  setSession: ({ token, user }) => {
    queryClient.clear();

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    set({ token, user, isBootstrapped: true });
  },
  setUser: (user) => set({ user, isBootstrapped: true }),
  bootstrapDone: () => set({ isBootstrapped: true }),
  logout: () => {
    queryClient.clear();
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isBootstrapped: true });
  },
  getDefaultRoute,
}));

registerInvalidTokenHandler(() => {
  useAuthStore.getState().logout();
});

export { TOKEN_KEY, getDefaultRoute };
