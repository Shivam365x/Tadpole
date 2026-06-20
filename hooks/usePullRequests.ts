import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prApi } from '@/services/api/pr.api';
import { PullRequest } from '@/services/types';

export function usePullRequests(filters?: {
  status?: string;
  repository?: string;
  author?: string;
}) {
  return useQuery({
    queryKey: ['pull-requests', filters],
    queryFn: () => prApi.getAll(filters),
  });
}

export function usePullRequest(id: string) {
  return useQuery({
    queryKey: ['pull-request', id],
    queryFn: () => prApi.getById(id),
    enabled: !!id,
  });
}

export function useApprovePR() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => prApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pull-requests'] });
    },
  });
}

export function useMergePR() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => prApi.merge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pull-requests'] });
    },
  });
}
