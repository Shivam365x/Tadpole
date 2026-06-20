import { CostData, CostBreakdown, CostAnomaly } from '../types';
import { mockCostData } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const costApi = {
  getAll: async (provider?: 'aws' | 'azure' | 'gcp'): Promise<CostData[]> => {
    await delay(600);
    
    if (provider) {
      return mockCostData.filter(cost => cost.provider === provider);
    }
    
    return mockCostData;
  },

  getByPeriod: async (period: string): Promise<CostData | undefined> => {
    await delay(500);
    return mockCostData.find(cost => cost.period === period);
  },

  getCurrentMonth: async (): Promise<CostData> => {
    await delay(500);
    const current = mockCostData[mockCostData.length - 1];
    return current;
  },

  getBreakdown: async (period: string): Promise<CostBreakdown[]> => {
    await delay(500);
    const costData = mockCostData.find(cost => cost.period === period);
    return costData?.breakdown || [];
  },

  getAnomalies: async (): Promise<CostAnomaly[]> => {
    await delay(500);
    const allAnomalies: CostAnomaly[] = [];
    mockCostData.forEach(cost => {
      allAnomalies.push(...cost.anomalies);
    });
    return allAnomalies;
  },

  getForecast: async (): Promise<{ period: string; amount: number }[]> => {
    await delay(600);
    
    const lastMonth = mockCostData[mockCostData.length - 1];
    const avgGrowth = 0.05; // 5% monthly growth
    
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
      const date = new Date(lastMonth.period);
      date.setMonth(date.getMonth() + i);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const amount = lastMonth.total * Math.pow(1 + avgGrowth, i);
      forecast.push({ period, amount: Math.round(amount * 100) / 100 });
    }
    
    return forecast;
  },

  getByDepartment: async (period: string): Promise<{ department: string; cost: number }[]> => {
    await delay(500);
    
    const costData = mockCostData.find(cost => cost.period === period);
    if (!costData) return [];
    
    const byDepartment: { [key: string]: number } = {};
    costData.breakdown.forEach(item => {
      const dept = item.department || 'Unknown';
      byDepartment[dept] = (byDepartment[dept] || 0) + item.cost;
    });
    
    return Object.entries(byDepartment).map(([department, cost]) => ({
      department,
      cost: Math.round(cost * 100) / 100,
    }));
  },

  getTotalSpend: async (): Promise<number> => {
    await delay(400);
    return mockCostData.reduce((sum, cost) => sum + cost.total, 0);
  },

  getSavingsRecommendations: async (): Promise<{
    id: string;
    title: string;
    description: string;
    potentialSavings: number;
    effort: 'low' | 'medium' | 'high';
  }[]> => {
    await delay(700);
    
    return [
      {
        id: 'rec-1',
        title: 'Right-size EC2 Instances',
        description: 'Several EC2 instances are over-provisioned and running at <30% utilization',
        potentialSavings: 2400,
        effort: 'low',
      },
      {
        id: 'rec-2',
        title: 'Enable S3 Intelligent Tiering',
        description: 'Move infrequently accessed S3 objects to cheaper storage classes',
        potentialSavings: 1800,
        effort: 'low',
      },
      {
        id: 'rec-3',
        title: 'Purchase Reserved Instances',
        description: 'Lock in 1-year commitments for consistent workloads',
        potentialSavings: 3600,
        effort: 'medium',
      },
      {
        id: 'rec-4',
        title: 'Optimize Database Instance',
        description: 'RDS instance is oversized for current workload',
        potentialSavings: 1200,
        effort: 'medium',
      },
    ];
  },
};
