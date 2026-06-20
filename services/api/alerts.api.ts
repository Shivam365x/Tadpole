import { Alert, AlertRule } from '../types';
import { mockAlerts, mockAlertRules } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const alertsApi = {
  getAll: async (filters?: {
    severity?: string;
    status?: string;
    service?: string;
  }): Promise<Alert[]> => {
    await delay(500);
    
    let filtered = [...mockAlerts];
    
    if (filters?.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    if (filters?.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }
    if (filters?.service) {
      filtered = filtered.filter(alert => alert.service === filters.service);
    }
    
    return filtered;
  },

  getById: async (id: string): Promise<Alert> => {
    await delay(400);
    
    const alert = mockAlerts.find(a => a.id === id);
    if (!alert) {
      throw new Error('Alert not found');
    }
    
    return alert;
  },

  getFiring: async (): Promise<Alert[]> => {
    await delay(450);
    return mockAlerts.filter(alert => alert.status === 'firing');
  },

  getCritical: async (): Promise<Alert[]> => {
    await delay(450);
    return mockAlerts.filter(alert => alert.severity === 'critical' && alert.status === 'firing');
  },

  acknowledge: async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  resolve: async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  // Alert Rules
  getRules: async (): Promise<AlertRule[]> => {
    await delay(400);
    return mockAlertRules;
  },

  getRule: async (id: string): Promise<AlertRule> => {
    await delay(400);
    
    const rule = mockAlertRules.find(r => r.id === id);
    if (!rule) {
      throw new Error('Alert rule not found');
    }
    
    return rule;
  },

  createRule: async (data: Omit<AlertRule, 'id'>): Promise<AlertRule> => {
    await delay(600);
    
    const newRule: AlertRule = {
      ...data,
      id: `rule-${Date.now()}`,
    };
    
    return newRule;
  },

  updateRule: async (id: string, updates: Partial<AlertRule>): Promise<AlertRule> => {
    await delay(500);
    
    const rule = mockAlertRules.find(r => r.id === id);
    if (!rule) {
      throw new Error('Alert rule not found');
    }
    
    return {
      ...rule,
      ...updates,
    };
  },

  deleteRule: async (id: string): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  toggleRule: async (id: string, enabled: boolean): Promise<{ success: boolean }> => {
    await delay(400);
    return { success: true };
  },

  getMetrics: async (): Promise<{
    total: number;
    firing: number;
    critical: number;
    acknowledged: number;
  }> => {
    await delay(500);
    
    return {
      total: mockAlerts.length,
      firing: mockAlerts.filter(a => a.status === 'firing').length,
      critical: mockAlerts.filter(a => a.severity === 'critical' && a.status === 'firing').length,
      acknowledged: mockAlerts.filter(a => a.status === 'acknowledged').length,
    };
  },
};
