import { Deployment } from '../types';
import { mockDeployments } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const deploymentsApi = {
  getAll: async (filters?: {
    environment?: string;
    status?: string;
    service?: string;
  }): Promise<Deployment[]> => {
    await delay(500);
    
    let filtered = [...mockDeployments];
    
    if (filters?.environment) {
      filtered = filtered.filter(dep => dep.environment === filters.environment);
    }
    if (filters?.status) {
      filtered = filtered.filter(dep => dep.status === filters.status);
    }
    if (filters?.service) {
      filtered = filtered.filter(dep => dep.service === filters.service);
    }
    
    return filtered;
  },

  getById: async (id: string): Promise<Deployment> => {
    await delay(400);
    
    const deployment = mockDeployments.find(dep => dep.id === id);
    if (!deployment) {
      throw new Error('Deployment not found');
    }
    
    return deployment;
  },

  getRecent: async (limit: number = 20): Promise<Deployment[]> => {
    await delay(450);
    return mockDeployments.slice(0, limit);
  },

  getInProgress: async (): Promise<Deployment[]> => {
    await delay(400);
    return mockDeployments.filter(dep => dep.status === 'in_progress');
  },

  getFailed: async (): Promise<Deployment[]> => {
    await delay(400);
    return mockDeployments.filter(dep => dep.status === 'failed');
  },

  create: async (data: Omit<Deployment, 'id' | 'deployedAt' | 'status'>): Promise<Deployment> => {
    await delay(800);
    
    const newDeployment: Deployment = {
      ...data,
      id: `dep-${Date.now()}`,
      deployedAt: new Date().toISOString(),
      status: 'in_progress',
    };
    
    return newDeployment;
  },

  cancel: async (id: string): Promise<{ success: boolean }> => {
    await delay(600);
    return { success: true };
  },

  rollback: async (id: string): Promise<Deployment> => {
    await delay(1000);
    
    const deployment = mockDeployments.find(dep => dep.id === id);
    if (!deployment) {
      throw new Error('Deployment not found');
    }
    
    return {
      ...deployment,
      id: `dep-rollback-${Date.now()}`,
      rollback: true,
      status: 'in_progress',
      deployedAt: new Date().toISOString(),
    };
  },

  getMetrics: async (): Promise<{
    total: number;
    successRate: number;
    avgDuration: number;
    deploymentsToday: number;
  }> => {
    await delay(500);
    
    const successful = mockDeployments.filter(dep => dep.status === 'success');
    const successRate = (successful.length / mockDeployments.length) * 100;
    const avgDuration = mockDeployments.reduce((sum, dep) => sum + dep.duration, 0) / mockDeployments.length;
    
    const today = new Date().toDateString();
    const deploymentsToday = mockDeployments.filter(dep => 
      new Date(dep.deployedAt).toDateString() === today
    ).length;
    
    return {
      total: mockDeployments.length,
      successRate: Math.round(successRate * 10) / 10,
      avgDuration: Math.round(avgDuration),
      deploymentsToday,
    };
  },

  getFrequency: async (days: number = 30): Promise<{ date: string; count: number }[]> => {
    await delay(500);
    
    const frequency: { [key: string]: number } = {};
    const now = Date.now();
    const daysAgo = days * 24 * 60 * 60 * 1000;
    
    mockDeployments.forEach(dep => {
      const depDate = new Date(dep.deployedAt);
      if (now - depDate.getTime() <= daysAgo) {
        const dateStr = depDate.toISOString().split('T')[0];
        frequency[dateStr] = (frequency[dateStr] || 0) + 1;
      }
    });
    
    return Object.entries(frequency).map(([date, count]) => ({ date, count }));
  },
};
