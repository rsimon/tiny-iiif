import type { APIRoute } from 'astro';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request  }) => {
  try {
    const id = params.manifestId;

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