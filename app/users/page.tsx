'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Mail, MoreVertical, Plus, Filter } from 'lucide-react';
import { getIdenticon } from '@/lib/identicon';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const users = [
    {
      name: 'John Doe',
      email: 'john.doe@tadpole.com',
      role: 'admin',
      status: 'active',
      avatar: 'JD',
      lastActive: '2 hours ago',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@tadpole.com',
      role: 'developer',
      status: 'active',
      avatar: 'JS',
      lastActive: '5 minutes ago',
    },
    {
      name: 'Bob Wilson',
      email: 'bob.wilson@tadpole.com',
      role: 'developer',
      status: 'active',
      avatar: 'BW',
      lastActive: '1 day ago',
    },
    {
      name: 'Alice Brown',
      email: 'alice.brown@tadpole.com',
      role: 'viewer',
      status: 'active',
      avatar: 'AB',
      lastActive: '3 hours ago',
    },
    {
      name: 'Charlie Davis',
      email: 'charlie.davis@tadpole.com',
      role: 'developer',
      status: 'invited',
      avatar: 'CD',
      lastActive: 'Never',
    },
  ];

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      developer: 'default',
      viewer: 'secondary',
    } as const;
    
    return <Badge variant={variants[role as keyof typeof variants]} className="text-xs">{role}</Badge>;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Users"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Users' }]}
          tabs={[
            { value: 'all', label: 'All Users' },
            { value: 'active', label: 'Active' },
            { value: 'invited', label: 'Invited' },
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
                Invite User
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
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Users</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">11</div>
                  <div className="text-xs text-muted-foreground mt-1">Active</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-500">1</div>
                  <div className="text-xs text-muted-foreground mt-1">Pending Invites</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-xs text-muted-foreground mt-1">Admins</div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between p-3 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getIdenticon(user.email || user.name)} alt={user.name} />
                          <AvatarFallback className="bg-blue-600 text-xs">{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Last active</div>
                          <div className="text-xs font-medium">{user.lastActive}</div>
                        </div>
                        {getRoleBadge(user.role)}
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {user.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
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
                  <CardTitle className="text-base font-semibold">Roles & Permissions</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">Admin</div>
                        <Badge variant="destructive" className="text-xs">2 users</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Full access to all features and settings
                      </div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">Developer</div>
                        <Badge variant="default" className="text-xs">8 users</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Can deploy, manage PRs, and view analytics
                      </div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">Viewer</div>
                        <Badge variant="secondary" className="text-xs">2 users</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Read-only access to dashboards and reports
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { user: 'Jane Smith', action: 'Deployed to production', time: '5 minutes ago' },
                      { user: 'John Doe', action: 'Created new alert rule', time: '2 hours ago' },
                      { user: 'Bob Wilson', action: 'Merged PR #234', time: '1 day ago' },
                      { user: 'Alice Brown', action: 'Updated settings', time: '3 hours ago' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div>
                            <span className="font-medium">{activity.user}</span>
                            <span className="text-muted-foreground"> {activity.action}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
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
