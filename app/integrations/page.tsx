'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Github,
  Puzzle,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import { integrationsApi, IntegrationPublic } from '@/services/api/integrations.api';
import { useAuthStore } from '@/stores/authStore';

type CatalogItem = {
  name: string;
  type: string;
  description: string;
  supported: boolean;
};

const CATALOG: CatalogItem[] = [
  { name: 'GitHub', type: 'github', description: 'Pull requests, repositories & commits', supported: true },
  { name: 'GitLab', type: 'gitlab', description: 'Alternative SCM', supported: false },
  { name: 'Slack', type: 'slack', description: 'Team communication', supported: false },
  { name: 'PagerDuty', type: 'pagerduty', description: 'Incident management', supported: false },
  { name: 'Datadog', type: 'datadog', description: 'Monitoring & observability', supported: false },
  { name: 'AWS', type: 'aws', description: 'Cloud infrastructure', supported: false },
  { name: 'Azure', type: 'azure', description: 'Cloud infrastructure', supported: false },
  { name: 'GCP', type: 'gcp', description: 'Cloud infrastructure', supported: false },
];

export default function IntegrationsPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [integrations, setIntegrations] = useState<IntegrationPublic[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await integrationsApi.list();
      setIntegrations(data);
    } catch {
      // ignore; user may need to re-auth
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    // Surface the post-OAuth redirect result (?connected=github)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('connected') === 'github') {
        setNotice('GitHub connected successfully.');
        window.history.replaceState({}, '', '/integrations');
      }
    }
  }, [load]);

  const getStatus = (type: string): IntegrationPublic | undefined =>
    integrations.find((i) => i.provider === type);

  const handleConnect = async (type: string) => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (type !== 'github') return;
    setBusy(type);
    try {
      await integrationsApi.connectGithub('/integrations'); // redirects away
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Could not start GitHub connection.');
      setBusy(null);
    }
  };

  const handleDisconnect = async (type: string) => {
    if (type !== 'github') return;
    setBusy(type);
    try {
      await integrationsApi.disconnectGithub();
      await load();
      setNotice('GitHub disconnected.');
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Could not disconnect.');
    } finally {
      setBusy(null);
    }
  };

  const connectedCount = CATALOG.filter((c) => getStatus(c.type)?.status === 'connected').length;
  const visible = CATALOG.filter((c) => {
    const connected = getStatus(c.type)?.status === 'connected';
    if (activeTab === 'connected') return connected;
    if (activeTab === 'available') return !connected;
    return true;
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Integrations"
            breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Integrations' }]}
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'connected', label: 'Connected' },
              { value: 'available', label: 'Available' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            actionButtons={
              <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">
                <Plus className="mr-1 h-4 w-4" />
                Add Integration
              </Button>
            }
          />

          <main className="flex-1 overflow-y-auto p-3">
            <div className="container-layout space-y-4">
              {notice && (
                <div className="rounded-lg border border-border bg-accent/40 px-3 py-2 text-sm">
                  {notice}
                </div>
              )}
              {!token && (
                <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  Sign in to connect integrations to your account.
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{CATALOG.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Available Integrations</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-500">{connectedCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Connected</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {CATALOG.length - connectedCount}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Not connected</div>
                  </CardContent>
                </Card>
              </div>

              {/* Grid */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">All Integrations</CardTitle>
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {visible.map((item) => {
                      const status = getStatus(item.type);
                      const connected = status?.status === 'connected';
                      const isBusy = busy === item.type;
                      const Icon = item.type === 'github' ? Github : Puzzle;
                      return (
                        <div
                          key={item.type}
                          className="p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-foreground" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {connected && status?.account_login
                                    ? `Connected as @${status.account_login}`
                                    : item.description}
                                </div>
                              </div>
                            </div>
                            {connected ? (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant={connected ? 'default' : 'secondary'} className="text-xs">
                              {item.supported ? (connected ? 'connected' : 'not connected') : 'coming soon'}
                            </Badge>
                            {item.supported ? (
                              connected ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  disabled={isBusy}
                                  onClick={() => handleDisconnect(item.type)}
                                >
                                  {isBusy && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                  Disconnect
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-primary-accent hover:bg-primary-accent/90"
                                  disabled={isBusy}
                                  onClick={() => handleConnect(item.type)}
                                >
                                  {isBusy && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                  Connect
                                </Button>
                              )
                            ) : (
                              <Button size="sm" variant="outline" className="h-7 text-xs" disabled>
                                Coming soon
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
