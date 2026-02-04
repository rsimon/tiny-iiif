import path from 'path';
import fs from 'fs/promises';
import { IMAGES_DIR, META_DIR } from '../_paths';

export const deleteImage = async (id: string) => {
  const meta = path.join(META_DIR, `${id}.json`);
  const image = path.join(IMAGES_DIR, `${id}`);

  try {
    await fs.rm(meta);
  } catch (error) {
    console.error(error.message);
    throw new Error('File not found (metadata)');
  }

  try {
    await fs.rm(image);
  } catch (error) {
    console.error(error.message);
    throw new Error('File not found (image)');
  }
}