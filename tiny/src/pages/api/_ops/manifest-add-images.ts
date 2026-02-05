import fs from 'fs/promises';
import path from 'path';
import type { ExtendedImageMetadata } from '@/types';
import { MANIFESTS_DIR, META_DIR } from './_paths';
import { IMAGE_ITEM_TEMPLATE } from './_templates';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || '';

export const addImagesToManifest = async (manifestId: string, imageIds: string[], origin: string) => {
  const base = BACKEND_BASE || origin;

  // Load manifest file
  const manifestPath = path.join(MANIFESTS_DIR, `${manifestId}.json`);
  const raw = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  // Load images metadata
  const images: ExtendedImageMetadata[] = [];
  
  for (const id of imageIds) {
    const raw = await fs.readFile(path.join(META_DIR, `${id}.json`), 'utf8');
    images.push(JSON.parse(raw));
  }

  const items = manifest.items || [];

  const patched = {
    ...manifest,
    items: [
      ...items,
      ...images.map(img => IMAGE_ITEM_TEMPLATE(manifestId, img, base))
    ]
  };

  return fs.writeFile(manifestPath, JSON.stringify(patched, null, 2), 'utf8');
}