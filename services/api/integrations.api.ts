import { apiRequest } from './client';

export interface IntegrationPublic {
  id: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  account_login?: string | null;
  avatar_url?: string | null;
  scopes?: string | null;
  connected_at?: string | null;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  repository: string;
  author: string;
  html_url: string;
  draft: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  comments: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description?: string | null;
  language?: string | null;
  stargazers_count: number;
  open_issues_count: number;
  updated_at?: string | null;
}

export interface GitHubDeployment {
  id: string;
  service: string;
  environment: string;
  status: string;
  ref: string;
  sha: string;
  description: string;
  creator: string;
  created_at?: string | null;
}

export const integrationsApi = {
  list: () => apiRequest<IntegrationPublic[]>('/integrations', { auth: true }),

  /** Returns true if GitHub is currently connected for the signed-in user. */
  isGithubConnected: async (): Promise<boolean> => {
    try {
      const list = await apiRequest<IntegrationPublic[]>('/integrations', { auth: true });
      return list.some((i) => i.provider === 'github' && i.status === 'connected');
    } catch {
      return false;
    }
  },

  /** Get the GitHub authorize URL and redirect the browser to it. */
  connectGithub: async (redirect = '/integrations'): Promise<void> => {
    const { auth_url } = await apiRequest<{ auth_url: string }>(
      `/integrations/github/connect?redirect=${encodeURIComponent(redirect)}`,
      { auth: true }
    );
    window.location.href = auth_url;
  },

  disconnectGithub: () =>
    apiRequest<{ success: boolean }>('/integrations/github', { method: 'DELETE', auth: true }),

  githubRepos: () => apiRequest<GitHubRepo[]>('/integrations/github/repos', { auth: true }),

  githubPullRequests: (state: 'open' | 'closed' | 'all' = 'open') =>
    apiRequest<{ total: number; items: GitHubPullRequest[] }>(
      `/integrations/github/pull-requests?state=${state}`,
      { auth: true }
    ),

  githubDeployments: () =>
    apiRequest<{ total: number; items: GitHubDeployment[] }>(
      '/integrations/github/deployments',
      { auth: true }
    ),
};
