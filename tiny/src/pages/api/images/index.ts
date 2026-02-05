import type { APIRoute } from 'astro';
import { createImage } from '../_ops/image-create';
import { deleteImage } from '../_ops/image-delete';
import { addImagesToManifest } from '../_ops/manifest-add-images';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => { 
  const formData = await request.formData();

  const file = formData.get('file');
  const manifest = formData.get('manifest');

  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ 
      error: 'No image files in request' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    // Create image + metadata file
    const buffer = Buffer.from(await file.arrayBuffer());
    const meta = await createImage(file.name, buffer);



    // Optional: add image to manifest
    if (manifest) {
      console.log('uploding file', meta, 'manifest', manifest);
      await addImagesToManifest(manifest.toString(), [meta.id], url.origin);
    }

    return new Response(JSON.stringify(meta), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
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