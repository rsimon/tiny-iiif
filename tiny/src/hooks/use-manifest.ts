import type { Manifest } from '@/types';
import { useEffect, useState } from 'react'; 

export const useManifest = (id: string) => {

  const [manifest, setManifest] = useState<Manifest>();

  useEffect(() => {
    fetch(`/tiny/api/manifests/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch manifest');
        return res.json();
      })
      .then(setManifest);
  }, [id]);

  return { manifest };

}