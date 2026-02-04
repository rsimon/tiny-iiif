import type { ImageMetadata } from '@/types';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || '';

export const getThumbnailURL = (image: ImageMetadata, width: number, height: number, origin: string = BACKEND_BASE) => {
  const sourceAspect = image.width / image.height;
  const thumbnailAspect = width / height;

  let requestWidth: number;
  let requestHeight: number;
    
  if (sourceAspect > thumbnailAspect) {
    requestHeight = height;
    requestWidth = Math.ceil(height * sourceAspect);
  } else {
    requestWidth = width;
    requestHeight = Math.ceil(width / sourceAspect);
  }

  return `${origin}/iiif/2/${image.id}/full/${requestWidth},${requestHeight}/0/default.jpg`;
}