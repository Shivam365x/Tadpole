'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/services/api/auth.api';
import { useAuthStore } from '@/stores/authStore';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSession, setUser } = useAuthStore();
  const [error, setError] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token') || undefined;
    const redirect = params.get('redirect') || '/';

    if (!accessToken) {
      setError('Sign-in did not complete. No token was returned.');
      return;
    }

    setSession({ access_token: accessToken, refresh_token: refreshToken });

    (async () => {
      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
      } catch {
        // Non-fatal: token is set; profile will load later via /auth/me.
      } finally {
        router.replace(redirect.startsWith('/') ? redirect : '/');
      }
    })();
  }, [params, router, setSession, setUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      {error ? (
        <>
          <p className="text-sm text-destructive">{error}</p>
          <Link href="/login" className="text-sm font-medium text-primary-accent hover:underline">
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-primary-accent" />
          <p className="text-sm text-muted-foreground">Signing you in…</p>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-primary-accent" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
