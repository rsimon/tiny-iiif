import type { SubDirectory } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const API_BASE = '/tiny/api';

const create = async (name: string): Promise<SubDirectory> => 
  fetch(`${API_BASE}/manifests`, {
    method: 'POST',
    body: JSON.stringify({ name })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create manifest');
    return res.json() as Promise<SubDirectory>;
  });

export const useManifests = () => {
  const queryClient = useQueryClient();

  const refreshManifests = () =>
    queryClient.invalidateQueries({ queryKey: ['directory'] });

  const createManifest = (name: string) =>
    create(name).then(refreshManifests);

  return { 
    createManifest,
    refreshManifests
  };
}