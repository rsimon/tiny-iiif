import { useCallback, useEffect, useState } from 'react'; 
import { useQueryClient } from '@tanstack/react-query';
import type { Manifest } from '@/types';

export const useManifest = (id: string) => {

  const queryClient = useQueryClient();

  const [manifest, setManifest] = useState<Manifest>();

  useEffect(() => {
    fetch(`/tiny/api/manifests/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch manifest');
        return res.json();
      })
      .then(setManifest);
  }, [id]);

  const updateManifest = useCallback((manifest: Manifest) => {
    return fetch(`/tiny/api/manifests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(manifest)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update manifest');
      return res.json();
    })
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['directory'] });
      setManifest(manifest);
    });
  }, []);

  return { updateManifest, manifest };

}