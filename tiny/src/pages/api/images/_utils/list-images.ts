import path from 'path';
import fs from 'fs/promises';
import type { ImageMetadata } from '@/types';
import { META_DIR } from '..';

export const listImages = async (offset: number, limit: number) => {
  const metafiles = (await fs.readdir(META_DIR)).filter(f => f.endsWith('.json'));
      
  const total = metafiles.length;
  
  const all: ImageMetadata[] = [];
  
  for (const m of metafiles) {
    try {
      const raw = await fs.readFile(path.join(META_DIR, m), 'utf8');
      const metadata = JSON.parse(raw);

      if (!metadata.id) {
        console.error('Invalid metadata');
        console.error(raw);
        continue;
      }
        
      all.push(metadata);
    } catch {
      console.error(`Error reading metadata: ${m}`);
      continue;
    }
  }
  
  all.sort((a, b) => a.filename.localeCompare(b.filename));  
  
  const images = all.slice(offset, offset + limit);

  return { images, total };
}