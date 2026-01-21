import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const prerender = false;

const IMAGES_DIR = path.join(process.cwd(), '..', 'data', 'images');

export const GET: APIRoute = async ({ url }) => {
  try {    
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(f => /\.jpg$/i.test(f));
    
    const imagesWithStats = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(IMAGES_DIR, filename);
        const stats = await fs.stat(filePath);
        return {
          id: path.parse(filename).name,
          filename,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      })
    );
    
    imagesWithStats.sort((a, b) => a.filename.localeCompare(b.filename));
    
    const total = imagesWithStats.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedImages = imagesWithStats.slice(start, end);
    
    return new Response(JSON.stringify({
      images: paginatedImages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to list images',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {    
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (files.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No files provided' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const uploadedFiles = [];

    console.log('Writing', files);
    
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name;
        const filePath = path.join(IMAGES_DIR, filename);
        
        console.log('writing file');
        await fs.writeFile(filePath, buffer);
        console.log('done');
        
        uploadedFiles.push({
          id: path.parse(filename).name,
          filename,
          size: buffer.length,
        });
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      uploaded: uploadedFiles,
      count: uploadedFiles.length,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to upload images',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request: ids must be a non-empty array' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const deleted = [];
    const failed = [];
    
    for (const id of ids) {
      try {
        const files = await fs.readdir(IMAGES_DIR);
        const matchingFile = files.find(f => path.parse(f).name === id);
        
        if (matchingFile) {
          const filePath = path.join(IMAGES_DIR, matchingFile);
          await fs.unlink(filePath);
          deleted.push({ id, filename: matchingFile });
        } else {
          failed.push({ id, reason: 'File not found' });
        }
      } catch (error) {
        failed.push({ 
          id, 
          reason: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      deleted,
      failed,
      deletedCount: deleted.length,
      failedCount: failed.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to delete images',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}