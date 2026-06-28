'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GitPullRequest,
  AlertTriangle,
  Rocket,
  Server,
  DollarSign,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plus,
  Github,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usePullRequests } from '@/hooks/usePullRequests';
import { useIncidentMetrics } from '@/hooks/useIncidents';
import { useGithubConnection, useGithubPullRequests, useGithubDeployments } from '@/hooks/useGithub';
import { GitHubPullRequest, GitHubDeployment } from '@/services/api/integrations.api';
import { NoDataOrLoading } from '@/components/ui/no-data';

type MiniPR = {
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant: 'default' | 'destructive' | 'secondary' | 'outline';
};

type MiniDeploy = {
  key: string;
  title: string;
  subtitle: string;
  status: string;
};

function StatValue({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) return <Skeleton className="h-7 w-14 mb-1" />;
  return <p className="text-2xl font-bold mb-1">{children}</p>;
}

function RowSkeletons({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded border border-border">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16 ml-2" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { connected } = useGithubConnection();

  const { data: mockPRs, isLoading: prLoading } = usePullRequests({ status: 'open' });
  const { data: incidentMetrics } = useIncidentMetrics();

  const prQuery = useGithubPullRequests(connected === true);
  const depQuery = useGithubDeployments(connected === true);
  const ghPRs: GitHubPullRequest[] | null = prQuery.data ? prQuery.data.items : null;
  const ghDeployments: GitHubDeployment[] | null = depQuery.data ? depQuery.data.items : null;

  const refreshing = prQuery.isFetching || depQuery.isFetching;
  const handleRefresh = () => {
    if (connected === true) {
      prQuery.refetch();
      depQuery.refetch();
    }
  };

  // --- Loading states ---
  const prResolving =
    connected === null ||
    (connected === true && ghPRs === null) ||
    (connected === false && prLoading);
  const depResolving = connected === null || (connected === true && ghDeployments === null);

  // --- Derived values (real when GitHub connected, else placeholder) ---
  const openPRCount =
    connected === true
      ? (ghPRs || []).filter((p) => p.state === 'open').length
      : mockPRs?.length || 0;

  const deploySuccess =
    connected === true
      ? ghDeployments && ghDeployments.length > 0
        ? `${Math.round(
            (ghDeployments.filter((d) => d.status === 'success').length / ghDeployments.length) * 100
          )}%`
        : '—'
      : '96%';

  // --- Recent PRs list ---
  const recentPRs: MiniPR[] =
    connected === true
      ? (ghPRs || [])
          .filter((p) => p.state === 'open')
          .slice(0, 5)
          .map((p) => ({
            key: `${p.repository}-${p.number}`,
            title: p.title,
            subtitle: `${p.repository} • ${p.author}`,
            badge: p.draft ? 'draft' : p.state,
            badgeVariant: p.state === 'open' ? 'default' : 'secondary',
          }))
      : (mockPRs || []).slice(0, 5).map((pr) => ({
          key: pr.id,
          title: pr.title,
          subtitle: `${pr.repository} • ${pr.author}`,
          badge: pr.ciStatus,
          badgeVariant: pr.ciStatus === 'success' ? 'default' : 'destructive',
        }));

  // --- Recent Deployments list ---
  const mockDeployments: MiniDeploy[] = [
    { key: '1', title: 'frontend-app', subtitle: 'production • 10m ago', status: 'success' },
    { key: '2', title: 'backend-api', subtitle: 'staging • 2m ago', status: 'in_progress' },
    { key: '3', title: 'auth-service', subtitle: 'production • 1h ago', status: 'success' },
    { key: '4', title: 'payment-service', subtitle: 'production • 3h ago', status: 'failed' },
  ];
  const recentDeployments: MiniDeploy[] =
    connected === true
      ? (ghDeployments || []).slice(0, 5).map((d) => ({
          key: d.id,
          title: d.service,
          subtitle: `${d.environment}${d.created_at ? ` • ${formatDistanceToNow(new Date(d.created_at), { addSuffix: true })}` : ''}`,
          status: d.status,
        }))
      : mockDeployments;

  const deployBadgeVariant = (status: string) =>
    status === 'success' ? 'default' : status === 'failed' ? 'destructive' : 'secondary';

  const stats = [
    { title: 'Open PRs', value: openPRCount, icon: GitPullRequest, color: 'text-blue-500', loading: prResolving, trend: { value: 12, isPositive: false } },
    { title: 'Critical Incidents', value: incidentMetrics?.critical ?? 0, icon: AlertTriangle, color: 'text-red-500', loading: false, trend: { value: 25, isPositive: false } },
    { title: 'Deploy Success', value: deploySuccess, icon: Rocket, color: 'text-green-500', loading: depResolving, trend: { value: 3, isPositive: true } },
    { title: 'Services', value: 24, icon: Server, color: 'text-purple-500', loading: false, badge: { text: '22 healthy', variant: 'secondary' as const } },
    { title: 'Monthly Cost', value: '$22.4K', icon: DollarSign, color: 'text-orange-500', loading: false, trend: { value: 12, isPositive: false } },
    { title: 'AI Suggestions', value: 47, icon: Sparkles, color: 'text-indigo-500', loading: false, badge: { text: '12 critical', variant: 'destructive' as const } },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Dashboard"
            breadcrumbs={[{ name: 'Home' }, { name: 'Dashboard' }]}
            tabs={[
              { value: 'overview', label: 'Overview' },
              { value: 'metrics', label: 'Metrics' },
              { value: 'reports', label: 'Reports' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            actionButtons={
              <>
                <Button size="sm" variant="outline" onClick={handleRefresh} disabled={connected !== true || refreshing}>
                  <RefreshCw className={`mr-1 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm" variant="outline">
                  Export
                </Button>
                <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">
                  <Plus className="mr-1 h-4 w-4" />
                  New Alert
                </Button>
              </>
            }
          />

          <main className="flex-1 overflow-y-auto p-3">
            <div className="container-layout">
              {connected === true && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-accent/30 px-3 py-2 text-sm">
                  <Github className="h-4 w-4" />
                  Showing live data from your connected GitHub account.
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                            <StatValue loading={stat.loading}>{stat.value}</StatValue>
                            {!stat.loading && stat.trend && (
                              <div className="flex items-center text-xs">
                                {stat.trend.isPositive ? (
                                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span className={stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                                  {stat.trend.value}%
                                </span>
                              </div>
                            )}
                            {!stat.loading && stat.badge && (
                              <Badge variant={stat.badge.variant} className="text-xs mt-1">
                                {stat.badge.text}
                              </Badge>
                            )}
                          </div>
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pull Requests */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Recent Pull Requests</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => router.push('/pull-requests')}>View all</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {prResolving ? (
                      <RowSkeletons />
                    ) : recentPRs.length === 0 ? (
                      <NoDataOrLoading isLoading={false} noDataText="No open pull requests" />
                    ) : (
                      <div className="space-y-2">
                        {recentPRs.map((pr) => (
                          <div
                            key={pr.key}
                            className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{pr.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{pr.subtitle}</div>
                            </div>
                            <Badge variant={pr.badgeVariant} className="text-xs ml-2">{pr.badge}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Incidents (placeholder) */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Active Incidents</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      {[
                        { id: 1, title: 'API Gateway High Latency', severity: 'critical' as const, service: 'api-gateway', time: '5m ago' },
                        { id: 2, title: 'Database Connection Timeout', severity: 'high' as const, service: 'database', time: '1h ago' },
                        { id: 3, title: 'CDN Cache Miss Rate High', severity: 'medium' as const, service: 'cdn', time: '3h ago' },
                      ].map((incident) => (
                        <div
                          key={incident.id}
                          className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{incident.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{incident.service} • {incident.time}</div>
                          </div>
                          <Badge
                            variant={incident.severity === 'critical' || incident.severity === 'high' ? 'destructive' : 'default'}
                            className="text-xs ml-2"
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Deployments */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Recent Deployments</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => router.push('/deployments')}>View all</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {depResolving ? (
                      <RowSkeletons />
                    ) : recentDeployments.length === 0 ? (
                      <NoDataOrLoading isLoading={false} noDataText="No deployments found" />
                    ) : (
                      <div className="space-y-2">
                        {recentDeployments.map((deployment) => (
                          <div
                            key={deployment.key}
                            className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{deployment.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{deployment.subtitle}</div>
                            </div>
                            <Badge variant={deployBadgeVariant(deployment.status)} className="text-xs ml-2">
                              {deployment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Suggestions (placeholder) */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">AI Suggestions</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      {[
                        { id: 1, title: 'Potential SQL Injection', type: 'security', severity: 'high' as const, file: 'api/users.ts' },
                        { id: 2, title: 'Inefficient Database Query', type: 'performance', severity: 'medium' as const, file: 'db/queries.ts' },
                        { id: 3, title: 'Deprecated API Usage', type: 'best-practice', severity: 'low' as const, file: 'utils/api.ts' },
                      ].map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{suggestion.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{suggestion.type} • {suggestion.file}</div>
                          </div>
                          <Badge
                            variant={suggestion.severity === 'high' ? 'destructive' : suggestion.severity === 'medium' ? 'default' : 'secondary'}
                            className="text-xs ml-2"
                          >
                            {suggestion.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
