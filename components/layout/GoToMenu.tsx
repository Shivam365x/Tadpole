'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import {
  Search,
  LayoutDashboard,
  GitPullRequest,
  Rocket,
  AlertTriangle,
  Bell,
  Server,
  Database,
  DollarSign,
  Sparkles,
  BarChart3,
  Puzzle,
  Settings,
  CreditCard,
  Users,
  CornerDownLeft,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type GoToItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
  keywords?: string;
};

const GOTO_ITEMS: GoToItem[] = [
  { group: 'Pages', label: 'Dashboard', href: '/', icon: LayoutDashboard, keywords: 'home overview' },
  { group: 'Pages', label: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest, keywords: 'pr review merge' },
  { group: 'Pages', label: 'Deployments', href: '/deployments', icon: Rocket, keywords: 'deploy release rollback' },
  { group: 'Pages', label: 'Incidents', href: '/incidents', icon: AlertTriangle, keywords: 'outage on-call mttr' },
  { group: 'Pages', label: 'Alerts', href: '/alerts', icon: Bell, keywords: 'notifications rules firing' },
  { group: 'Pages', label: 'Infrastructure', href: '/infrastructure', icon: Server, keywords: 'services hosts' },
  { group: 'Pages', label: 'Databases', href: '/databases', icon: Database, keywords: 'postgres queries' },
  { group: 'Pages', label: 'Cost Monitoring', href: '/cost-monitoring', icon: DollarSign, keywords: 'spend billing cloud' },
  { group: 'Pages', label: 'AI Copilot', href: '/ai-copilot', icon: Sparkles, keywords: 'assistant suggestions' },
  { group: 'Pages', label: 'Analytics', href: '/analytics', icon: BarChart3, keywords: 'metrics team velocity' },
  { group: 'Configuration', label: 'Integrations', href: '/integrations', icon: Puzzle, keywords: 'github slack connect' },
  { group: 'Configuration', label: 'Settings', href: '/settings', icon: Settings, keywords: 'preferences profile' },
  { group: 'Configuration', label: 'Billing', href: '/billing', icon: CreditCard, keywords: 'plan invoice payment' },
  { group: 'Configuration', label: 'Users', href: '/users', icon: Users, keywords: 'team members roles' },
];

export function GoToMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K shortcut to open the palette.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Reset state whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // focus after the dialog mounts
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GOTO_ITEMS;
    return GOTO_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.keywords?.toLowerCase().includes(q)
    );
  }, [query]);

  // Keep the active index within bounds as results change.
  useEffect(() => {
    setActiveIndex((i) => (results.length === 0 ? 0 : Math.min(i, results.length - 1)));
  }, [results.length]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item.href);
    }
  };

  // Group the flat results while tracking each item's global index (for highlight).
  let runningIndex = -1;
  const grouped = results.reduce<Record<string, { item: GoToItem; index: number }[]>>(
    (acc, item) => {
      runningIndex += 1;
      (acc[item.group] ??= []).push({ item, index: runningIndex });
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Sidebar trigger — Search icon + "Go to..." + ⌘K hint */}
      <SidebarMenuButton
        tooltip="Go to..."
        onClick={() => setOpen(true)}
        className="text-muted-foreground"
      >
        <Search />
        <span>Go to...</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </SidebarMenuButton>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[18%] max-w-lg translate-y-0 gap-0 p-0 sm:max-w-lg"
        >
          <DialogTitle className="sr-only">Go to page</DialogTitle>

          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Go to page or section..."
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden items-center rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-1">
            {results.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No pages found.
              </div>
            ) : (
              Object.entries(grouped).map(([group, entries]) => (
                <div key={group} className="mb-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {group}
                  </div>
                  {entries.map(({ item, index }) => {
                    const Icon = item.icon;
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => go(item.href)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive && (
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
