import type { APIRoute } from 'astro';
import { buildDirectoryTree } from './_utils/build-tree';
import type { 
  APIListDirectoryResponseImageItem, 
  APIListDirectoryResponseItem 
} from '@/types';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '100');
  
  const folder = url.searchParams.get('dir');

  const tree = await buildDirectoryTree();

  const directory = folder 
    ? tree.getManifest(folder)
    : tree.root;

  const allItems: APIListDirectoryResponseItem[] = [
    ...(directory.folders || []),
    ...(directory.images || []).map(i => ({ type: 'image', ...i }as APIListDirectoryResponseImageItem))
  ];

  const items = allItems.slice(offset, offset + limit);

  return new Response(JSON.stringify({
    total: allItems.length,
    offset,
    limit,
    items
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

}