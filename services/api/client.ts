/**
 * Lightweight fetch client for the Tedpole backend.
 *
 * - Prefixes requests with the API base + version.
 * - Attaches the bearer access token from the auth store.
 * - Transparently refreshes the access token once on a 401, then retries.
 * - Normalizes FastAPI error payloads into a thrown `ApiError`.
 */
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function extractError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const detail = (payload as Record<string, unknown>).detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => (d && typeof d === 'object' ? (d as Record<string, unknown>).msg : null))
      .filter(Boolean);
    if (msgs.length) return msgs.join(', ');
  }
  return fallback;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  retryOn401?: boolean;
}

async function attemptRefresh(): Promise<boolean> {
  const { refreshToken, setSession, logout } = useAuthStore.getState();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      logout();
      return false;
    }
    const data = await res.json();
    setSession(data);
    return true;
  } catch {
    logout();
    return false;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  { method = 'GET', body, auth = false, retryOn401 = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retryOn401) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return apiRequest<T>(path, { method, body, auth, retryOn401: false });
    }
  }

  if (res.status === 204) return undefined as T;

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(extractError(payload, `Request failed (${res.status})`), res.status);
  }

  return payload as T;
}

export const apiConfig = { API_BASE, API_PREFIX };
