'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, XCircle, Clock, Plus, Filter } from 'lucide-react';

export default function DeploymentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const deployments = [
    { id: 1, service: 'frontend-app', env: 'production', status: 'success', time: '5m ago', duration: '4m 32s' },
    { id: 2, service: 'backend-api', env: 'staging', status: 'in_progress', time: '2m ago', duration: '2m 15s' },
    { id: 3, service: 'auth-service', env: 'production', status: 'success', time: '1h ago', duration: '3m 45s' },
    { id: 4, service: 'payment-service', env: 'production', status: 'failed', time: '3h ago', duration: '1m 12s' },
    { id: 5, service: 'analytics-service', env: 'staging', status: 'success', time: '5h ago', duration: '5m 30s' },
    { id: 6, service: 'notification-service', env: 'production', status: 'success', time: '6h ago', duration: '4m 10s' },
  ];

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Deployments</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">96%</div>
                  <div className="text-xs text-muted-foreground mt-1">Success Rate</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-500">2</div>
                  <div className="text-xs text-muted-foreground mt-1">In Progress</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">4.5m</div>
                  <div className="text-xs text-muted-foreground mt-1">Avg Duration</div>
                </CardContent>
              </Card>
            </div>

            {/* Deployments List */}
            <Card className="border-border">
              <CardContent className="p-3">
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
                          <div className="text-xs text-muted-foreground">{deployment.env} • {deployment.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-muted-foreground">{deployment.duration}</span>
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
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deployment Frequency Chart Placeholder */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold mb-3">Deployment Frequency</h3>
                <div className="h-64 flex items-center justify-center text-muted-foreground bg-muted/20 rounded">
                  Chart visualization would go here
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
