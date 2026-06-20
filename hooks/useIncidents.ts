import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentsApi } from '@/services/api/incidents.api';

export function useIncidents(filters?: {
  severity?: string;
  status?: string;
  service?: string;
}) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => incidentsApi.getAll(filters),
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => incidentsApi.getById(id),
    enabled: !!id,
  });
}

export function useResolveIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: { rootCause: string; notes: string } }) =>
      incidentsApi.resolve(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useIncidentMetrics() {
  return useQuery({
    queryKey: ['incident-metrics'],
    queryFn: () => incidentsApi.getMetrics(),
  });
}
