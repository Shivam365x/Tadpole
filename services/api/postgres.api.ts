import { PostgresQuery, DatabaseMetrics } from '../types';
import { mockPostgresQueries, mockDatabaseMetrics } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const postgresApi = {
  getQueries: async (filters?: {
    database?: string;
    slow?: boolean;
    limit?: number;
  }): Promise<PostgresQuery[]> => {
    await delay(500);
    
    let filtered = [...mockPostgresQueries];
    
    if (filters?.database) {
      filtered = filtered.filter(q => q.database === filters.database);
    }
    
    if (filters?.slow) {
      filtered = filtered.filter(q => q.executionTime > 1000);
    }
    
    // Sort by execution time descending
    filtered.sort((a, b) => b.executionTime - a.executionTime);
    
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    
    return filtered;
  },

  getSlowQueries: async (threshold: number = 1000): Promise<PostgresQuery[]> => {
    await delay(500);
    return mockPostgresQueries
      .filter(q => q.executionTime > threshold)
      .sort((a, b) => b.executionTime - a.executionTime);
  },

  getQueryById: async (id: string): Promise<PostgresQuery> => {
    await delay(400);
    
    const query = mockPostgresQueries.find(q => q.id === id);
    if (!query) {
      throw new Error('Query not found');
    }
    
    return query;
  },

  explainQuery: async (query: string): Promise<{ plan: string; estimatedCost: number }> => {
    await delay(800);
    
    return {
      plan: `Seq Scan on users  (cost=0.00..431.00 rows=10000 width=100)
  Filter: (status = 'active')
  Planning time: 0.123 ms
  Execution time: 45.234 ms`,
      estimatedCost: 431.00,
    };
  },

  getMetrics: async (database?: string): Promise<DatabaseMetrics[]> => {
    await delay(500);
    
    if (database) {
      const metrics = mockDatabaseMetrics.find(m => m.database === database);
      return metrics ? [metrics] : [];
    }
    
    return mockDatabaseMetrics;
  },

  getDatabaseHealth: async (database: string): Promise<DatabaseMetrics> => {
    await delay(500);
    
    const metrics = mockDatabaseMetrics.find(m => m.database === database);
    if (!metrics) {
      throw new Error('Database not found');
    }
    
    return metrics;
  },

  getConnectionStats: async (database: string): Promise<{
    active: number;
    idle: number;
    total: number;
    max: number;
    utilization: number;
  }> => {
    await delay(400);
    
    const metrics = mockDatabaseMetrics.find(m => m.database === database);
    if (!metrics) {
      throw new Error('Database not found');
    }
    
    return {
      ...metrics.connections,
      utilization: Math.round((metrics.connections.total / metrics.connections.max) * 100),
    };
  },

  getIndexUsage: async (database: string): Promise<{
    table: string;
    index: string;
    scans: number;
    tuplesRead: number;
    tuplesReturned: number;
  }[]> => {
    await delay(600);
    
    return [
      {
        table: 'users',
        index: 'users_email_idx',
        scans: 15234,
        tuplesRead: 15234,
        tuplesReturned: 15234,
      },
      {
        table: 'orders',
        index: 'orders_user_id_idx',
        scans: 8921,
        tuplesRead: 45231,
        tuplesReturned: 8921,
      },
      {
        table: 'sessions',
        index: 'sessions_token_idx',
        scans: 23456,
        tuplesRead: 23456,
        tuplesReturned: 23456,
      },
    ];
  },

  getDeadlocks: async (database: string): Promise<{
    id: string;
    timestamp: string;
    query1: string;
    query2: string;
    resolved: boolean;
  }[]> => {
    await delay(500);
    
    return [
      {
        id: 'dl-1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        query1: 'UPDATE users SET balance = balance - 100 WHERE id = 1',
        query2: 'UPDATE users SET balance = balance + 100 WHERE id = 2',
        resolved: true,
      },
    ];
  },

  getTableSizes: async (database: string): Promise<{
    table: string;
    size: number;
    rows: number;
  }[]> => {
    await delay(500);
    
    return [
      { table: 'users', size: 2.5, rows: 150000 },
      { table: 'orders', size: 8.3, rows: 450000 },
      { table: 'sessions', size: 1.2, rows: 80000 },
      { table: 'products', size: 0.8, rows: 25000 },
    ];
  },
};
