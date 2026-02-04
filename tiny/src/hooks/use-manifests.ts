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

const remove = async (id: string) =>
  fetch(`/tiny/api/manifests/${id}`, {
    method: 'DELETE'
  }).then(res => {
    if (!res.ok) throw new Error('Failed to delete manifest');
    return res.json();
  });

export const useManifests = () => {
  const queryClient = useQueryClient();

  const refreshDirectory = () =>
    queryClient.invalidateQueries({ queryKey: ['directory'] });

  const createManifest = (name: string) => create(name).then(refreshDirectory);

  const deleteManifest = (id: string) => remove(id).then(refreshDirectory);

  return { 
    createManifest,
    deleteManifest
  };
}