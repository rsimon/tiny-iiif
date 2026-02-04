import path from 'path';
import fs from 'fs/promises';
import type { APIRoute } from 'astro';
import { MANIFESTS_DIR } from '../../_paths';

export const prerender = false;

export const deleteManifest = async (id: string) => {
  const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);

  try {
    await fs.rm(manifestPath);
  } catch (error) {
    console.error(error.message);
    throw new Error('File not found (metadata)');
  }
}

export const DELETE: APIRoute = async ({ params, request  }) => {
  try {
    const id = params.manifestId;

    const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);
    await fs.rm(manifestPath);

    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to delete manifest',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}