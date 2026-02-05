import type { APIRoute } from 'astro';
import { addImagesToManifest } from '../../_ops/manifest-add-images';
import { reorderImagesInManifest } from '../../_ops/manifest-reorder-images';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, url }) => {
  try {
    const body = await request.json();

    const { folder } = params;
    const { addImages } = body;
    const { reorderImages } = body;

    if (addImages) {
      await addImagesToManifest(folder, addImages, url.origin);
    } else if (reorderImages) {
      const { images, moveToIndex } = reorderImages;
      await reorderImagesInManifest(folder, images, moveToIndex);
    } else {
      throw new Error('Invalid PATCH request');
    }

    return new Response(JSON.stringify({ message: 'ok' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Could not create manifest',
      reason: error instanceof Error ? error.message : 'Unknown'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}