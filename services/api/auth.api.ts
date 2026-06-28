import { apiRequest, apiConfig } from './client';
import { ApiUser, AuthResultPayload, mapApiUser } from '@/stores/authStore';
import { User } from '../types';

export type OTPPurpose = 'login' | 'signup' | 'verify_email';

export interface SignupInput {
  email: string;
  password: string;
  full_name: string;
}

export interface SignupResult {
  requires_otp: boolean;
  email: string;
  message: string;
}

export interface OTPSentResult {
  success: boolean;
  channel: string;
  expires_in: number;
  resend_after: number;
}

export const authApi = {
  /** Register a new account. Triggers a signup OTP to the user's email. */
  signup: (data: SignupInput): Promise<SignupResult> =>
    apiRequest<SignupResult>('/auth/signup', { method: 'POST', body: data }),

  /** Email + password login. Returns tokens + user. */
  login: (email: string, password: string): Promise<AuthResultPayload> =>
    apiRequest<AuthResultPayload>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  /** Request an OTP code (passwordless login, signup verification, etc.). */
  requestOtp: (email: string, purpose: OTPPurpose): Promise<OTPSentResult> =>
    apiRequest<OTPSentResult>('/auth/otp/request', {
      method: 'POST',
      body: { email, purpose },
    }),

  resendOtp: (email: string, purpose: OTPPurpose): Promise<OTPSentResult> =>
    apiRequest<OTPSentResult>('/auth/otp/resend', {
      method: 'POST',
      body: { email, purpose },
    }),

  /** Verify an OTP code. On success returns tokens + user. */
  verifyOtp: (email: string, code: string, purpose: OTPPurpose): Promise<AuthResultPayload> =>
    apiRequest<AuthResultPayload>('/auth/otp/verify', {
      method: 'POST',
      body: { email, code, purpose },
    }),

  /** Get the Google authorization URL to redirect the browser to. */
  googleStart: (redirect = '/'): Promise<{ auth_url: string }> =>
    apiRequest<{ auth_url: string }>(
      `/auth/oauth/google/start?redirect=${encodeURIComponent(redirect)}`
    ),

  /** Convenience: kick off the Google SSO redirect. */
  googleLogin: async (redirect = '/'): Promise<void> => {
    const { auth_url } = await authApi.googleStart(redirect);
    window.location.href = auth_url;
  },

  logout: (): Promise<void> => apiRequest<void>('/auth/logout', { method: 'POST', auth: true }),

  getCurrentUser: async (): Promise<User> => {
    const api = await apiRequest<ApiUser>('/auth/me', { auth: true });
    return mapApiUser(api);
  },
};

export { apiConfig };
