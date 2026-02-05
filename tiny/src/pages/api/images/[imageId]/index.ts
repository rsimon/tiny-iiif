import type { APIRoute } from 'astro';
import { renameImage } from '../../_ops/image-rename';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, url }) => {
  try {
    const { imageId } = params;
    
    const body = await request.json();
    const { name } = body;

    const meta = await renameImage(imageId, name);

    return new Response(JSON.stringify(meta), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Could not modify image',
      reason: error instanceof Error ? error.message : 'Unknown'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}