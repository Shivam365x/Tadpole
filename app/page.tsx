'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { usePullRequests } from '@/hooks/usePullRequests';
import { useIncidentMetrics } from '@/hooks/useIncidents';
import { NoDataOrLoading } from '@/components/ui/no-data';


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: pullRequests, isLoading: prLoading } = usePullRequests({ status: 'open' });
  const { data: incidentMetrics } = useIncidentMetrics();

  const stats = [
    {
      title: 'Open PRs',
      value: pullRequests?.length || 0,
      icon: GitPullRequest,
      trend: { value: 12, isPositive: false },
      color: 'text-blue-500',
    },
    {
      title: 'Critical Incidents',
      value: incidentMetrics?.critical || 0,
      icon: AlertTriangle,
      trend: { value: 25, isPositive: false },
      color: 'text-red-500',
    },
    {
      title: 'Deploy Success',
      value: '96%',
      icon: Rocket,
      trend: { value: 3, isPositive: true },
      color: 'text-green-500',
    },
    {
      title: 'Services',
      value: 24,
      icon: Server,
      color: 'text-purple-500',
      badge: { text: '22 healthy', variant: 'secondary' as const },
    },
    {
      title: 'Monthly Cost',
      value: '$22.4K',
      icon: DollarSign,
      trend: { value: 12, isPositive: false },
      color: 'text-orange-500',
    },
    {
      title: 'AI Suggestions',
      value: 47,
      icon: Sparkles,
      color: 'text-indigo-500',
      badge: { text: '12 critical', variant: 'destructive' as const },
    },
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold mb-1">{stat.value}</p>
                          {stat.trend && (
                            <div className="flex items-center text-xs">
                              {stat.trend.isPositive ? (
                                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                              )}
                              <span
                                className={
                                  stat.trend.isPositive
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                              >
                                {stat.trend.value}%
                              </span>
                            </div>
                          )}
                          {stat.badge && (
                            <Badge
                              variant={stat.badge.variant}
                              className="text-xs mt-1"
                            >
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
                    <CardTitle className="text-base font-semibold">
                      Recent Pull Requests
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  {prLoading || !pullRequests || pullRequests.length === 0 ? (
                    <NoDataOrLoading
                      isLoading={prLoading}
                      noDataText="No open pull requests"
                    />
                  ) : (
                    <div className="space-y-2">
                      {pullRequests?.slice(0, 5).map((pr) => (
                        <div
                          key={pr.id}
                          className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {pr.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {pr.repository} • {pr.author}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge
                              variant={
                                pr.ciStatus === 'success' ? 'default' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {pr.ciStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Incidents */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      Active Incidents
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      {
                        id: 1,
                        title: 'API Gateway High Latency',
                        severity: 'critical' as const,
                        service: 'api-gateway',
                        time: '5m ago',
                      },
                      {
                        id: 2,
                        title: 'Database Connection Timeout',
                        severity: 'high' as const,
                        service: 'database',
                        time: '1h ago',
                      },
                      {
                        id: 3,
                        title: 'CDN Cache Miss Rate High',
                        severity: 'medium' as const,
                        service: 'cdn',
                        time: '3h ago',
                      },
                    ].map((incident) => (
                      <div
                        key={incident.id}
                        className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {incident.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {incident.service} • {incident.time}
                          </div>
                        </div>
                        <Badge
                          variant={
                            incident.severity === 'critical' ||
                            incident.severity === 'high'
                              ? 'destructive'
                              : 'default'
                          }
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
                    <CardTitle className="text-base font-semibold">
                      Recent Deployments
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      {
                        id: 1,
                        service: 'frontend-app',
                        env: 'production',
                        status: 'success' as const,
                        time: '10m ago',
                      },
                      {
                        id: 2,
                        service: 'backend-api',
                        env: 'staging',
                        status: 'in_progress' as const,
                        time: '2m ago',
                      },
                      {
                        id: 3,
                        service: 'auth-service',
                        env: 'production',
                        status: 'success' as const,
                        time: '1h ago',
                      },
                      {
                        id: 4,
                        service: 'payment-service',
                        env: 'production',
                        status: 'failed' as const,
                        time: '3h ago',
                      },
                    ].map((deployment) => (
                      <div
                        key={deployment.id}
                        className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {deployment.service}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {deployment.env} • {deployment.time}
                          </div>
                        </div>
                        <Badge
                          variant={
                            deployment.status === 'success'
                              ? 'default'
                              : deployment.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs ml-2"
                        >
                          {deployment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      AI Suggestions
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      {
                        id: 1,
                        title: 'Potential SQL Injection',
                        type: 'security',
                        severity: 'high' as const,
                        file: 'api/users.ts',
                      },
                      {
                        id: 2,
                        title: 'Inefficient Database Query',
                        type: 'performance',
                        severity: 'medium' as const,
                        file: 'db/queries.ts',
                      },
                      {
                        id: 3,
                        title: 'Deprecated API Usage',
                        type: 'best-practice',
                        severity: 'low' as const,
                        file: 'utils/api.ts',
                      },
                    ].map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {suggestion.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {suggestion.type} • {suggestion.file}
                          </div>
                        </div>
                        <Badge
                          variant={
                            suggestion.severity === 'high'
                              ? 'destructive'
                              : suggestion.severity === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
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
