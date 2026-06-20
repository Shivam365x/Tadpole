'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, TrendingUp, Users, GitPullRequest, Plus, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const developers = [
    { name: 'John Doe', prs: 23, reviews: 45, commits: 87, avatar: 'JD' },
    { name: 'Jane Smith', prs: 18, reviews: 52, commits: 72, avatar: 'JS' },
    { name: 'Bob Wilson', prs: 15, reviews: 38, commits: 65, avatar: 'BW' },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Team Analytics"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Analytics' }]}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'velocity', label: 'Velocity' },
            { value: 'reviews', label: 'Code Reviews' },
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
                Export Report
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
                      <div className="text-2xl font-bold">56</div>
                      <div className="text-xs text-muted-foreground mt-1">PRs This Week</div>
                    </div>
                    <GitPullRequest className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">4.2h</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg Review Time</div>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">224</div>
                      <div className="text-xs text-muted-foreground mt-1">Total Commits</div>
                    </div>
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-muted-foreground mt-1">Active Developers</div>
                    </div>
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Developer Metrics */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Developer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {developers.map((dev) => (
                    <div
                      key={dev.name}
                      className="p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`} />
                            <AvatarFallback className="bg-blue-600 text-xs">{dev.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{dev.name}</div>
                            <div className="text-xs text-muted-foreground">Software Engineer</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-base font-bold">{dev.prs}</div>
                            <div className="text-xs text-muted-foreground">PRs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-base font-bold">{dev.reviews}</div>
                            <div className="text-xs text-muted-foreground">Reviews</div>
                          </div>
                          <div className="text-center">
                            <div className="text-base font-bold">{dev.commits}</div>
                            <div className="text-xs text-muted-foreground">Commits</div>
                          </div>
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
                  <CardTitle className="text-base font-semibold">Sprint Velocity</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-3">
                    {[
                      { sprint: 'Sprint 23', planned: 52, completed: 50, rate: 96.2 },
                      { sprint: 'Sprint 22', planned: 50, completed: 48, rate: 96.0 },
                      { sprint: 'Sprint 21', planned: 48, completed: 46, rate: 95.8 },
                      { sprint: 'Sprint 20', planned: 45, completed: 42, rate: 93.3 },
                    ].map((sprint) => (
                      <div key={sprint.sprint}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-medium text-sm">{sprint.sprint}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {sprint.completed}/{sprint.planned}
                            </span>
                            <Badge variant="secondary" className="text-xs">{sprint.rate}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${sprint.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Code Review Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    <div className="p-3 bg-muted/20 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Average Review Time</span>
                        <span className="font-bold text-sm">4.2 hours</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Reviews Completed</span>
                        <span className="font-bold text-sm">135</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Reviews Pending</span>
                        <span className="font-bold text-sm text-orange-500">23</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">Avg Comments per PR</span>
                        <span className="font-bold text-sm">5.8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Contributors */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Top Contributors (This Month)</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {developers.map((dev, index) => (
                    <div key={dev.name} className="flex items-center justify-between p-2 border border-border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`} />
                          <AvatarFallback className="bg-blue-600 text-xs">{dev.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{dev.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">{dev.commits} commits</Badge>
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
