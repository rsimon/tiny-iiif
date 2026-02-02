import type { ImageMetadata } from '@/types';

export const getInfoJsonURL = (image: ImageMetadata, origin?: string) => {
  return `${origin || ''}/iiif/2/${image.id}/info.json`;
}