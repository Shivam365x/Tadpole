'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Plus, Filter } from 'lucide-react';

export default function CostMonitoringPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const costs = [
    { provider: 'AWS', amount: 12450, change: 8.5, services: ['EC2', 'RDS', 'S3'] },
    { provider: 'Azure', amount: 6780, change: -3.2, services: ['VM', 'Storage', 'SQL'] },
    { provider: 'GCP', amount: 3210, change: 12.1, services: ['Compute', 'Cloud SQL'] },
  ];

  const topServices = [
    { name: 'EC2 Compute', cost: 4200, change: 5.2 },
    { name: 'RDS Database', cost: 3100, change: -2.1 },
    { name: 'S3 Storage', cost: 1800, change: 15.3 },
    { name: 'CloudFront CDN', cost: 1200, change: 3.8 },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Cost Monitoring"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Cost Monitoring' }]}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'forecast', label: 'Forecast' },
            { value: 'anomalies', label: 'Anomalies' },
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
                Set Budget
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
                      <div className="text-2xl font-bold">$22.4K</div>
                      <div className="text-xs text-muted-foreground mt-1">This Month</div>
                    </div>
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-red-500">+12%</div>
                      <div className="text-xs text-muted-foreground mt-1">vs Last Month</div>
                    </div>
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">$25.8K</div>
                      <div className="text-xs text-muted-foreground mt-1">Forecast</div>
                    </div>
                    <TrendingUp className="h-6 w-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground mt-1">Anomalies</div>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Provider Costs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {costs.map((provider) => (
                <Card key={provider.provider} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">{provider.provider}</CardTitle>
                      <Badge
                        variant={provider.change > 0 ? 'destructive' : 'default'}
                        className="flex items-center space-x-1 text-xs"
                      >
                        {provider.change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(provider.change)}%</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-2xl font-bold mb-3">
                      ${provider.amount.toLocaleString()}
                    </div>
                    <div className="space-y-1.5">
                      {provider.services.map((service) => (
                        <div key={service} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{service}</span>
                          <span className="font-medium">${Math.floor(Math.random() * 3000)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Top Cost Drivers */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Top Cost Drivers</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-3">
                  {topServices.map((service) => (
                    <div key={service.name} className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-sm">{service.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm">${service.cost.toLocaleString()}</span>
                          <Badge
                            variant={service.change > 10 ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {service.change > 0 ? '+' : ''}{service.change}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: `${(service.cost / 4200) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Savings Recommendations */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Cost Savings Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { title: 'Right-size EC2 Instances', savings: 2400, effort: 'Low' },
                    { title: 'Enable S3 Intelligent Tiering', savings: 1800, effort: 'Low' },
                    { title: 'Purchase Reserved Instances', savings: 3600, effort: 'Medium' },
                    { title: 'Optimize RDS Instance', savings: 1200, effort: 'Medium' },
                  ].map((rec, i) => (
                    <div key={i} className="p-3 border border-border rounded hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{rec.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Effort: {rec.effort}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-green-500">
                            ${rec.savings.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">potential savings</div>
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
