import { AISuggestion } from '../types';
import { mockAISuggestions } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aiApi = {
  getSuggestions: async (filters?: {
    type?: string;
    severity?: string;
  }): Promise<AISuggestion[]> => {
    await delay(600);
    
    let filtered = [...mockAISuggestions];
    
    if (filters?.type) {
      filtered = filtered.filter(s => s.type === filters.type);
    }
    if (filters?.severity) {
      filtered = filtered.filter(s => s.severity === filters.severity);
    }
    
    return filtered;
  },

  getSuggestionById: async (id: string): Promise<AISuggestion> => {
    await delay(400);
    
    const suggestion = mockAISuggestions.find(s => s.id === id);
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }
    
    return suggestion;
  },

  getSecurityFindings: async (): Promise<AISuggestion[]> => {
    await delay(600);
    return mockAISuggestions.filter(s => s.type === 'security');
  },

  getPerformanceRecommendations: async (): Promise<AISuggestion[]> => {
    await delay(600);
    return mockAISuggestions.filter(s => s.type === 'performance');
  },

  analyzePR: async (prId: string): Promise<{
    riskScore: number;
    issues: AISuggestion[];
    recommendation: string;
  }> => {
    await delay(1200);
    
    const issues = mockAISuggestions.slice(0, 3);
    const riskScore = Math.floor(Math.random() * 40) + 20; // 20-60
    
    return {
      riskScore,
      issues,
      recommendation: riskScore > 50
        ? 'This PR contains potential security vulnerabilities. Review carefully before merging.'
        : 'This PR looks good. Minor improvements suggested.',
    };
  },

  analyzeIncident: async (incidentId: string): Promise<{
    rootCause: string;
    affectedServices: string[];
    recommendations: string[];
    similarIncidents: string[];
  }> => {
    await delay(1500);
    
    return {
      rootCause: 'Database connection pool exhaustion due to sudden traffic spike from marketing campaign',
      affectedServices: ['api-gateway', 'auth-service', 'database'],
      recommendations: [
        'Increase database connection pool size',
        'Implement connection pooling timeout',
        'Add rate limiting on API endpoints',
        'Set up auto-scaling triggers',
      ],
      similarIncidents: ['inc-5', 'inc-12', 'inc-18'],
    };
  },

  analyzeDeployment: async (deploymentId: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    checks: { name: string; passed: boolean; message: string }[];
    recommendation: string;
  }> => {
    await delay(1000);
    
    return {
      riskLevel: 'low',
      checks: [
        { name: 'Security Scan', passed: true, message: 'No vulnerabilities detected' },
        { name: 'Performance Tests', passed: true, message: 'All tests passed' },
        { name: 'Breaking Changes', passed: true, message: 'No breaking changes detected' },
        { name: 'Dependencies', passed: true, message: 'All dependencies up to date' },
      ],
      recommendation: 'Safe to deploy. All checks passed.',
    };
  },

  naturalLanguageQuery: async (query: string): Promise<{
    answer: string;
    sources: string[];
    relatedData: any[];
  }> => {
    await delay(1500);
    
    // Mock natural language processing
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('deployment') && lowerQuery.includes('fail')) {
      return {
        answer: 'The deployment failed yesterday at 3:45 PM due to a failed health check. The API service did not respond within the timeout period. Root cause: Database connection timeout.',
        sources: ['deployment-logs', 'health-check-results', 'database-metrics'],
        relatedData: [
          { type: 'deployment', id: 'dep-42', status: 'failed' },
          { type: 'incident', id: 'inc-15', related: true },
        ],
      };
    }
    
    if (lowerQuery.includes('cost') || lowerQuery.includes('spending')) {
      return {
        answer: 'Current monthly cloud spending is $22,450, which is 12% higher than last month. The increase is primarily from EC2 compute costs (+$1,800) and RDS database costs (+$900).',
        sources: ['cost-analytics', 'aws-billing', 'azure-billing'],
        relatedData: [],
      };
    }
    
    if (lowerQuery.includes('incident')) {
      return {
        answer: 'There are currently 3 active incidents: 2 high-severity and 1 medium-severity. Average resolution time this week is 45 minutes.',
        sources: ['incident-tracking', 'metrics-dashboard'],
        relatedData: [],
      };
    }
    
    return {
      answer: 'I analyzed the system and found relevant information based on your query.',
      sources: ['system-logs', 'metrics-dashboard'],
      relatedData: [],
    };
  },

  getOptimizationRecommendations: async (): Promise<{
    category: string;
    title: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
    description: string;
  }[]> => {
    await delay(800);
    
    return [
      {
        category: 'Performance',
        title: 'Implement Redis Caching',
        impact: 'high',
        effort: 'medium',
        description: 'Add Redis caching layer to reduce database load by ~60%',
      },
      {
        category: 'Cost',
        title: 'Right-size EC2 Instances',
        impact: 'medium',
        effort: 'low',
        description: 'Several instances running at <30% utilization. Estimated savings: $2,400/month',
      },
      {
        category: 'Security',
        title: 'Enable MFA for Admin Users',
        impact: 'high',
        effort: 'low',
        description: '5 admin accounts without MFA. High security risk.',
      },
      {
        category: 'Reliability',
        title: 'Add Circuit Breakers',
        impact: 'high',
        effort: 'medium',
        description: 'Implement circuit breaker pattern to prevent cascade failures',
      },
    ];
  },
};
