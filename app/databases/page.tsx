'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Activity, Zap, HardDrive, Plus, Filter } from 'lucide-react';

export default function DatabasesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const databases = [
    { name: 'users_db', connections: 45, qps: 1250, storage: 45, health: 'healthy' },
    { name: 'orders_db', connections: 82, qps: 3420, storage: 78, health: 'warning' },
    { name: 'analytics_db', connections: 23, qps: 450, storage: 62, health: 'healthy' },
    { name: 'sessions_db', connections: 34, qps: 890, storage: 34, health: 'healthy' },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Databases"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Databases' }]}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'queries', label: 'Slow Queries' },
            { value: 'connections', label: 'Connections' },
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
                Add Database
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
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-xs text-muted-foreground mt-1">Databases</div>
                    </div>
                    <Database className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">184</div>
                      <div className="text-xs text-muted-foreground mt-1">Total Connections</div>
                    </div>
                    <Activity className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">6,010</div>
                      <div className="text-xs text-muted-foreground mt-1">Queries/sec</div>
                    </div>
                    <Zap className="h-6 w-6 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">55%</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg Storage</div>
                    </div>
                    <HardDrive className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Database Overview */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Database Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {databases.map((db) => (
                    <div
                      key={db.name}
                      className="p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Database className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="font-medium text-sm">{db.name}</div>
                            <div className="text-xs text-muted-foreground">{db.connections} active connections</div>
                          </div>
                        </div>
                        <Badge variant={db.health === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                          {db.health}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 bg-muted/20 rounded">
                          <div className="text-xs text-muted-foreground">QPS</div>
                          <div className="text-base font-bold mt-0.5">{db.qps.toLocaleString()}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/20 rounded">
                          <div className="text-xs text-muted-foreground">Connections</div>
                          <div className="text-base font-bold mt-0.5">{db.connections}</div>
                        </div>
                        <div className="text-center p-2 bg-muted/20 rounded">
                          <div className="text-xs text-muted-foreground">Storage</div>
                          <div className="text-base font-bold mt-0.5">{db.storage}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Slow Queries (Last 24h)</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { query: 'SELECT * FROM users WHERE...', time: '2.5s', db: 'users_db' },
                      { query: 'INSERT INTO orders VALUES...', time: '1.8s', db: 'orders_db' },
                      { query: 'UPDATE sessions SET...', time: '1.2s', db: 'sessions_db' },
                    ].map((query, i) => (
                      <div key={i} className="p-2 border border-border rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 truncate">
                            <div className="text-xs font-mono">{query.query}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{query.db}</div>
                          </div>
                          <Badge variant="destructive" className="text-xs ml-2">{query.time}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Connection Pool Status</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {databases.map((db) => (
                      <div key={db.name} className="p-2 border border-border rounded">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium">{db.name}</span>
                          <span className="text-xs text-muted-foreground">{db.connections}/100</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              db.connections > 80 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${db.connections}%` }}
                          />
                        </div>
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
