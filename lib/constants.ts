export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/',
    PULL_REQUESTS: '/pull-requests',
    DEPLOYMENTS: '/deployments',
    INCIDENTS: '/incidents',
    ALERTS: '/alerts',
    INFRASTRUCTURE: '/infrastructure',
    DATABASES: '/databases',
    COST: '/cost-monitoring',
    AI_COPILOT: '/ai-copilot',
    ANALYTICS: '/analytics',
    INTEGRATIONS: '/integrations',
    SETTINGS: '/settings',
    BILLING: '/billing',
    USERS: '/users',
  },
} as const;

export const THEME = {
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const;

export const ENVIRONMENTS = ['development', 'staging', 'production'] as const;

export const PR_STATUSES = ['open', 'merged', 'closed', 'draft'] as const;
export const INCIDENT_SEVERITIES = ['critical', 'high', 'medium', 'low'] as const;
export const DEPLOYMENT_STATUSES = ['success', 'failed', 'in_progress', 'cancelled'] as const;
