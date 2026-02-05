import fs from 'fs/promises';
import path from 'path';
import { MANIFESTS_DIR } from './_paths';

export const reorderImagesInManifest = async (manifestId: string, images: string[], moveToIndex: number) => {
  const manifestPath = path.join(MANIFESTS_DIR, `${manifestId}.json`);
  const raw = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  const imageIdSet = new Set(images);

  const itemsToMove: typeof manifest.items = [];
  const remainingItems: typeof manifest.items = [];

  for (const item of manifest.items) {
    // Canvas item ID format: {origin}/manifests/${manifestId}/canvas/${image.id}
    const canvasIdParts = item.id.split('/');
    const imageId = canvasIdParts[canvasIdParts.length - 1];

    if (imageIdSet.has(imageId))
      itemsToMove.push(item);
    else
      remainingItems.push(item);
  }

  const newItems = [
    ...remainingItems.slice(0, moveToIndex),
    ...itemsToMove,
    ...remainingItems.slice(moveToIndex)
  ];

  manifest.items = newItems;

  return fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}