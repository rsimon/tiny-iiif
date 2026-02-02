import path from 'path';
import type { APIRoute } from 'astro';
import { createManifest, listManifests } from './_utils';

export const prerender = false;

export const MANIFESTS_DIR = path.join(process.cwd(), '..', 'data', 'manifests');

export const GET: APIRoute = async ({ url }) => {
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '100');
    
  const { manifests, total } = await listManifests(offset, limit);

  return new Response(JSON.stringify({
    total,
    offset,
    limit,
    manifests
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
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

    const meta = await createManifest(name);
    
    return new Response(JSON.stringify(meta), {
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