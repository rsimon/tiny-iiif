import type { Manifest } from '@/types';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || '';

export const getManifestURL = (manifest: Manifest, origin: string = BACKEND_BASE) =>
  `${origin}/manifests/${manifest.id}.json`;