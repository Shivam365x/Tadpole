import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/services/types';

/** Shape of the backend user (UserPublic) used for mapping. */
export interface ApiUser {
  id: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  email_verified?: boolean;
  full_name?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  job_title?: string | null;
  company?: string | null;
  location?: string | null;
  timezone?: string | null;
  phone_number?: string | null;
  website?: string | null;
  workspace_id?: string | null;
}

export interface AuthResultPayload {
  user?: ApiUser;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

/** Map the backend user payload to the frontend `User` shape. */
export function mapApiUser(api: ApiUser): User {
  return {
    id: api.id,
    email: api.email,
    name: api.full_name || api.display_name || api.email.split('@')[0],
    avatar: api.avatar_url || undefined,
    role: api.role,
    workspaceId: api.workspace_id || 'ws-1',
    emailVerified: api.email_verified,
    displayName: api.display_name || undefined,
    bio: api.bio || undefined,
    jobTitle: api.job_title || undefined,
    company: api.company || undefined,
    location: api.location || undefined,
    timezone: api.timezone || undefined,
    phoneNumber: api.phone_number || undefined,
    website: api.website || undefined,
  };
}

interface AuthState {
  user: User | null;
  token: string | null; // access token
  refreshToken: string | null;
  isAuthenticated: boolean;
  /** True when the user chose "skip for now" to browse without signing in. */
  skipAuth: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  /** Store a full auth result (tokens + optional user) from the backend. */
  setSession: (payload: AuthResultPayload) => void;
  setSkipAuth: (skip: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      skipAuth: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setSession: (payload) =>
        set((state) => ({
          token: payload.access_token,
          refreshToken: payload.refresh_token ?? state.refreshToken,
          user: payload.user ? mapApiUser(payload.user) : state.user,
          isAuthenticated: true,
          skipAuth: false,
        })),
      setSkipAuth: (skip) => set({ skipAuth: skip }),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          skipAuth: false,
        }),
    }),
    {
      name: 'tedpole-auth',
    }
  )
);
