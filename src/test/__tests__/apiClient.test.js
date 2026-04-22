import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient, registerInvalidTokenHandler } from '../../shared/lib/api-client';

describe('apiClient invalid token handling', () => {
  beforeEach(() => {
    localStorage.clear();
    registerInvalidTokenHandler(null);
  });

  it('clears the stored token and calls the handler on INVALID_TOKEN responses', async () => {
    const onInvalidToken = vi.fn();
    registerInvalidTokenHandler(onInvalidToken);
    localStorage.setItem('smartcard_token', 'stale-token');

    const rejectedHandler = apiClient.interceptors.response.handlers[0].rejected;
    const error = {
      response: {
        status: 401,
        data: {
          error: {
            code: 'INVALID_TOKEN',
          },
        },
      },
    };

    await expect(rejectedHandler(error)).rejects.toBe(error);

    expect(localStorage.getItem('smartcard_token')).toBeNull();
    expect(onInvalidToken).toHaveBeenCalledTimes(1);
  });
});
