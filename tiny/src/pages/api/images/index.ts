import type { APIRoute } from 'astro';
import { createImage } from './_create-image';
import { deleteImage } from './_delete-image';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => { 
  const formData = await request.formData();

  const file = formData.get('file');
  const manifest = formData.get('manifest');

  // TODO if uploading to a manifest, add images
  console.log('uploading to', manifest);
  
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ 
      error: 'No image files in request' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const meta = await createImage(file.name, buffer);

    return new Response(JSON.stringify(meta), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

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
    
    const deleted: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const id of ids) {
      try {
        await deleteImage(id);
        deleted.push(id);
      } catch (error) {
        failed.push({ id, reason: error.message });
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