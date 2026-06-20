'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, AlertTriangle, Clock, Plus, Filter } from 'lucide-react';
import { useIncidents, useIncidentMetrics } from '@/hooks/useIncidents';
import { formatDistanceToNow } from 'date-fns';

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  
  const { data: allIncidents, isLoading } = useIncidents();
  const { data: metrics } = useIncidentMetrics();

  const filteredIncidents = allIncidents?.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') return matchesSearch && (incident.status === 'open' || incident.status === 'investigating');
    if (activeTab === 'resolved') return matchesSearch && incident.status === 'resolved';
    if (activeTab === 'critical') return matchesSearch && incident.severity === 'critical';
    
    return matchesSearch;
  });

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    } as const;
    
    return (
      <Badge variant={variants[severity as keyof typeof variants]} className="text-xs">
        {severity}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'destructive',
      investigating: 'default',
      resolved: 'secondary',
      closed: 'outline',
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Incidents"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Incidents' }]}
          tabs={[
            { value: 'active', label: 'Active' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'critical', label: 'Critical' },
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
                Create Incident
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
                  <div className="text-2xl font-bold">{metrics?.total || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Incidents</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-500">{metrics?.active || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Active</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-500">{metrics?.critical || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">Critical</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-500">{metrics?.avgMTTR || 0}m</div>
                  <div className="text-xs text-muted-foreground mt-1">Avg MTTR</div>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Main Table */}
            <Card className="border-border">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading incidents...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Incident</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Impact</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>MTTR</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIncidents?.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{incident.title}</div>
                              <div className="text-xs text-muted-foreground">#{incident.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {incident.service}
                            </Badge>
                          </TableCell>
                          <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                          <TableCell>{getStatusBadge(incident.status)}</TableCell>
                          <TableCell className="text-sm">
                            {incident.assignee || <span className="text-muted-foreground">Unassigned</span>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {incident.impact}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            {incident.mttr ? (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{incident.mttr}m</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={incident.status === 'resolved' || incident.status === 'closed'}
                              >
                                {incident.status === 'open' ? 'Investigate' : 'Resolve'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {filteredIncidents?.slice(0, 5).map((incident) => (
                      <div key={incident.id} className="flex items-start space-x-3 p-2 border border-border rounded">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                          incident.severity === 'critical' ? 'bg-red-500' :
                          incident.severity === 'high' ? 'bg-orange-500' :
                          incident.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{incident.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {incident.service} • {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                        {getSeverityBadge(incident.severity)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Severity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-3">
                    {['critical', 'high', 'medium', 'low'].map((severity) => {
                      const count = allIncidents?.filter(i => i.severity === severity).length || 0;
                      const percentage = allIncidents ? (count / allIncidents.length) * 100 : 0;
                      
                      return (
                        <div key={severity}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center space-x-2">
                              {getSeverityBadge(severity)}
                              <span className="text-xs text-muted-foreground">{count} incidents</span>
                            </div>
                            <span className="text-xs font-medium">{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                severity === 'critical' ? 'bg-red-500' :
                                severity === 'high' ? 'bg-orange-500' :
                                severity === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
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
