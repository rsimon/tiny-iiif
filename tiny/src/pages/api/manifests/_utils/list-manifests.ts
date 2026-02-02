import path from 'path';
import fs from 'fs/promises';
import { MANIFESTS_DIR } from '..';
import type { ManifestMetadata } from '@/types';

export const listManifests = async (offset: number, limit: number) => {
  const manifestFiles = (await fs.readdir(MANIFESTS_DIR)).filter(f => f.endsWith('.json'));
      
  const total = manifestFiles.length;

  const all: ManifestMetadata[] = [];
  
  for (const m of manifestFiles) {
    try {
      const raw = await fs.readFile(path.join(MANIFESTS_DIR, m), 'utf8');
      const manifest = JSON.parse(raw);

      const id = m.substring(0, m.indexOf('.json'));
      const name = manifest.label?.en[0];

      if (!id || !name) {
        console.error('Invalid manifest');
        console.error(raw);
        continue;
      }
        
      all.push({ id, name });
    } catch {
      console.error(`Error reading metadata: ${m}`);
      continue;
    }
  }
  
  all.sort((a, b) => a.name.localeCompare(b.name));  
  
  const manifests = all.slice(offset, offset + limit);

  return { manifests, total };
}