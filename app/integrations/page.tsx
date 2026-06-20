'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Puzzle, CheckCircle, XCircle, Plus, Filter } from 'lucide-react';

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const integrations = [
    { name: 'GitHub', type: 'github', status: 'connected', description: 'Source code management' },
    { name: 'GitLab', type: 'gitlab', status: 'disconnected', description: 'Alternative SCM' },
    { name: 'Slack', type: 'slack', status: 'connected', description: 'Team communication' },
    { name: 'PagerDuty', type: 'pagerduty', status: 'connected', description: 'Incident management' },
    { name: 'Datadog', type: 'datadog', status: 'disconnected', description: 'Monitoring and observability' },
    { name: 'AWS', type: 'aws', status: 'connected', description: 'Cloud infrastructure' },
    { name: 'Azure', type: 'azure', status: 'connected', description: 'Cloud infrastructure' },
    { name: 'GCP', type: 'gcp', status: 'disconnected', description: 'Cloud infrastructure' },
  ];

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground mt-1">Available Integrations</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">5</div>
                  <div className="text-xs text-muted-foreground mt-1">Connected</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-muted-foreground">3</div>
                  <div className="text-xs text-muted-foreground mt-1">Available</div>
                </CardContent>
              </Card>
            </div>

            {/* Integrations Grid */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">All Integrations</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            <Puzzle className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{integration.name}</div>
                            <div className="text-xs text-muted-foreground">{integration.description}</div>
                          </div>
                        </div>
                        {integration.status === 'connected' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'} className="text-xs">
                          {integration.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant={integration.status === 'connected' ? 'outline' : 'default'}
                          className={integration.status === 'connected' ? 'h-7 text-xs' : 'h-7 text-xs bg-primary-accent hover:bg-primary-accent/90'}
                        >
                          {integration.status === 'connected' ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  ))}
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
