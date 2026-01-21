import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

const MANIFESTS_DIR = path.join(process.cwd(), '..', 'data', 'manifests');

export const GET: APIRoute = async () => {
  try {    
    const files = await fs.readdir(MANIFESTS_DIR);
    const manifestFiles = files.filter(f => f.endsWith('.json'));
    
    const manifests = await Promise.all(
      manifestFiles.map(async (filename) => {
        const filePath = path.join(MANIFESTS_DIR, filename);
        const stats = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf-8');
        
        let label = filename;

        try {
          const json = JSON.parse(content);
          // Try to extract label from IIIF manifest
          if (json.label) {
            label = typeof json.label === 'string' 
              ? json.label 
              : json.label['en']?.[0] || json.label['@value'] || filename;
          }
        } catch {
          // If JSON parsing fails, just use filename
        }
        
        return {
          id: path.parse(filename).name,
          filename,
          label,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      })
    );
    
    manifests.sort((a, b) => a.filename.localeCompare(b.filename));
    
    return new Response(JSON.stringify({
      manifests,
      total: manifests.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to list manifests',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {    
    const body = await request.json();
    const { id, manifest } = body;
    
    if (!id || !manifest) {
      return new Response(JSON.stringify({ 
        error: 'Both id and manifest are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    let manifestObj;
    try {
      manifestObj = typeof manifest === 'string' 
        ? JSON.parse(manifest) 
        : manifest;
    } catch {
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in manifest' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const filename = `${id}.json`;
    const filePath = path.join(MANIFESTS_DIR, filename);
    
    let existed = false;
    try {
      await fs.access(filePath);
      existed = true;
    } catch {
      // File doesn't exist, will be created
    }
    
    await fs.writeFile(
      filePath, 
      JSON.stringify(manifestObj, null, 2), 
      'utf-8'
    );
    
    return new Response(JSON.stringify({
      success: true,
      action: existed ? 'updated' : 'created',
      manifest: {
        id,
        filename,
      },
    }), {
      status: existed ? 200 : 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to save manifest',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}