import type { ImageMetadata } from '@/types';

export const getInfoJsonURL = (image: ImageMetadata) => {
  return `http://localhost/iiif/2/${image.id}/info.json`;
}