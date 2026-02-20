import type { Manifest } from '@/types';
import { getOrigin } from './utils';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || getOrigin();

export const getManifestURL = (manifest: Manifest, origin: string = BACKEND_BASE) =>
  `${origin}/manifests/${manifest.id}.json`;