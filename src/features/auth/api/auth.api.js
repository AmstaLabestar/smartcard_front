import { apiClient } from '../../../shared/lib/api-client';

export async function loginUser(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function registerUser(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function fetchCurrentUser(token) {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : undefined;

  const { data } = await apiClient.get('/me', config);
  return data;
}

export async function changeMyPassword(payload) {
  const { data } = await apiClient.patch('/me/password', payload);
  return data;
}
