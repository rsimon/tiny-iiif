import { useQueryClient } from '@tanstack/react-query';
import type { Manifest } from '@/types';

const create = async (name: string): Promise<Manifest> => 
  fetch('/tiny/api/manifests', {
    method: 'POST',
    body: JSON.stringify({ name })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create manifest');
    return res.json() as Promise<Manifest>;
  });

export const useManifests = () => {
  const queryClient = useQueryClient();

  const refreshDirectory = () =>
    queryClient.invalidateQueries({ queryKey: ['directory'] });

  const createManifest = (name: string) => create(name).then(refreshDirectory);

  return { 
    createManifest
  };
}