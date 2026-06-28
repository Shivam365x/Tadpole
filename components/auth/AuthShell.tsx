'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { GitPullRequest, ShieldCheck, Sparkles, Activity } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: GitPullRequest, title: 'Unified DevOps', text: 'PRs, deploys, incidents & infra in one place.' },
  { icon: Activity, title: 'Live monitoring', text: 'Real-time alerts, MTTR and cost insights.' },
  { icon: Sparkles, title: 'AI copilot', text: 'Automated reviews and incident analysis.' },
  { icon: ShieldCheck, title: 'Secure by default', text: 'SSO, OTP and role-based access.' },
];

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Brand panel (hidden on small screens) */}
      <div className="relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(1200px 600px at -10% -10%, hsl(var(--primary-accent) / 0.25), transparent 60%), radial-gradient(900px 500px at 110% 110%, hsl(var(--primary-accent) / 0.18), transparent 55%)',
          }}
        />
        <div className="relative z-10">
          <Image
            src="/brand/logo-full.png"
            alt="Tadpole"
            width={665}
            height={171}
            priority
            className="h-9 w-auto"
          />
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-heading text-2xl font-semibold leading-tight text-foreground">
            The command center for modern DevOps teams.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="rounded-xl border border-border bg-background/40 p-4 backdrop-blur-sm"
              >
                <h.icon className="h-5 w-5 text-primary-accent" />
                <div className="mt-2 text-sm font-medium text-foreground">{h.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{h.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tedpole. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/brand/logo-full.png"
              alt="Tadpole"
              width={665}
              height={171}
              priority
              className="h-9 w-auto"
            />
          </div>

          <div className="mb-6">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          {children}

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
