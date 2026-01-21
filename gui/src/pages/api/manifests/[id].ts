import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

const MANIFESTS_DIR = path.join(process.cwd(), '..', 'data', 'manifests');

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'Manifest ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const filename = `${id}.json`;
    const filePath = path.join(MANIFESTS_DIR, filename);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const manifest = JSON.parse(content);
      
      return new Response(JSON.stringify({
        id,
        filename,
        manifest,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return new Response(JSON.stringify({ 
          error: 'Manifest not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to get manifest',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'Manifest ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const filename = `${id}.json`;
    const filePath = path.join(MANIFESTS_DIR, filename);
    
    try {
      await fs.unlink(filePath);
      
      return new Response(JSON.stringify({
        success: true,
        deleted: {
          id,
          filename,
        },
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return new Response(JSON.stringify({ 
          error: 'Manifest not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }
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