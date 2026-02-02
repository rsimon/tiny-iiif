import path from 'path';
import fs from 'fs/promises';
import { customAlphabet } from 'nanoid';
import type { ManifestMetadata } from '@/types';
import { MANIFESTS_DIR } from '..';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const createManifest = async (name: string): Promise<ManifestMetadata> => {
  const id = nanoid();

  const manifest = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: `http://localhost/manifests/${id}.json`,
    type: 'Manifest',
    label: {
      en: [
        name
      ]
    },
    items: []
  };

  const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return { id, name };
}