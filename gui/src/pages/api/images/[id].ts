import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

const IMAGES_DIR = path.join(process.cwd(), '..', 'data', 'images');

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'Image ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const files = await fs.readdir(IMAGES_DIR);
    const matchingFile = files.find(f => path.parse(f).name === id);
    
    if (!matchingFile) {
      return new Response(JSON.stringify({ 
        error: 'Image not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const filePath = path.join(IMAGES_DIR, matchingFile);
    await fs.unlink(filePath);
    
    return new Response(JSON.stringify({
      success: true,
      deleted: {
        id,
        filename: matchingFile,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to delete image',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}