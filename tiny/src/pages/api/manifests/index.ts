import type { APIRoute } from 'astro';
import type { ManifestMetadata } from '@/types';
import { createManifest } from '../_ops/manifest-create';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  try {    
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new Response(JSON.stringify({ 
        error: 'Missing manifest name' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const meta = await createManifest(name, url.origin);

    const manifest: ManifestMetadata = {
      type: 'manifest',
      ...meta
    };
    
    return new Response(JSON.stringify(manifest), {
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