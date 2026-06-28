'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
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
import { Search, AlertCircle, CheckCircle, Clock, Sparkles, Plus, Filter, Github } from 'lucide-react';
import { usePullRequests, useApprovePR } from '@/hooks/usePullRequests';
import { useGithubConnection } from '@/hooks/useGithub';
import { integrationsApi, GitHubPullRequest } from '@/services/api/integrations.api';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

type PRView = {
  id: string;
  title: string;
  repository: string;
  author: string;
  status: string;
  ciStatus: string;
  approvals: number;
  aiCount: number;
  updatedAt: string;
  url?: string;
};

function mapGithubPR(pr: GitHubPullRequest): PRView {
  return {
    id: `#${pr.number}`,
    title: pr.title,
    repository: pr.repository,
    author: pr.author,
    status: pr.draft ? 'draft' : pr.state, // open | closed | draft
    ciStatus: 'unknown',
    approvals: 0,
    aiCount: 0,
    updatedAt: pr.updated_at || pr.created_at || new Date().toISOString(),
    url: pr.html_url,
  };
}

export default function PullRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('open');

  const { connected } = useGithubConnection();
  const { data: mockPRs, isLoading: mockLoading } = usePullRequests();
  const approveMutation = useApprovePR();

  const [ghPRs, setGhPRs] = useState<PRView[] | null>(null);
  const [ghLoading, setGhLoading] = useState(false);

  useEffect(() => {
    if (connected !== true) return;
    setGhLoading(true);
    integrationsApi
      .githubPullRequests('all')
      .then((r) => setGhPRs(r.items.map(mapGithubPR)))
      .catch(() => setGhPRs([]))
      .finally(() => setGhLoading(false));
  }, [connected]);

  const usingGithub = connected === true && ghPRs !== null;

  const allPRs: PRView[] = useMemo(() => {
    if (usingGithub) return ghPRs as PRView[];
    return (mockPRs || []).map((pr) => ({
      id: `#${pr.id}`,
      title: pr.title,
      repository: pr.repository,
      author: pr.author,
      status: pr.status,
      ciStatus: pr.ciStatus,
      approvals: pr.approvals,
      aiCount: pr.aiSuggestions?.length || 0,
      updatedAt: pr.updatedAt,
    }));
  }, [usingGithub, ghPRs, mockPRs]);

  // Show skeletons while we don't yet know the data source:
  //  - connection status still resolving (null), or
  //  - GitHub connected but its data hasn't arrived, or
  //  - falling back to local data that's still loading.
  const showSkeleton =
    connected === null ||
    (connected === true && (ghLoading || ghPRs === null)) ||
    (connected === false && mockLoading);

  const filteredPRs = allPRs.filter((pr) => {
    const matchesSearch =
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.repository.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'open') return matchesSearch && (pr.status === 'open' || pr.status === 'draft');
    if (activeTab === 'merged') return matchesSearch && pr.status === 'merged';
    if (activeTab === 'closed') return matchesSearch && pr.status === 'closed';
    return matchesSearch;
  });

  const handleApprove = async (id: string) => {
    await approveMutation.mutateAsync(id.replace('#', ''));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-green-600">Open</Badge>;
      case 'merged':
        return <Badge variant="secondary">Merged</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCIStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <span className="text-xs text-muted-foreground">—</span>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Pull Requests"
            breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Pull Requests' }]}
            tabs={[
              { value: 'open', label: 'Open' },
              { value: 'merged', label: 'Merged' },
              { value: 'closed', label: 'Closed' },
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
                  Create PR
                </Button>
              </>
            }
          />

          <main className="flex-1 overflow-y-auto p-3">
            <div className="container-layout space-y-4">
              {usingGithub && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-accent/30 px-3 py-2 text-sm">
                  <Github className="h-4 w-4" />
                  Live data from your connected GitHub account.
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4">
                    {showSkeleton ? <Skeleton className="h-7 w-10" /> : <div className="text-2xl font-bold">{allPRs.filter((pr) => pr.status === 'open').length}</div>}
                    <div className="text-xs text-muted-foreground mt-1">Open PRs</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    {showSkeleton ? <Skeleton className="h-7 w-10" /> : <div className="text-2xl font-bold">{allPRs.filter((pr) => pr.status === 'open' && pr.ciStatus === 'failed').length}</div>}
                    <div className="text-xs text-muted-foreground mt-1">Blocked</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    {showSkeleton ? <Skeleton className="h-7 w-10" /> : <div className="text-2xl font-bold">{allPRs.filter((pr) => pr.status === 'open' && pr.approvals === 0).length}</div>}
                    <div className="text-xs text-muted-foreground mt-1">Awaiting Review</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    {showSkeleton ? <Skeleton className="h-7 w-10" /> : <div className="text-2xl font-bold">{allPRs.filter((pr) => pr.aiCount > 0).length}</div>}
                    <div className="text-xs text-muted-foreground mt-1">AI Suggestions</div>
                  </CardContent>
                </Card>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search PRs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Main Table */}
              <Card className="border-border">
                <CardContent className="p-0">
                  {showSkeleton ? (
                    <div className="space-y-2 p-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-5 flex-1" />
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-7 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : filteredPRs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {usingGithub ? 'No pull requests found on GitHub.' : 'No pull requests.'}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PR</TableHead>
                          <TableHead>Repository</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>CI</TableHead>
                          <TableHead>Reviews</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPRs.map((pr) => (
                          <TableRow key={`${pr.repository}-${pr.id}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium text-sm">{pr.title}</div>
                                <div className="text-xs text-muted-foreground">{pr.id}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{pr.repository}</TableCell>
                            <TableCell className="text-sm">{pr.author}</TableCell>
                            <TableCell>{getStatusBadge(pr.status)}</TableCell>
                            <TableCell>{getCIStatusIcon(pr.ciStatus)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-sm">{pr.approvals}</span>
                                {pr.aiCount > 0 && <Sparkles className="h-3 w-3 text-blue-400 ml-2" />}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(pr.updatedAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                              {pr.url ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(pr.url, '_blank', 'noopener,noreferrer')}
                                >
                                  View
                                </Button>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApprove(pr.id)}
                                    disabled={pr.status !== 'open'}
                                  >
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="ghost" disabled={pr.status !== 'open'}>
                                    Review
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
