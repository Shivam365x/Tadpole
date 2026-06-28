import { 
  PullRequest, 
  Incident, 
  Deployment, 
  Alert, 
  CostData, 
  PostgresQuery, 
  DatabaseMetrics, 
  DeveloperMetrics,
  AISuggestion,
  User,
  AlertRule,
  Integration,
  TeamVelocity
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@tadpole.com',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'admin',
    workspaceId: 'ws-1',
  },
  {
    id: '2',
    email: 'jane.smith@tadpole.com',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'developer',
    workspaceId: 'ws-1',
  },
];

// Mock Pull Requests
export const mockPullRequests: PullRequest[] = Array.from({ length: 50 }, (_, i) => {
  const statuses: Array<'open' | 'merged' | 'closed' | 'draft'> = ['open', 'merged', 'closed', 'draft'];
  const ciStatuses: Array<'success' | 'failed' | 'pending' | 'cancelled'> = ['success', 'failed', 'pending', 'cancelled'];
  const repos = ['frontend-app', 'backend-api', 'infrastructure', 'mobile-app', 'analytics-service'];
  const authors = ['john.doe', 'jane.smith', 'bob.wilson', 'alice.brown', 'charlie.davis'];
  
  const status = statuses[i % statuses.length];
  const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  
  return {
    id: `pr-${i + 1}`,
    title: `${['Fix', 'Add', 'Update', 'Refactor', 'Remove'][i % 5]} ${['authentication', 'dashboard', 'API endpoint', 'database query', 'UI component'][Math.floor(Math.random() * 5)]}`,
    description: `This PR ${['fixes a critical bug', 'adds a new feature', 'updates dependencies', 'refactors code', 'removes deprecated code'][i % 5]} in the ${repos[i % repos.length]} repository.`,
    author: authors[i % authors.length],
    repository: repos[i % repos.length],
    sourceBranch: `feature/pr-${i + 1}`,
    targetBranch: 'main',
    status,
    createdAt: createdDate.toISOString(),
    updatedAt: new Date(createdDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewers: authors.slice(0, 2 + (i % 2)),
    approvals: status === 'merged' ? 2 : Math.floor(Math.random() * 3),
    comments: Math.floor(Math.random() * 15),
    changedFiles: Math.floor(Math.random() * 20) + 1,
    additions: Math.floor(Math.random() * 500) + 10,
    deletions: Math.floor(Math.random() * 200) + 5,
    labels: [['bug', 'feature', 'enhancement', 'documentation'][i % 4], ['high-priority', 'low-priority'][i % 2]],
    ciStatus: ciStatuses[i % ciStatuses.length],
    aiSuggestions: i % 3 === 0 ? [
      {
        id: `ai-${i}-1`,
        type: 'security',
        severity: 'high',
        title: 'Potential SQL Injection',
        description: 'User input is directly concatenated into SQL query',
        file: 'src/api/users.ts',
        line: 45,
        suggestion: 'Use parameterized queries instead',
      },
    ] : undefined,
  };
});

// Mock Incidents
export const mockIncidents: Incident[] = Array.from({ length: 20 }, (_, i) => {
  const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
  const statuses: Array<'open' | 'investigating' | 'resolved' | 'closed'> = ['open', 'investigating', 'resolved', 'closed'];
  const services = ['api-gateway', 'auth-service', 'payment-service', 'database', 'cdn'];
  
  const status = statuses[i % statuses.length];
  const createdDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000);
  const resolvedDate = status === 'resolved' || status === 'closed' 
    ? new Date(createdDate.getTime() + Math.random() * 8 * 60 * 60 * 1000) 
    : undefined;
  
  return {
    id: `inc-${i + 1}`,
    title: `${services[i % services.length]} ${['is down', 'high latency', 'connection timeout', 'memory leak', '500 errors'][i % 5]}`,
    description: `Multiple reports of ${['service unavailability', 'slow response times', 'connection failures', 'memory issues', 'server errors'][i % 5]}`,
    severity: severities[i % severities.length],
    status,
    service: services[i % services.length],
    createdAt: createdDate.toISOString(),
    resolvedAt: resolvedDate?.toISOString(),
    assignee: ['john.doe', 'jane.smith', 'bob.wilson'][i % 3],
    impact: `${Math.floor(Math.random() * 5000)} users affected`,
    mttr: resolvedDate ? Math.floor((resolvedDate.getTime() - createdDate.getTime()) / 60000) : undefined,
    aiAnalysis: 'High traffic spike detected. Potential DDoS attack or viral content causing load.',
    rootCause: status === 'resolved' || status === 'closed' ? 'Database connection pool exhaustion due to increased traffic' : undefined,
    timeline: [
      {
        id: `evt-${i}-1`,
        timestamp: createdDate.toISOString(),
        type: 'created',
        user: 'system',
        description: 'Incident created automatically',
      },
      {
        id: `evt-${i}-2`,
        timestamp: new Date(createdDate.getTime() + 5 * 60000).toISOString(),
        type: 'assigned',
        user: 'john.doe',
        description: 'Assigned to on-call engineer',
      },
    ],
  };
});

