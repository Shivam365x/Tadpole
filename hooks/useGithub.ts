'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { integrationsApi } from '@/services/api/integrations.api';

// GitHub data changes slowly relative to navigation; cache it for 5 minutes so
// moving between pages serves from cache instead of re-hitting the backend.
const GITHUB_STALE_TIME = 5 * 60 * 1000;

/**
 * Whether the signed-in user has GitHub connected.
 * `connected` is `null` while still resolving, then a boolean.
 */
export function useGithubConnection() {
  const token = useAuthStore((s) => s.token);
  const query = useQuery({
    queryKey: ['github', 'connected'],
    queryFn: () => integrationsApi.isGithubConnected(),
    enabled: !!token,
    staleTime: GITHUB_STALE_TIME,
  });

  const connected: boolean | null = !token
    ? false
    : query.data === undefined
      ? null
      : query.data;

  return { connected, token, refetch: query.refetch, isFetching: query.isFetching };
}

export function useGithubPullRequests(enabled: boolean) {
  return useQuery({
    queryKey: ['github', 'pull-requests'],
    queryFn: () => integrationsApi.githubPullRequests('all'),
    enabled,
    staleTime: GITHUB_STALE_TIME,
  });
}

export function useGithubDeployments(enabled: boolean) {
  return useQuery({
    queryKey: ['github', 'deployments'],
    queryFn: () => integrationsApi.githubDeployments(),
    enabled,
    staleTime: GITHUB_STALE_TIME,
  });
}
