'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Plus, Filter, Github } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useGithubConnection } from '@/hooks/useGithub';
import { integrationsApi, GitHubDeployment } from '@/services/api/integrations.api';

type DeployView = {
  id: string;
  service: string;
  env: string;
  status: string;
  time: string;
  detail: string;
};

const MOCK_DEPLOYMENTS: DeployView[] = [
  { id: '1', service: 'frontend-app', env: 'production', status: 'success', time: '5m ago', detail: '4m 32s' },
  { id: '2', service: 'backend-api', env: 'staging', status: 'in_progress', time: '2m ago', detail: '2m 15s' },
  { id: '3', service: 'auth-service', env: 'production', status: 'success', time: '1h ago', detail: '3m 45s' },
  { id: '4', service: 'payment-service', env: 'production', status: 'failed', time: '3h ago', detail: '1m 12s' },
  { id: '5', service: 'analytics-service', env: 'staging', status: 'success', time: '5h ago', detail: '5m 30s' },
  { id: '6', service: 'notification-service', env: 'production', status: 'success', time: '6h ago', detail: '4m 10s' },
];

function mapGithubDeployment(d: GitHubDeployment): DeployView {
  return {
    id: d.id,
    service: d.service,
    env: d.environment,
    status: d.status,
    time: d.created_at ? formatDistanceToNow(new Date(d.created_at), { addSuffix: true }) : '',
    detail: d.sha ? `${d.ref || ''} ${d.sha}`.trim() : d.ref || '',
  };
}

export default function DeploymentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { connected } = useGithubConnection();

  const [ghDeployments, setGhDeployments] = useState<DeployView[] | null>(null);
  const [ghLoading, setGhLoading] = useState(false);

  useEffect(() => {
    if (connected !== true) return;
    setGhLoading(true);
    integrationsApi
      .githubDeployments()
      .then((r) => setGhDeployments(r.items.map(mapGithubDeployment)))
      .catch(() => setGhDeployments([]))
      .finally(() => setGhLoading(false));
  }, [connected]);

  const usingGithub = connected === true && ghDeployments !== null;
  const source = usingGithub ? (ghDeployments as DeployView[]) : MOCK_DEPLOYMENTS;

  const deployments = useMemo(
    () =>
      source.filter((d) => {
        if (activeTab === 'production') return d.env === 'production';
        if (activeTab === 'staging') return d.env === 'staging';
        return true;
      }),
    [source, activeTab]
  );

  const successRate = source.length
    ? Math.round((source.filter((d) => d.status === 'success').length / source.length) * 100)
    : 0;
  const inProgress = source.filter((d) => d.status === 'in_progress').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Deployments"
            breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Deployments' }]}
            tabs={[
              { value: 'all', label: 'All Deployments' },
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            actionButtons={
              <>
                <Button size="sm" variant="outline">
                  <Filter className="mr-1 h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">
                  <Plus className="mr-1 h-4 w-4" />
                  New Deployment
                </Button>
              </>
            }
          />

          <main className="flex-1 overflow-y-auto p-3">
            <div className="container-layout space-y-4">
              {usingGithub && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-accent/30 px-3 py-2 text-sm">
                  <Github className="h-4 w-4" />
                  Live deployments from your connected GitHub repositories.
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{source.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Total Deployments</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-500">{successRate}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Success Rate</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-500">{inProgress}</div>
                    <div className="text-xs text-muted-foreground mt-1">In Progress</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{source.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Recent</div>
                  </CardContent>
                </Card>
              </div>

              {/* Deployments List */}
              <Card className="border-border">
                <CardContent className="p-3">
                  {ghLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading deployments…</div>
                  ) : deployments.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      {usingGithub
                        ? 'No deployments found in your GitHub repositories.'
                        : 'No deployments.'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {deployments.map((deployment) => (
                        <div
                          key={deployment.id}
                          className="flex items-center justify-between p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(deployment.status)}
                            <div>
                              <div className="font-medium text-sm">{deployment.service}</div>
                              <div className="text-xs text-muted-foreground">
                                {deployment.env}
                                {deployment.time ? ` • ${deployment.time}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {deployment.detail && (
                              <span className="text-xs text-muted-foreground">{deployment.detail}</span>
                            )}
                            <Badge
                              variant={
                                deployment.status === 'success'
                                  ? 'default'
                                  : deployment.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {deployment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
