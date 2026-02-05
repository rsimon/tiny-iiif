import type { APIRoute } from 'astro';
import { addImagesToManifest } from '../../_ops/manifest-add-images';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, url }) => {
  try {
    const body = await request.json();

    const { folder } = params;
    const { addImages } = body;

    await addImagesToManifest(folder, addImages, url.origin);

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