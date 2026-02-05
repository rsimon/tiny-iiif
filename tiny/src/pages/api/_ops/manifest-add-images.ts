import fs from 'fs/promises';
import path from 'path';
import type { ExtendedImageMetadata } from '@/types';
import { MANIFESTS_DIR, META_DIR } from './_paths';

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
      ...images.map(img => ({
        id: `${base}/manifests/${manifestId}/canvas/${img.id}`,
        type: 'Canvas',
        label: {
          en: [
            img.filename
          ]
        },
        height: img.height,
        width: img.width,
        items: [{
          id: `${base}/manifests/${manifestId}/canvas/${img.id}/page/1`,
          type: 'AnnotationPage',
          items: [{
            id: `${base}/manifests/${manifestId}/canvas/${img.id}/annotation/1`,
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: `${base}/iiif/2/${img.id}/full/max/0/default.jpg`,
              type: 'Image',
              height: img.height,
              width: img.width,
              service: [{
                id: `${base}/iiif/2/${img.id}`,
                profile: 'level1',
                type: 'ImageService2'
              }]
            },
            target: `${base}/manifests/${manifestId}/canvas/${img.id}`
          }]
        }]
      }))
    ]
  }

  return fs.writeFile(manifestPath, JSON.stringify(patched, null, 2), 'utf8');
}