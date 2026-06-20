'use client';

import { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface TabItem {
  value: string;
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButtons?: ReactNode;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  showSidebarToggle?: boolean;
  titleBadge?: ReactNode;
}

export function PageHeader({
  title,
  breadcrumbs,
  actionButtons,
  tabs,
  activeTab,
  onTabChange,
  showSidebarToggle = true,
  titleBadge,
}: PageHeaderProps) {
  const { currentEnvironment } = useUIStore();

  return (
    <div className="sticky top-0 z-30 w-full border-b bg-background shadow-xs">
      {/* Top Row - Trigger & Breadcrumbs.
          Fixed h-12 so its bottom border aligns exactly with the sidebar
          logo row's bottom border (one continuous line across the screen). */}
      <div className="border-b">
        <div className="flex h-12 items-center gap-3 px-3">
          {showSidebarToggle && <SidebarTrigger />}
          <Badge variant="outline" className="text-xs font-normal">
            {currentEnvironment}
          </Badge>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        </div>
      </div>

      {/* Bottom Row - Title & Actions */}
      <div className="bg-header">
        <div className="flex min-h-11 items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold leading-7">{title}</h1>
            {titleBadge}
          </div>
          {actionButtons && (
            <div className="flex items-center gap-2">{actionButtons}</div>
          )}
        </div>

        {/* Tabs Row */}
        {tabs && tabs.length > 0 && (
          <div className="px-3">
            <div className="inline-flex h-8 items-center justify-start">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    tab.onClick?.();
                    onTabChange?.(tab.value);
                  }}
                  className={cn(
                    'inline-flex h-full items-center justify-center rounded-none border-b-4 px-3 text-sm font-medium transition-all hover:bg-muted/50',
                    tab.value === activeTab
                      ? 'border-primary-accent text-foreground'
                      : 'border-transparent text-muted-foreground'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
