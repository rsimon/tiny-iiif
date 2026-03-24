import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { deleteManifest } from '../../_ops/manifest-delete';
import { MANIFESTS_DIR } from '../../_ops/_paths';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.manifestId;

    const raw = await fs.readFile(path.join(MANIFESTS_DIR, `${id}.json`), 'utf8');
    const manifest = JSON.parse(raw);

    return new Response(JSON.stringify(manifest), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Could not load manifest: ${params.manifestId}`,
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = params.manifestId;
    const body = await request.json();

    const filePath = path.join(MANIFESTS_DIR, `${id}.json`);

    console.log('updating ' + id);
    console.log(JSON.stringify(body, null, 2));

    // Ensure the manifest already exists — PUT should replace, not create
    await fs.access(filePath);
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: `Could not update manifest: ${params.manifestId}`,
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}