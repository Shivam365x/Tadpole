import { PullRequest } from '../types';
import { mockPullRequests } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const prApi = {
  getAll: async (filters?: {
    status?: string;
    repository?: string;
    author?: string;
  }): Promise<PullRequest[]> => {
    await delay(500);
    
    let filtered = [...mockPullRequests];
    
    if (filters?.status) {
      filtered = filtered.filter(pr => pr.status === filters.status);
    }
    if (filters?.repository) {
      filtered = filtered.filter(pr => pr.repository === filters.repository);
    }
    if (filters?.author) {
      filtered = filtered.filter(pr => pr.author === filters.author);
    }
    
    return filtered;
  },

  getById: async (id: string): Promise<PullRequest> => {
    await delay(400);
    
    const pr = mockPullRequests.find(pr => pr.id === id);
    if (!pr) {
      throw new Error('Pull request not found');
    }
    
    return pr;
  },

  getOpenPRs: async (): Promise<PullRequest[]> => {
    await delay(450);
    return mockPullRequests.filter(pr => pr.status === 'open');
  },

  getBlockedPRs: async (): Promise<PullRequest[]> => {
    await delay(450);
    return mockPullRequests.filter(pr => 
      pr.status === 'open' && pr.ciStatus === 'failed'
    );
  },

  getAwaitingReview: async (): Promise<PullRequest[]> => {
    await delay(450);
    return mockPullRequests.filter(pr => 
      pr.status === 'open' && pr.approvals === 0
    );
  },

  getRecentlyMerged: async (): Promise<PullRequest[]> => {
    await delay(450);
    return mockPullRequests
      .filter(pr => pr.status === 'merged')
      .slice(0, 10);
  },

  approve: async (id: string): Promise<{ success: boolean }> => {
    await delay(600);
    return { success: true };
  },

  requestChanges: async (id: string, comment: string): Promise<{ success: boolean }> => {
    await delay(600);
    return { success: true };
  },

  merge: async (id: string): Promise<{ success: boolean }> => {
    await delay(800);
    return { success: true };
  },

  comment: async (id: string, comment: string): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  getAISuggestions: async (id: string): Promise<PullRequest['aiSuggestions']> => {
    await delay(700);
    
    const pr = mockPullRequests.find(pr => pr.id === id);
    return pr?.aiSuggestions || [];
  },
};
