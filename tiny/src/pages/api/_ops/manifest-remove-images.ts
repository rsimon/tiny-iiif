import fs from 'fs/promises';
import path from 'path';
import { MANIFESTS_DIR } from './_paths';

export const removeImagesFromManifest = async (manifestId: string, imageIds: string[]) => {
  // Load manifest file
  const manifestPath = path.join(MANIFESTS_DIR, `${manifestId}.json`);
  const raw = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  // Canvas item ID format: {origin}/manifests/${manifestId}/canvas/${image.id}
  const updatedItems = (manifest.items || []).filter(item => {
    const canvasIdParts = item.id.split('/');
    const imageId = canvasIdParts[canvasIdParts.length - 1];
    return !imageIds.includes(imageId);
  });

  const patched = {
    ...manifest,
    items: updatedItems
  };

  return fs.writeFile(manifestPath, JSON.stringify(patched, null, 2), 'utf8');
}