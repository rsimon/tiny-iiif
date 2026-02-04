import path from 'path';
import fs from 'fs/promises';
import type { APIRoute } from 'astro';
import { customAlphabet } from 'nanoid';
import { MANIFESTS_DIR } from '../_paths';

export const prerender = false;

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const createManifest = async (name: string) => {
  const id = nanoid();

  const manifest = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: `/manifests/${id}.json`,
    type: 'Manifest',
    label: {
      en: [
        name
      ]
    },
    items: []
  };

  const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return { id, name };
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