// Mock Deployments
export const mockDeployments: Deployment[] = Array.from({ length: 100 }, (_, i) => {
  const statuses: Array<'success' | 'failed' | 'in_progress' | 'cancelled'> = ['success', 'failed', 'in_progress', 'cancelled'];
  const environments: Array<'development' | 'staging' | 'production'> = ['development', 'staging', 'production'];
  const services = ['frontend-app', 'backend-api', 'auth-service', 'payment-service', 'analytics-service'];
  const deployers = ['john.doe', 'jane.smith', 'bob.wilson', 'alice.brown'];
  
  const status = i < 3 ? 'in_progress' : statuses[i % statuses.length];
  const deployedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  
  return {
    id: `dep-${i + 1}`,
    service: services[i % services.length],
    environment: environments[i % environments.length],
    version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}`,
    status,
    deployedBy: deployers[i % deployers.length],
    deployedAt: deployedDate.toISOString(),
    duration: Math.floor(Math.random() * 600) + 30,
    commitSha: Math.random().toString(36).substring(7),
    commitMessage: `${['Fix', 'Add', 'Update', 'Refactor'][i % 4]} ${['bug', 'feature', 'dependency', 'configuration'][i % 4]}`,
    pr: `#${Math.floor(Math.random() * 500) + 1}`,
    rollback: Math.random() > 0.9,
    healthChecks: {
      passed: status === 'success' ? 10 : Math.floor(Math.random() * 8),
      failed: status === 'failed' ? Math.floor(Math.random() * 5) + 1 : 0,
      total: 10,
    },
  };
});

// Mock Alerts
export const mockAlerts: Alert[] = Array.from({ length: 200 }, (_, i) => {
  const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
  const statuses: Array<'firing' | 'resolved' | 'acknowledged'> = ['firing', 'resolved', 'acknowledged'];
  const services = ['api-gateway', 'auth-service', 'database', 'cache', 'cdn', 'payment-service'];
  
  const status = statuses[i % statuses.length];
  const triggeredDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  
  return {
    id: `alert-${i + 1}`,
    name: `${services[i % services.length]} - ${['High CPU Usage', 'Memory Threshold', 'High Latency', 'Error Rate', '5xx Responses'][i % 5]}`,
    severity: severities[i % severities.length],
    status,
    service: services[i % services.length],
    message: `${['CPU usage', 'Memory usage', 'Response time', 'Error rate', '5xx count'][i % 5]} exceeded threshold`,
    triggeredAt: triggeredDate.toISOString(),
    resolvedAt: status === 'resolved' ? new Date(triggeredDate.getTime() + Math.random() * 4 * 60 * 60 * 1000).toISOString() : undefined,
    acknowledgedBy: status === 'acknowledged' ? 'john.doe' : undefined,
    rule: `rule-${i % 10}`,
    tags: ['monitoring', services[i % services.length]],
    notificationChannels: ['slack', 'email'],
  };
});

