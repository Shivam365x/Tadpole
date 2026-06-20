'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, AlertTriangle, Zap, Shield, TrendingUp, Plus } from 'lucide-react';

export default function AICopilotPage() {
  const [activeTab, setActiveTab] = useState('suggestions');
  
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="AI Copilot"
          breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'AI Copilot' }]}
          tabs={[
            { value: 'suggestions', label: 'Suggestions' },
            { value: 'security', label: 'Security' },
            { value: 'performance', label: 'Performance' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          titleBadge={
            <Badge variant="secondary" className="ml-2 text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              Beta
            </Badge>
          }
        />

        <main className="flex-1 overflow-y-auto p-3">
          <div className="container-layout space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-xs text-muted-foreground mt-1">AI Suggestions</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-500">12</div>
                  <div className="text-xs text-muted-foreground mt-1">Security Issues</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-500">18</div>
                  <div className="text-xs text-muted-foreground mt-1">Performance Tips</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">$8.2K</div>
                  <div className="text-xs text-muted-foreground mt-1">Potential Savings</div>
                </CardContent>
              </Card>
            </div>

            {/* Ask AI Section */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Ask AI Copilot</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex space-x-2 mb-3">
                  <Input
                    placeholder="Ask anything... (e.g., 'Why did deployment fail yesterday?')"
                  />
                  <Button className="bg-primary-accent hover:bg-primary-accent/90">
                    <Sparkles className="mr-1 h-4 w-4" />
                    Ask
                  </Button>
                </div>
                <div className="p-3 bg-muted/20 rounded">
                  <div className="text-xs text-muted-foreground mb-2">Example queries:</div>
                  <div className="space-y-1.5">
                    <div className="text-sm text-primary cursor-pointer hover:underline">
                      • Why did deployment fail yesterday?
                    </div>
                    <div className="text-sm text-primary cursor-pointer hover:underline">
                      • What are the top cost optimization opportunities?
                    </div>
                    <div className="text-sm text-primary cursor-pointer hover:underline">
                      • Show me security vulnerabilities in my codebase
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid of Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Security Findings */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-red-500" />
                    Security Findings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { title: 'Potential SQL Injection', severity: 'critical', file: 'api/users.ts' },
                      { title: 'Exposed API Keys', severity: 'high', file: 'config/env.ts' },
                      { title: 'Weak Password Policy', severity: 'medium', file: 'auth/validate.ts' },
                    ].map((finding, i) => (
                      <div key={i} className="p-2 border border-border rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{finding.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{finding.file}</div>
                          </div>
                          <Badge
                            variant={
                              finding.severity === 'critical' ? 'destructive' :
                              finding.severity === 'high' ? 'destructive' : 'default'
                            }
                            className="text-xs ml-2"
                          >
                            {finding.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Recommendations */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                    Performance Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { title: 'Add Database Index', impact: 'high', service: 'users_db' },
                      { title: 'Enable CDN Caching', impact: 'high', service: 'frontend' },
                      { title: 'Optimize API Response Size', impact: 'medium', service: 'api-gateway' },
                    ].map((rec, i) => (
                      <div key={i} className="p-2 border border-border rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{rec.service}</div>
                          </div>
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'} className="text-xs ml-2">
                            {rec.impact} impact
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Optimization */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    Cost Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { title: 'Right-size Compute Instances', savings: 2400 },
                      { title: 'Enable Auto-scaling', savings: 1800 },
                      { title: 'Reserved Instances', savings: 3200 },
                    ].map((opt, i) => (
                      <div key={i} className="p-2 border border-border rounded">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{opt.title}</div>
                          <div className="text-green-500 font-bold text-sm">
                            ${opt.savings.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Risk Analysis */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                    Deployment Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { pr: 'PR #234', risk: 'low', reason: 'Small changes, all tests pass' },
                      { pr: 'PR #235', risk: 'medium', reason: 'Database schema changes' },
                      { pr: 'PR #236', risk: 'high', reason: 'Breaking API changes detected' },
                    ].map((analysis, i) => (
                      <div key={i} className="p-2 border border-border rounded">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-sm">{analysis.pr}</div>
                          <Badge
                            variant={
                              analysis.risk === 'high' ? 'destructive' :
                              analysis.risk === 'medium' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {analysis.risk} risk
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{analysis.reason}</div>
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
