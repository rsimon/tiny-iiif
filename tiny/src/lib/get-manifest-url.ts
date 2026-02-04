import type { SubDirectory } from '@/types';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || '';

export const getManifestURL = (manifest: SubDirectory, origin: string = BACKEND_BASE) => {
  return `${origin}/manifests/${manifest.id}.json`;
}