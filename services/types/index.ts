// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'developer' | 'viewer';
  workspaceId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

// Pull Request Types
export interface PullRequest {
  id: string;
  title: string;
  description: string;
  author: string;
  repository: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed' | 'draft';
  createdAt: string;
  updatedAt: string;
  reviewers: string[];
  approvals: number;
  comments: number;
  changedFiles: number;
  additions: number;
  deletions: number;
  aiSuggestions?: AISuggestion[];
  labels: string[];
  ciStatus: 'success' | 'failed' | 'pending' | 'cancelled';
}

export interface AISuggestion {
  id: string;
  type: 'security' | 'performance' | 'best-practice' | 'bug';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line: number;
  suggestion: string;
}

// Incident Types
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  service: string;
  createdAt: string;
  resolvedAt?: string;
  assignee?: string;
  timeline: IncidentEvent[];
  aiAnalysis?: string;
  rootCause?: string;
  impact: string;
  mttr?: number; // Mean Time To Resolution in minutes
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'created' | 'assigned' | 'updated' | 'resolved' | 'comment';
  user: string;
  description: string;
}

// Deployment Types
export interface Deployment {
  id: string;
  service: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  status: 'success' | 'failed' | 'in_progress' | 'cancelled';
  deployedBy: string;
  deployedAt: string;
  duration: number; // in seconds
  commitSha: string;
  commitMessage: string;
  pr?: string;
  rollback: boolean;
  healthChecks: {
    passed: number;
    failed: number;
    total: number;
  };
}

// Alert Types
export interface Alert {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'firing' | 'resolved' | 'acknowledged';
  service: string;
  message: string;
  triggeredAt: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
  rule: string;
  tags: string[];
  notificationChannels: string[];
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  duration: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  notificationChannels: string[];
  services: string[];
}

// Cost Types
export interface CostData {
  period: string; // YYYY-MM
  provider: 'aws' | 'azure' | 'gcp';
  total: number;
  breakdown: CostBreakdown[];
  forecast?: number;
  anomalies: CostAnomaly[];
}

export interface CostBreakdown {
  service: string;
  cost: number;
  change: number; // percentage
  department?: string;
}

export interface CostAnomaly {
  id: string;
  service: string;
  date: string;
  expected: number;
  actual: number;
  deviation: number; // percentage
  severity: 'high' | 'medium' | 'low';
}

// PostgreSQL Types
export interface PostgresQuery {
  id: string;
  query: string;
  database: string;
  executionTime: number; // milliseconds
  timestamp: string;
  user: string;
  rows: number;
  cached: boolean;
  plan?: string;
}

export interface DatabaseMetrics {
  database: string;
  connections: {
    active: number;
    idle: number;
    total: number;
    max: number;
  };
  performance: {
    qps: number; // queries per second
    avgLatency: number;
    slowQueries: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  health: 'healthy' | 'warning' | 'critical';
}

// Team Analytics Types
export interface DeveloperMetrics {
  userId: string;
  name: string;
  avatar?: string;
  metrics: {
    prsOpened: number;
    prsReviewed: number;
    prsMerged: number;
    avgReviewTime: number; // hours
    linesAdded: number;
    linesDeleted: number;
    commitsCount: number;
  };
  period: string;
}

export interface TeamVelocity {
  sprint: string;
  planned: number;
  completed: number;
  velocity: number;
  completionRate: number;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  memberCount: number;
}

// Settings Types
export interface NotificationPreferences {
  email: boolean;
  slack: boolean;
  sms: boolean;
  incidents: boolean;
  deployments: boolean;
  pullRequests: boolean;
  alerts: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'github' | 'gitlab' | 'slack' | 'pagerduty' | 'datadog' | 'aws' | 'azure' | 'gcp';
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: string;
  config: Record<string, any>;
}
