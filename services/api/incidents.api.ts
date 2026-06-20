import { Incident, IncidentEvent } from '../types';
import { mockIncidents } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const incidentsApi = {
  getAll: async (filters?: {
    severity?: string;
    status?: string;
    service?: string;
  }): Promise<Incident[]> => {
    await delay(500);
    
    let filtered = [...mockIncidents];
    
    if (filters?.severity) {
      filtered = filtered.filter(inc => inc.severity === filters.severity);
    }
    if (filters?.status) {
      filtered = filtered.filter(inc => inc.status === filters.status);
    }
    if (filters?.service) {
      filtered = filtered.filter(inc => inc.service === filters.service);
    }
    
    return filtered;
  },

  getById: async (id: string): Promise<Incident> => {
    await delay(400);
    
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) {
      throw new Error('Incident not found');
    }
    
    return incident;
  },

  getActive: async (): Promise<Incident[]> => {
    await delay(450);
    return mockIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating');
  },

  getCritical: async (): Promise<Incident[]> => {
    await delay(450);
    return mockIncidents.filter(inc => inc.severity === 'critical');
  },

  create: async (data: Omit<Incident, 'id' | 'createdAt' | 'timeline'>): Promise<Incident> => {
    await delay(600);
    
    const newIncident: Incident = {
      ...data,
      id: `inc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'created',
          user: 'system',
          description: 'Incident created',
        },
      ],
    };
    
    return newIncident;
  },

  update: async (id: string, updates: Partial<Incident>): Promise<Incident> => {
    await delay(500);
    
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) {
      throw new Error('Incident not found');
    }
    
    return {
      ...incident,
      ...updates,
    };
  },

  resolve: async (id: string, resolution: { rootCause: string; notes: string }): Promise<Incident> => {
    await delay(700);
    
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) {
      throw new Error('Incident not found');
    }
    
    return {
      ...incident,
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      rootCause: resolution.rootCause,
    };
  },

  addComment: async (id: string, comment: string): Promise<IncidentEvent> => {
    await delay(400);
    
    return {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'comment',
      user: 'current-user',
      description: comment,
    };
  },

  assign: async (id: string, assignee: string): Promise<Incident> => {
    await delay(400);
    
    const incident = mockIncidents.find(inc => inc.id === id);
    if (!incident) {
      throw new Error('Incident not found');
    }
    
    return {
      ...incident,
      assignee,
    };
  },

  getMetrics: async (): Promise<{
    total: number;
    active: number;
    critical: number;
    avgMTTR: number;
  }> => {
    await delay(500);
    
    const active = mockIncidents.filter(inc => inc.status === 'open' || inc.status === 'investigating');
    const critical = mockIncidents.filter(inc => inc.severity === 'critical');
    const resolved = mockIncidents.filter(inc => inc.mttr);
    const avgMTTR = resolved.reduce((sum, inc) => sum + (inc.mttr || 0), 0) / resolved.length;
    
    return {
      total: mockIncidents.length,
      active: active.length,
      critical: critical.length,
      avgMTTR: Math.round(avgMTTR),
    };
  },
};
