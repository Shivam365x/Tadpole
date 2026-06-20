'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Cpu, HardDrive, Activity, Plus, Filter } from 'lucide-react';

export default function InfrastructurePage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const services = [
    { name: 'API Gateway', status: 'healthy', cpu: 45, memory: 62, instances: 3 },
    { name: 'Auth Service', status: 'healthy', cpu: 32, memory: 48, instances: 2 },
    { name: 'Database', status: 'warning', cpu: 78, memory: 85, instances: 2 },
    { name: 'Cache', status: 'healthy', cpu: 28, memory: 55, instances: 3 },
    { name: 'Payment Service', status: 'healthy', cpu: 42, memory: 60, instances: 2 },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Infrastructure"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Infrastructure' }]}
          tabs={[
            { value: 'all', label: 'All Services' },
            { value: 'healthy', label: 'Healthy' },
            { value: 'warning', label: 'Warnings' },
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
                Add Service
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
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-xs text-muted-foreground mt-1">Services</div>
                    </div>
                    <Server className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-500">22</div>
                      <div className="text-xs text-muted-foreground mt-1">Healthy</div>
                    </div>
                    <Activity className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">45%</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg CPU</div>
                    </div>
                    <Cpu className="h-6 w-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">62%</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg Memory</div>
                    </div>
                    <HardDrive className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services List */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Services Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {services.map((service) => (
                    <div
                      key={service.name}
                      className="p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Server className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="font-medium text-sm">{service.name}</div>
                            <div className="text-xs text-muted-foreground">{service.instances} instances</div>
                          </div>
                        </div>
                        <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                          {service.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">CPU</span>
                            <span className="font-medium">{service.cpu}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                service.cpu > 70 ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${service.cpu}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Memory</span>
                            <span className="font-medium">{service.memory}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                service.memory > 80 ? 'bg-red-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${service.memory}%` }}
                            />
                          </div>
                        </div>
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
