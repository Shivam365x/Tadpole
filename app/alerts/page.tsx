'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle, Plus, Filter } from 'lucide-react';

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('firing');
  
  const alerts = [
    { id: 1, name: 'High CPU Usage', service: 'api-gateway', severity: 'critical', status: 'firing', time: '2m ago' },
    { id: 2, name: 'Memory Threshold', service: 'database', severity: 'high', status: 'firing', time: '5m ago' },
    { id: 3, name: 'Disk Space Low', service: 'storage', severity: 'medium', status: 'acknowledged', time: '15m ago' },
    { id: 4, name: 'High Latency', service: 'cdn', severity: 'low', status: 'resolved', time: '1h ago' },
    { id: 5, name: 'Network Errors', service: 'load-balancer', severity: 'high', status: 'firing', time: '3m ago' },
    { id: 6, name: 'Connection Timeout', service: 'redis', severity: 'critical', status: 'acknowledged', time: '8m ago' },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Alerts"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Alerts' }]}
          tabs={[
            { value: 'firing', label: 'Firing' },
            { value: 'acknowledged', label: 'Acknowledged' },
            { value: 'resolved', label: 'Resolved' },
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
                Create Alert Rule
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
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-muted-foreground mt-1">Active Alerts</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-500">8</div>
                  <div className="text-xs text-muted-foreground mt-1">Critical</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-500">12</div>
                  <div className="text-xs text-muted-foreground mt-1">High Priority</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-xs text-muted-foreground mt-1">Alert Rules</div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts List */}
            <Card className="border-border">
              <CardContent className="p-3">
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertCircle className={`h-5 w-5 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{alert.name}</div>
                          <div className="text-xs text-muted-foreground">{alert.service} • {alert.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            alert.severity === 'critical' || alert.severity === 'high'
                              ? 'destructive'
                              : 'default'
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                        <Badge 
                          variant={alert.status === 'firing' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          {alert.status === 'firing' ? 'Acknowledge' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alert Rules Section */}
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold mb-3">Alert Rules</h3>
                <div className="space-y-2">
                  {[
                    { name: 'CPU > 80%', condition: 'cpu_usage > 80', enabled: true },
                    { name: 'Memory > 90%', condition: 'memory_usage > 90', enabled: true },
                    { name: 'Disk Space < 10%', condition: 'disk_free < 10', enabled: true },
                    { name: 'Response Time > 2s', condition: 'response_time > 2000', enabled: false },
                  ].map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border border-border rounded"
                    >
                      <div>
                        <div className="font-medium text-sm">{rule.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{rule.condition}</div>
                      </div>
                      <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
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
