'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, CheckCircle, Plus } from 'lucide-react';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Billing"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Billing' }]}
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'invoices', label: 'Invoices' },
            { value: 'payment', label: 'Payment Methods' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto p-3">
          <div className="container-layout space-y-4">
            {/* Plan and Invoice Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="border-border lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                    <div>
                      <div className="text-xl font-bold">Enterprise Plan</div>
                      <div className="text-muted-foreground text-xs mt-0.5">Unlimited everything</div>
                    </div>
                    <Badge variant="default" className="bg-blue-600 text-xs">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 bg-muted/20 rounded text-center">
                      <div className="text-xl font-bold">∞</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Team Members</div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded text-center">
                      <div className="text-xl font-bold">∞</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Repositories</div>
                    </div>
                    <div className="p-2 bg-muted/20 rounded text-center">
                      <div className="text-xl font-bold">∞</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Deployments</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">Advanced AI insights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">24/7 Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">Custom integrations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">SLA guarantee</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">Change Plan</Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Next Invoice</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <div>
                    <div className="text-2xl font-bold">$499</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Due on Jul 1, 2024</div>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Enterprise Plan</span>
                      <span className="font-medium">$499</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-border">
                      <span>Total</span>
                      <span>$499</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Method */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Update</Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded">
                  <CreditCard className="h-6 w-6 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Visa ending in 4242</div>
                    <div className="text-xs text-muted-foreground">Expires 12/2025</div>
                  </div>
                  <Badge variant="default" className="text-xs">Default</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
                  <Button size="sm" variant="outline" className="h-7 text-xs">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { date: 'Jun 1, 2024', amount: 499, status: 'paid', invoice: 'INV-2024-06' },
                    { date: 'May 1, 2024', amount: 499, status: 'paid', invoice: 'INV-2024-05' },
                    { date: 'Apr 1, 2024', amount: 499, status: 'paid', invoice: 'INV-2024-04' },
                    { date: 'Mar 1, 2024', amount: 499, status: 'paid', invoice: 'INV-2024-03' },
                  ].map((invoice) => (
                    <div
                      key={invoice.invoice}
                      className="flex items-center justify-between p-2 border border-border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-sm">{invoice.invoice}</div>
                        <div className="text-xs text-muted-foreground">{invoice.date}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-sm">${invoice.amount}</span>
                        <Badge variant="secondary" className="text-xs">Paid</Badge>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Download className="h-3 w-3" />
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