// Mock Cost Data
export const mockCostData: CostData[] = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (5 - i));
  const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  
  const providers: Array<'aws' | 'azure' | 'gcp'> = ['aws', 'azure', 'gcp'];
  const provider = providers[i % 3];
  
  const baseTotal = 15000 + Math.random() * 10000;
  
  return {
    period,
    provider,
    total: baseTotal,
    forecast: i === 5 ? baseTotal * 1.15 : undefined,
    breakdown: [
      { service: 'EC2/Compute', cost: baseTotal * 0.35, change: Math.random() * 20 - 10, department: 'Engineering' },
      { service: 'RDS/Database', cost: baseTotal * 0.25, change: Math.random() * 20 - 10, department: 'Engineering' },
      { service: 'S3/Storage', cost: baseTotal * 0.15, change: Math.random() * 20 - 10, department: 'Engineering' },
      { service: 'CloudFront/CDN', cost: baseTotal * 0.10, change: Math.random() * 20 - 10, department: 'Marketing' },
      { service: 'Lambda/Functions', cost: baseTotal * 0.08, change: Math.random() * 20 - 10, department: 'Engineering' },
      { service: 'Other', cost: baseTotal * 0.07, change: Math.random() * 20 - 10, department: 'Operations' },
    ],
    anomalies: i === 5 ? [
      {
        id: `anom-${i}-1`,
        service: 'EC2/Compute',
        date: period,
        expected: baseTotal * 0.30,
        actual: baseTotal * 0.35,
        deviation: 16.7,
        severity: 'medium',
      },
    ] : [],
  };
});

// Mock PostgreSQL Queries
export const mockPostgresQueries: PostgresQuery[] = Array.from({ length: 100 }, (_, i) => {
  const databases = ['users_db', 'orders_db', 'analytics_db', 'sessions_db'];
  const users = ['app_user', 'admin', 'readonly', 'analytics'];
  const queries = [
    'SELECT * FROM users WHERE id = $1',
    'INSERT INTO orders (user_id, total) VALUES ($1, $2)',
    'UPDATE users SET last_login = NOW() WHERE id = $1',
    'DELETE FROM sessions WHERE expires_at < NOW()',
    'SELECT COUNT(*) FROM orders WHERE created_at > $1',
  ];
  
  return {
    id: `query-${i + 1}`,
    query: queries[i % queries.length],
    database: databases[i % databases.length],
    executionTime: Math.random() > 0.9 ? Math.random() * 5000 + 1000 : Math.random() * 100 + 10,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: users[i % users.length],
    rows: Math.floor(Math.random() * 1000),
    cached: Math.random() > 0.3,
  };
});

// Mock Database Metrics
export const mockDatabaseMetrics: DatabaseMetrics[] = [
  {
    database: 'users_db',
    connections: { active: 45, idle: 15, total: 60, max: 100 },
    performance: { qps: 1250, avgLatency: 12.5, slowQueries: 3 },
    storage: { used: 45.2, total: 100, percentage: 45.2 },
    health: 'healthy',
  },
  {
    database: 'orders_db',
    connections: { active: 82, idle: 8, total: 90, max: 100 },
    performance: { qps: 3420, avgLatency: 25.3, slowQueries: 12 },
    storage: { used: 78.5, total: 100, percentage: 78.5 },
    health: 'warning',
  },
  {
    database: 'analytics_db',
    connections: { active: 23, idle: 27, total: 50, max: 100 },
    performance: { qps: 450, avgLatency: 45.2, slowQueries: 8 },
    storage: { used: 62.3, total: 100, percentage: 62.3 },
    health: 'healthy',
  },
];

