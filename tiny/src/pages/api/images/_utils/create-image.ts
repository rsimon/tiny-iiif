import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import { customAlphabet } from 'nanoid';
import type { ImageFormat, ImageMetadata } from '@/types';
import { IMAGES_DIR, META_DIR } from '..';

const ALLOWED_FORMATS = new Set([
  'jpeg', 
  'jpg',
  'jp2',
  'png', 
  'tiff',
  'tif',
  'webp'
]);

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const createImage = async (filename: string, buffer: Buffer): Promise<ImageMetadata> => {
  const id = nanoid();

  const { width, height, format }  = await sharp(buffer).metadata();

  if (!width || !height)
    throw new Error(`Error reading image file`);

  if (!format || !ALLOWED_FORMATS.has(format))
    throw new Error(`Unsupported image format: ${format ?? 'unknown'}`);

  const imagePath = path.join(IMAGES_DIR, id);

  // Write image file to /images folder
  await fs.writeFile(imagePath, buffer);

  const { size } = await fs.stat(imagePath);

  const meta: ImageMetadata = {
    id,
    filename,
    format: format as ImageFormat,
    width,
    height,
    fileSize: size,
    uploadedAt: new Date().toISOString()
  };

  await fs.writeFile(
    path.join(META_DIR, `${id}.json`),
    JSON.stringify(meta, null, 2)
  );

  return meta;
}