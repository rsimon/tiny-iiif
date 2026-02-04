import type { APIRoute } from 'astro';
import { buildDirectoryTree } from './_build-tree';
import type { DirectoryItem } from '@/types';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '100');
  
  const folder = url.searchParams.get('dir');

  const tree = await buildDirectoryTree();

  const directory = folder 
    ? tree.getManifest(folder)
    : tree.root;

  const subfolders = (directory.type === 'root' ? directory.folders : directory.ranges) || [];
  const images = directory.images || [];

  const allItems: DirectoryItem[] = [
    ...subfolders,
    ...images
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