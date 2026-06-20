'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
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
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getIdenticon } from '@/lib/identicon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronUp } from 'lucide-react';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: GitPullRequest, label: 'Pull Requests', href: '/pull-requests' },
  { icon: Rocket, label: 'Deployments', href: '/deployments' },
  { icon: AlertTriangle, label: 'Incidents', href: '/incidents' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: Server, label: 'Infrastructure', href: '/infrastructure' },
  { icon: Database, label: 'Databases', href: '/databases' },
  { icon: DollarSign, label: 'Cost Monitoring', href: '/cost-monitoring' },
  { icon: Sparkles, label: 'AI Copilot', href: '/ai-copilot' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

const secondaryNavItems = [
  { icon: Puzzle, label: 'Integrations', href: '/integrations' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
  { icon: Users, label: 'Users', href: '/users' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="pt-0">
        {/* Mirror the top bar's exact structure: border lives on a wrapper
            (not on the h-12 row) so the border sits BELOW the 48px row,
            matching the top bar's bottom border to the pixel. */}
        <div className="border-b">
          <div className="flex h-12 items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Link href="/" className="flex items-center">
              {/* Expanded: full horizontal lockup (light/dark wordmark swap) */}
              <span className="group-data-[collapsible=icon]:hidden">
                <Image
                  src="/brand/logo-full-light.png"
                  alt="Tadpole"
                  width={665}
                  height={171}
                  priority
                  className="h-7 w-auto dark:hidden"
                />
                <Image
                  src="/brand/logo-full.png"
                  alt="Tadpole"
                  width={665}
                  height={171}
                  priority
                  className="hidden h-7 w-auto dark:block"
                />
              </span>
              {/* Collapsed: standalone tadpole mark */}
              <Image
                src="/brand/logo-mark.png"
                alt="Tadpole"
                width={512}
                height={512}
                priority
                className="hidden h-7 w-7 group-data-[collapsible=icon]:block"
              />
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup className="px-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Secondary Navigation */}
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getIdenticon(user?.email || user?.name)} alt={user?.name} />
                  <AvatarFallback className="bg-primary-accent text-white text-xs">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || 'User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </span>
                </div>
                <ChevronUp className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/billing" className="w-full">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
