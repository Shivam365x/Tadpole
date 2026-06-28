'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { AuthShell, GoogleIcon } from '@/components/auth/AuthShell';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/api/auth.api';
import { useAuthStore } from '@/stores/authStore';

type Mode = 'password' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { setSession, setSkipAuth } = useAuthStore();

  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startResendCountdown = (seconds: number) => {
    setResendIn(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1 && timerRef.current) clearInterval(timerRef.current);
        return s - 1;
      });
    }, 1000);
  };

  const finish = () => router.push('/');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await authApi.login(email, password);
      setSession(result);
      finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.requestOtp(email, 'login');
      setOtpSent(true);
      startResendCountdown(res.resend_after || 30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await authApi.verifyOtp(email, code, 'login');
      setSession(result);
      finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError('');
    try {
      const res = await authApi.resendOtp(email, 'login');
      startResendCountdown(res.resend_after || 30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend code.');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await authApi.googleLogin('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in is unavailable.');
      setGoogleLoading(false);
    }
  };

  const handleSkip = () => {
    setSkipAuth(true);
    router.push('/');
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setOtpSent(false);
    setCode('');
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your tadpole workspace."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary-accent hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Password mode */}
      {mode === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary-accent hover:bg-primary-accent/90"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
          <button
            type="button"
            onClick={() => switchMode('otp')}
            className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Email me a one-time code instead
          </button>
        </form>
      )}

      {/* OTP mode */}
      {mode === 'otp' && !otpSent && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-email">Email</Label>
            <Input
              id="otp-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary-accent hover:bg-primary-accent/90"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            Send me a code
          </Button>
          <button
            type="button"
            onClick={() => switchMode('password')}
            className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Use password instead
          </button>
        </form>
      )}

      {mode === 'otp' && otpSent && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
          </p>
          <OtpInput value={code} onChange={setCode} disabled={loading} />
          <Button
            type="submit"
            className="w-full bg-primary-accent hover:bg-primary-accent/90"
            disabled={loading || code.length < 6}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify & sign in
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => switchMode('otp')}
              className="text-muted-foreground hover:text-foreground"
            >
              Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0}
              className="text-primary-accent hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={handleSkip}>
          Skip for now
        </Button>
      </div>
    </AuthShell>
  );
}
