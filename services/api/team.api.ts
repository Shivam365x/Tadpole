import { DeveloperMetrics, TeamVelocity } from '../types';
import { mockDeveloperMetrics, mockTeamVelocity } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const teamApi = {
  getDeveloperMetrics: async (period?: string): Promise<DeveloperMetrics[]> => {
    await delay(500);
    
    if (period) {
      return mockDeveloperMetrics.filter(m => m.period === period);
    }
    
    return mockDeveloperMetrics;
  },

  getDeveloperById: async (userId: string, period: string): Promise<DeveloperMetrics> => {
    await delay(400);
    
    const metrics = mockDeveloperMetrics.find(m => m.userId === userId && m.period === period);
    if (!metrics) {
      throw new Error('Developer metrics not found');
    }
    
    return metrics;
  },

  getTeamVelocity: async (): Promise<TeamVelocity[]> => {
    await delay(500);
    return mockTeamVelocity;
  },

  getWorkloadDistribution: async (): Promise<{
    developer: string;
    openPRs: number;
    reviewsPending: number;
    tickets: number;
  }[]> => {
    await delay(500);
    
    return [
      {
        developer: 'John Doe',
        openPRs: 5,
        reviewsPending: 12,
        tickets: 8,
      },
      {
        developer: 'Jane Smith',
        openPRs: 3,
        reviewsPending: 15,
        tickets: 6,
      },
      {
        developer: 'Bob Wilson',
        openPRs: 4,
        reviewsPending: 8,
        tickets: 10,
      },
    ];
  },

  getReviewTurnaround: async (): Promise<{
    developer: string;
    avgTime: number;
    reviewsCompleted: number;
  }[]> => {
    await delay(500);
    
    return mockDeveloperMetrics.map(m => ({
      developer: m.name,
      avgTime: m.metrics.avgReviewTime,
      reviewsCompleted: m.metrics.prsReviewed,
    }));
  },

  getSprintPerformance: async (sprint: string): Promise<{
    planned: number;
    completed: number;
    carryover: number;
    velocity: number;
  }> => {
    await delay(500);
    
    const sprintData = mockTeamVelocity.find(v => v.sprint === sprint);
    if (!sprintData) {
      throw new Error('Sprint not found');
    }
    
    return {
      planned: sprintData.planned,
      completed: sprintData.completed,
      carryover: sprintData.planned - sprintData.completed,
      velocity: sprintData.velocity,
    };
  },

  getTopContributors: async (period: string, metric: 'commits' | 'prs' | 'reviews'): Promise<{
    name: string;
    value: number;
    avatar?: string;
  }[]> => {
    await delay(500);
    
    const sortedMetrics = [...mockDeveloperMetrics]
      .filter(m => m.period === period)
      .sort((a, b) => {
        switch (metric) {
          case 'commits':
            return b.metrics.commitsCount - a.metrics.commitsCount;
          case 'prs':
            return b.metrics.prsMerged - a.metrics.prsMerged;
          case 'reviews':
            return b.metrics.prsReviewed - a.metrics.prsReviewed;
          default:
            return 0;
        }
      });
    
    return sortedMetrics.map(m => ({
      name: m.name,
      value: metric === 'commits' ? m.metrics.commitsCount :
             metric === 'prs' ? m.metrics.prsMerged :
             m.metrics.prsReviewed,
      avatar: m.avatar,
    }));
  },
};
