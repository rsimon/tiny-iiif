import type { ImageMetadata } from '@/types';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || '';

export const getInfoJsonURL = (image: ImageMetadata, origin: string = BACKEND_BASE) => {
  return `${origin}/iiif/2/${image.id}/info.json`;
}