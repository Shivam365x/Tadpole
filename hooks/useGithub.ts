'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { integrationsApi } from '@/services/api/integrations.api';

/** Tracks whether the signed-in user has GitHub connected. */
export function useGithubConnection() {
  const { token } = useAuthStore();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      setConnected(false);
      return;
    }
    integrationsApi
      .isGithubConnected()
      .then((c) => active && setConnected(c))
      .catch(() => active && setConnected(false));
    return () => {
      active = false;
    };
  }, [token]);

  return { connected, token };
}
