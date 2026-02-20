import type { APIRoute } from 'astro';
import { deleteManifest } from '../../_ops/manifest-delete';

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.manifestId;
    await deleteManifest(id);

    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Could not delete manifest',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}