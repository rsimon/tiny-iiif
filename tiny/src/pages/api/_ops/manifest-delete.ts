import path from 'path';
import fs from 'fs/promises';
import { MANIFESTS_DIR } from './_paths';

export const deleteManifest = async (id: string) => {
  try {
    const manifestPath = path.join(MANIFESTS_DIR, `${id}.json`);
    await fs.rm(manifestPath);
  } catch (error) {
    console.error(error.message);
    throw new Error('File not found (metadata)');
  }
}