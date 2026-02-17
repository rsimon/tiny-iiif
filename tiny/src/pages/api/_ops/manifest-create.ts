import path from 'path';
import fs from 'fs/promises';
import { customAlphabet } from 'nanoid';
import { MANIFESTS_DIR } from './_paths';
import { MANIFEST_TEMPLATE } from './_templates';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const createManifest = async (name: string, origin: string) => {
  const id = nanoid();

  const manifest = MANIFEST_TEMPLATE(id, name, origin);

  const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return { id, name };
}