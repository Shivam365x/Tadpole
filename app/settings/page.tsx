'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuthStore();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Settings"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Settings' }]}
          tabs={[
            { value: 'profile', label: 'Profile' },
            { value: 'notifications', label: 'Notifications' },
            { value: 'security', label: 'Security' },
            { value: 'api', label: 'API Keys' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto p-3">
          <div className="container-layout space-y-4">
            {activeTab === 'profile' && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
                  <CardDescription className="text-xs">Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs">Role</Label>
                    <Input id="role" defaultValue={user?.role} disabled />
                  </div>
                  <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">Save Changes</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
                  <CardDescription className="text-xs">Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Email Notifications</div>
                      <div className="text-xs text-muted-foreground">Receive notifications via email</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Slack Notifications</div>
                      <div className="text-xs text-muted-foreground">Receive notifications in Slack</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Incident Alerts</div>
                      <div className="text-xs text-muted-foreground">Get notified about new incidents</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Deployment Updates</div>
                      <div className="text-xs text-muted-foreground">Get notified about deployments</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">PR Reviews</div>
                      <div className="text-xs text-muted-foreground">Get notified when you're assigned a review</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">Save Preferences</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Change Password</CardTitle>
                    <CardDescription className="text-xs">Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password" className="text-xs">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-password" className="text-xs">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-password" className="text-xs">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">Update Password</Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Two-Factor Authentication</CardTitle>
                    <CardDescription className="text-xs">Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Enable 2FA</div>
                        <div className="text-xs text-muted-foreground">Require a code in addition to your password</div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'api' && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">API Keys</CardTitle>
                  <CardDescription className="text-xs">Manage your API keys for programmatic access</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <div className="space-y-2">
                    {[
                      { name: 'Production API Key', key: 'tpole_prod_••••••••••••', created: '2024-01-15' },
                      { name: 'Staging API Key', key: 'tpole_stag_••••••••••••', created: '2024-02-20' },
                    ].map((apiKey) => (
                      <div key={apiKey.name} className="flex items-center justify-between p-3 border border-border rounded">
                        <div>
                          <div className="font-medium text-sm">{apiKey.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{apiKey.key}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Created {apiKey.created}</div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Revoke</Button>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" className="bg-primary-accent hover:bg-primary-accent/90">Generate New Key</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      </div>
    </SidebarProvider>
  );
}
