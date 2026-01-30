import fs from 'fs/promises';
import path from 'path';
import type { APIRoute } from 'astro';
import { MANIFESTS_DIR } from '../../manifests';
import { META_DIR } from '../../images';
import type { ExtendedImageMetadata } from '@/types';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request }) => {
  const body = await request.json();

  const { folder } = params;
  const { addImages } = body;

  // Load manifest file
  const manifestPath = path.join(MANIFESTS_DIR, `${folder}.json`);
  const raw = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  // Load images metadata
  const images: ExtendedImageMetadata[] = [];
  
  for (const i of addImages) {
    const raw = await fs.readFile(path.join(META_DIR, `${i}.json`), 'utf8');
    images.push(JSON.parse(raw));
  }

  const items = manifest.items || [];

  const patched = {
    ...manifest,
    items: [
      ...items,
      ...images.map((i, idx) => ({
        id: `http://localhost/manifests/${folder}/canvas/${i.id}`,
        type: 'Canvas',
        label: {
          en: [
            i.filename
          ]
        },
        height: i.height,
        width: i.width,
        items: [{
          id: `http://localhost/manifests/${folder}/canvas/${i.id}/page/1`,
          type: 'AnnotationPage',
          items: [{
            id: `http://localhost/manifests/${folder}/canvas/${i.id}/annotation/1`,
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: `http://localhost/iiif/2/${i.id}/full/max/0/default.jpg`,
              type: 'Image',
              height: i.height,
              width: i.width,
              service: [{
                id: `http://localhost/iiif/2/${i.id}`,
                profile: 'level1',
                type: 'ImageService2'
              }]
            },
            target: `http://localhost/manifests/${folder}/canvas/${i.id}`
          }]
        }]
      }))
    ]
  }

  await fs.writeFile(manifestPath, JSON.stringify(patched, null, 2), 'utf8');

  return new Response(JSON.stringify({ message: 'ok' }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}