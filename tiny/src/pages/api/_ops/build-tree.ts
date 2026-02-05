import fs from 'fs/promises';
import path from 'path';
import { MANIFESTS_DIR, META_DIR } from './_paths';
import type { ExtendedImageMetadata, ImageMetadata, Manifest, RootFolder } from '@/types';

export interface DirectoryTree {

  root: RootFolder;

  getManifest(id: string): Manifest;

}

const parseId = (manifest: any) => manifest?.id?.split('/').pop()?.replace(/\.[^.]+$/, '');

const parseName = (manifest: any) => manifest?.label?.en?.[0];

const parseImages = (manifest: any): ImageMetadata[] => 
  manifest?.items?.map((i: any) => { 
    const id = i.id?.split('/').pop()
    const name = i.label?.en?.[0];
    const { width, height } = i;

    return {
      id,
      filename: name,
      width,
      height
    }
  }) || [];

export const buildDirectoryTree = async (): Promise<DirectoryTree> => {
  // Image JSON descriptors - source of truth for images
  const metafiles = (await fs.readdir(META_DIR)).filter(f => f.endsWith('.json'));

  // IIIF presentation manifests - source of truth for the directory tree
  const manifestFiles = (await fs.readdir(MANIFESTS_DIR)).filter(f => f.endsWith('.json'));

  // In the tiny.iiif view, each manifest is going to be represented as a directory
  const manifests: Manifest[] = [];

  for (const m of manifestFiles) {
    try {
      const raw = await fs.readFile(path.join(MANIFESTS_DIR, m), 'utf8');
      const manifest = JSON.parse(raw);

      const id = parseId(manifest);
      const name = parseName(manifest);

      if (!id || !name) {
        console.error('Invalid manifest');
        console.error(raw);
        continue;
      }

      const images = parseImages(manifest);

      manifests.push({
        id,
        name, 
        type: 'manifest',
        images
      });
    } catch {
      console.error(`Error reading metadata: ${m}`);
      continue;
    }
  }

  const allImages = metafiles.map(m => m.replace(/\.[^.]+$/, ''));
  const imagesInManifests = new Set(manifests.flatMap(m => (m.images || []).map(i => i.id)));

  const unassignedImageIds = allImages.filter(i => !imagesInManifests.has(i));
  const unassignedImages: ImageMetadata[] = [];

  for (const i of unassignedImageIds) {
    const raw = await fs.readFile(path.join(META_DIR, `${i}.json`), 'utf8');
    const metadata: ExtendedImageMetadata = JSON.parse(raw);

    if (!metadata.id) {
      console.error('Invalid image metadata');
      console.error(raw);
      continue;
    }

    unassignedImages.push(metadata);
  }

  const root: RootFolder = {
    type: 'root',
    folders: manifests,
    images: unassignedImages
  };

  const getManifest = (id: string) => manifests.find(m => m.id === id);

  return { root, getManifest };

}