// Mock Developer Metrics
export const mockDeveloperMetrics: DeveloperMetrics[] = [
  {
    userId: '1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    period: '2024-06',
    metrics: {
      prsOpened: 23,
      prsReviewed: 45,
      prsMerged: 20,
      avgReviewTime: 4.5,
      linesAdded: 5234,
      linesDeleted: 2103,
      commitsCount: 87,
    },
  },
  {
    userId: '2',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    period: '2024-06',
    metrics: {
      prsOpened: 18,
      prsReviewed: 52,
      prsMerged: 17,
      avgReviewTime: 3.2,
      linesAdded: 4521,
      linesDeleted: 1876,
      commitsCount: 72,
    },
  },
  {
    userId: '3',
    name: 'Bob Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    period: '2024-06',
    metrics: {
      prsOpened: 15,
      prsReviewed: 38,
      prsMerged: 14,
      avgReviewTime: 5.8,
      linesAdded: 3892,
      linesDeleted: 1523,
      commitsCount: 65,
    },
  },
];

// Mock AI Suggestions
export const mockAISuggestions: AISuggestion[] = Array.from({ length: 50 }, (_, i) => {
  const types: Array<'security' | 'performance' | 'best-practice' | 'bug'> = ['security', 'performance', 'best-practice', 'bug'];
  const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
  
  return {
    id: `ai-${i + 1}`,
    type: types[i % types.length],
    severity: severities[i % severities.length],
    title: [
      'Potential SQL Injection Vulnerability',
      'Inefficient Database Query',
      'Missing Error Handling',
      'Deprecated API Usage',
      'Memory Leak Detected',
    ][i % 5],
    description: 'AI-detected issue that requires attention',
    file: `src/${['api', 'components', 'utils', 'services'][i % 4]}/${['index', 'main', 'helper'][i % 3]}.ts`,
    line: Math.floor(Math.random() * 200) + 1,
    suggestion: 'Use parameterized queries and proper input validation',
  };
});

// Mock Alert Rules
export const mockAlertRules: AlertRule[] = [
  {
    id: 'rule-1',
    name: 'High CPU Usage',
    condition: 'cpu_usage > threshold',
    threshold: 80,
    duration: 300,
    severity: 'high',
    enabled: true,
    notificationChannels: ['slack', 'email'],
    services: ['api-gateway', 'auth-service'],
  },
  {
    id: 'rule-2',
    name: 'High Memory Usage',
    condition: 'memory_usage > threshold',
    threshold: 85,
    duration: 300,
    severity: 'critical',
    enabled: true,
    notificationChannels: ['slack', 'pagerduty'],
    services: ['database', 'cache'],
  },
];

// Mock Integrations
export const mockIntegrations: Integration[] = [
  {
    id: 'int-1',
    name: 'GitHub',
    type: 'github',
    status: 'connected',
    connectedAt: '2024-01-15T10:00:00Z',
    config: { org: 'tadpole-inc', repos: ['frontend-app', 'backend-api'] },
  },
  {
    id: 'int-2',
    name: 'Slack',
    type: 'slack',
    status: 'connected',
    connectedAt: '2024-01-10T10:00:00Z',
    config: { workspace: 'tadpole', channel: '#alerts' },
  },
  {
    id: 'int-3',
    name: 'AWS',
    type: 'aws',
    status: 'connected',
    connectedAt: '2024-01-20T10:00:00Z',
    config: { region: 'us-east-1', account: '1234567890' },
  },
];

// Mock Team Velocity
export const mockTeamVelocity: TeamVelocity[] = [
  { sprint: 'Sprint 20', planned: 45, completed: 42, velocity: 42, completionRate: 93.3 },
  { sprint: 'Sprint 21', planned: 48, completed: 46, velocity: 46, completionRate: 95.8 },
  { sprint: 'Sprint 22', planned: 50, completed: 48, velocity: 48, completionRate: 96.0 },
  { sprint: 'Sprint 23', planned: 52, completed: 50, velocity: 50, completionRate: 96.2 },
];
