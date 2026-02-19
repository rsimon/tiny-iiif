import type { ImageMetadata } from '@/types';
import { getOrigin } from './utils';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || getOrigin();
const IIIF_IMAGE_PATH = import.meta.env.PUBLIC_IIIF_IMAGE_PATH;

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

  return `${origin}${IIIF_IMAGE_PATH}${image.id}/full/${requestWidth},${requestHeight}/0/default.jpg`;
}