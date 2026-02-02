import type { ImageMetadata } from '@/types';

export const getThumbnailURL = (image: ImageMetadata, width: number, height: number) => {
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

  return `http://localhost/iiif/2/${image.id}/full/${requestWidth},${requestHeight}/0/default.jpg`;
}